// Function to update the Messenger user Data //
const _ = require("lodash");
const AWS = require("aws-sdk");

var ddb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
 module.exports = async (id, field, data, field2, data2) => {
     if(field2){
        params = {
            TableName: 'wit_clients',
            Key: {
            "clientID" : id,
            },
            UpdateExpression: `set ${field} = :ss, ${field2} = :ss2`,
            ExpressionAttributeValues:{
                ":ss":`${data}`,
                ":ss2":`${data2}`
            },
        };
     } else {
        params = {
            TableName: 'wit_clients',
            Key: {
            "clientID" : id,
            },
            UpdateExpression: `set ${field} = :ss`,
            ExpressionAttributeValues:{
                ":ss":`${data}`
            },
        };
     }

     const request = docClient.update(params);
         const result = await request.promise();
         return result;
  };