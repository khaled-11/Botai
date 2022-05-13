// Function to update the client pages //
const _ = require("lodash");
const AWS = require("aws-sdk");

var ddb = new AWS.DynamoDB();

var docClient = new AWS.DynamoDB.DocumentClient();
module.exports = async (id, count, data) => {
     const params = {
          TableName: 'wit_clients',
          Key: {
               "clientID" : id,
          },
          UpdateExpression: `set pages_name[${count}] = :attrValue, pages_language[${count}] = :attrValue2, pages_state[${count}] = :attrValue3, pages_id[${count}] = :attrValue4, app_type[${count}] = :attrValue5`,
          ExpressionAttributeValues: {
               ":attrValue": `${data.page_name}`,
               ":attrValue2": `----`,
               ":attrValue3": `inactive`,
               ":attrValue4": `${data.page_id}`,
               ":attrValue5": `----`
          }
     };
     const request = docClient.update(params);
     const result = await request.promise();
     return result;
}; 