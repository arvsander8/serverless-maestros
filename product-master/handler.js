'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');

function createResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.saveProduct = (event, context, callback) => {
  const product = JSON.parse(event.body);
  if(Object.keys(product).length == 7)
  {
    if( Object.keys(product)[0] == 'code' &&
        Object.keys(product)[1] == 'name' &&
        Object.keys(product)[2] == 'description' &&
        Object.keys(product)[3] == 'brand' &&
        Object.keys(product)[4] == 'model' &&
        Object.keys(product)[5] == 'stock' &&
        Object.keys(product)[6] == 'unit' &&
        Object.keys(product)[7] == 'category' ){
          console.log("Cabeceras correctas");
          product.productId = uuidv1();
          databaseManager.saveProduct(product).then(response => {
            console.log(response);
            callback(null, createResponse(200, response));
          });
        }
        else{
          console.log("La información ingresada no es correcta");
        }

  }
  else{
    console.log("Debe contener los 8 parametros requeridos");
  }

  

  
  
};

module.exports.getProduct = (event, context, callback) => {
  const productId = event.pathParameters.productId;

  databaseManager.getProduct(productId).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.deleteProduct = (event, context, callback) => {
  const productId = event.pathParameters.productId;

  databaseManager.deleteProduct(productId).then(response => {
    callback(null, createResponse(200, 'Product was deleted'));
  });
};

module.exports.updateProduct = (event, context, callback) => {
  const productId = event.pathParameters.productId;

  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  databaseManager.updateProduct(productId, paramName, paramValue).then(response => {
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
