const _ = require("lodash");
const AWS = require("aws-sdk");


var docClient = new AWS.DynamoDB.DocumentClient();
 module.exports = async data => {
    const params = {
        TableName: 'wit_pages',
        Key: {
            "pageID" : data[0],
        },

        UpdateExpression : `SET #attrName.#Name = :attrValue, received_list[${data[1]}] = :attrValue2`,
    ExpressionAttributeNames : {
        "#attrName" : "received",
        "#Name" : `Received Message #${data[1]}`
      },
      ExpressionAttributeValues : {
        ":attrValue" :  [data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9]],
        ":attrValue2" :  `Received Message #${data[1]}`       
      } 
    };
    const request = docClient.update(params);
    const result = await request.promise();
    return ;
  };