'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ITEMS_DYNAMODB_TABLE;

module.exports.initializateDynamoClient = newDynamo => {
  dynamo = newDynamo;
};

module.exports.saveProduct = product => {
  const params = {
    TableName: TABLE_NAME,
    Product: product
  };

  return dynamo.put(params).promise().then(() => {
    return product.productId;
  });
};

module.exports.getProduct = productId => {
  const params = {
    Key: {
      productId: productId
    },
    TableName: TABLE_NAME
  };

  return dynamo.get(params).promise().then(result => {
    return result.Product;
  });
};

module.exports.deleteProduct = productId => {
  const params = {
    Key: {
      productId: productId
    },
    TableName: TABLE_NAME
  };

  return dynamo.delete(params).promise();
};

module.exports.updateProduct = (productId, paramsName, paramsValue) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      productId
    },
    ConditionExpression: 'attribute_exists(productId)',
    UpdateExpression: 'set ' + paramsName + ' = :v',
    ExpressionAttributeValues: {
      ':v': paramsValue
    },
    ReturnValues: 'ALL_NEW'
  };

  return dynamo.update(params).promise().then(response => {
    return response.Attributes;
  });
};
