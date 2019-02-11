'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');

function createResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.saveCategory = (event, context, callback) => {
  const Category = JSON.parse(event.body);
  console.log(Category);
  Category.categoryId = uuidv1();

  databaseManager.saveCategory(Category).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.getCategory = (event, context, callback) => {
  const categoryId = event.pathParameters.categoryId;

  databaseManager.getCategory(categoryId).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.deleteCategory = (event, context, callback) => {
  const categoryId = event.pathParameters.categoryId;

  databaseManager.deleteCategory(categoryId).then(response => {
    callback(null, createResponse(200, 'Category was deleted'));
  });
};

module.exports.updateCategory = (event, context, callback) => {
  const categoryId = event.pathParameters.categoryId;

  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  databaseManager.updateCategory(categoryId, paramName, paramValue).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.triggerStream = (event, context, callback) => {
  console.log('trigger stream was called');

  const eventData = event.Records[0];
  //console.log(eventData);

  console.log(eventData.dynamodb.NewImage);
  callback(null, null);
};
