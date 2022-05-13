const _ = require("lodash");
const AWS = require("aws-sdk");

var docClient = new AWS.DynamoDB.DocumentClient();
module.exports = async (pageID, type, data, index) => {
  if (type === "add"){
    if (index){
      var params = {
        TableName: 'wit_pages',
        Key: {
            "pageID" : pageID,
        },
        UpdateExpression : `SET #attrName.#Name = :attrValue1, comments_count = :attrvalue2, comments_list[${index+1}] = :attrvalue3`,
        ExpressionAttributeNames : {
            "#attrName" : "comments",
            "#Name" : `${data.comment_id}`
        },
        ExpressionAttributeValues : {
          ":attrValue1" : [data.message, data.from_id, data.from_name, data.post_id, data.post_link, data.reply_state],
          ":attrvalue2" :index,
          ":attrvalue3" :`${data.comment_id}`
        } 
      };
    } else {
      var params = {
        TableName: 'wit_pages',
        Key: {
            "pageID" : pageID,
        },
        UpdateExpression : `SET #attrName.#Name = :attrValue1`,
        ExpressionAttributeNames : {
            "#attrName" : "comments",
            "#Name" : `${data.comment_id}`
        },
        ExpressionAttributeValues : {
          ":attrValue1" : [data.message, data.from_id, data.from_name, data.post_id, data.post_link, data.reply_state]
        } 
      };
    }
  }
  else {
    var params = {
      TableName: 'wit_pages',
      Key: {
          "pageID" : pageID,
      },
      UpdateExpression : `remove #attrName.#Name set comments_count = :attrvalue2`,
      ExpressionAttributeNames : {
        "#attrName" : "comments",
        "#Name" : `${data.comment_id}`
      },
      ExpressionAttributeValues : {
        ":attrvalue2" :index
      } 
    };
  }
  request = docClient.update(params);
  result = await request.promise();
  return result;
};