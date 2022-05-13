const _ = require("lodash");
const AWS = require("aws-sdk");


var docClient = new AWS.DynamoDB.DocumentClient();
 module.exports = async (page_id, sender_psid, data, index) => {
   if (data.profile_pic){
    var params = {
      TableName: 'wit_pages',
      Key: {
          "pageID" : page_id,
      },

      UpdateExpression : `SET #attrName.#Name = :attrValue, users_list[${index}] = :attrValue2`,
  ExpressionAttributeNames : {
      "#attrName" : "users_data",
      "#Name" : `${sender_psid}`
    },
    ExpressionAttributeValues : {
      ":attrValue" :  [data.first_name, data.last_name, data.profile_pic, "", "user", "", index],
      ":attrValue2" :  `${sender_psid}`       
    } 
  };
   } else {
    var params = {
      TableName: 'wit_pages',
      Key: {
          "pageID" : page_id,
      },

      UpdateExpression : `SET #attrName.#Name = :attrValue, users_list[${index}] = :attrValue2`,
  ExpressionAttributeNames : {
      "#attrName" : "users_data",
      "#Name" : `${sender_psid}`
    },
    ExpressionAttributeValues : {
      ":attrValue" :  [data.first_name, data.last_name, "imapcted", "impacted", "user", "", index],
      ":attrValue2" :  `${sender_psid}`       
    } 
  };
   }

    const request = docClient.update(params);
    const result = await request.promise();
    return ;
  };