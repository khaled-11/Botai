const _ = require("lodash");
const AWS = require("aws-sdk");

var ddb = new AWS.DynamoDB();

var docClient = new AWS.DynamoDB.DocumentClient();
 module.exports = async data => {
   var i = 1;
   if (data[5] === "api" || data[7] === "api"){

    if(data[1] === "GET_STARTED"){
      data[2] = ""
      var params = {
        TableName: 'wit_pages',
        Key: {
            "pageID" : data[0],
        },

        UpdateExpression : `SET #attrName2.#Name = :attrValue, postbacks_list[${i}] = :attrValue4, #attrName.#Name2 = :attrValue2, intents_list[${i}] = :attrValue5, #attrName.#Name3 = :attrValue3, intents_list[${i+1}] = :attrValue6, bot_type = :attrValue7, post_link = :attrValue8, #attrName3.#Name4 = :attrValue9, utterances_list[${i}] = :attrValue11, #attrName3.#Name5 = :attrValue10, utterances_list[${i+1}] = :attrValue12`,
    ExpressionAttributeNames : {
        "#attrName" : "intents",
        "#attrName2" : "postbacks",
        "#attrName3" : "utterances",
        "#Name" : `${data[1]}`,
        "#Name2" : `${data[3]}`,
        "#Name3" : `${data[5]}`,
        "#Name4" : `${data[9]}`,
        "#Name5" : `${data[10]}`
      },
      ExpressionAttributeValues : {
        ":attrValue" :  [data[2],1],
        ":attrValue2" :  [data[4],1],                
        ":attrValue3" :  [data[6],2],
        ":attrValue4" :  `${data[1]}`,
        ":attrValue5" :  `${data[3]}`,                
        ":attrValue6" :  `${data[5]}`,
        ":attrValue7" :  `${data[7]}`,
        ":attrValue8" :  `${data[8]}`,
        ":attrValue9" :  [1, data[3], "intial"],
        ":attrValue10" :  [2, data[5], "intial"],
        ":attrValue11" :  `${data[9]}`,
        ":attrValue12" :  `${data[10]}`
      } 
    };
  } else {
    var params = {
      TableName: 'wit_pages',
      Key: {
          "pageID" : data[0],
      },

      UpdateExpression : `SET #attrName.#Name2 = :attrValue2, intents_list[${i}] = :attrValue, #attrName.#Name3 = :attrValue3, intents_list[${i+1}] = :attrValue6, bot_type = :attrValue7, post_link = :attrValue8, #attrName3.#Name4 = :attrValue9, utterances_list[${i}] = :attrValue11, #attrName3.#Name5 = :attrValue10, utterances_list[${i+1}] = :attrValue12`,
  ExpressionAttributeNames : {
      "#attrName" : "intents",
      "#attrName3" : "utterances",
      "#Name2" : `${data[1]}`,
      "#Name3" : `${data[3]}`,
      "#Name4" : `${data[7]}`,
      "#Name5" : `${data[8]}`
    },
    ExpressionAttributeValues : {
      ":attrValue" :  `${data[1]}`,                
      ":attrValue2" :  [data[2],1],                
      ":attrValue3" :  [data[4],2],
      ":attrValue6" :  `${data[3]}`,
      ":attrValue7" :  `${data[5]}`,
      ":attrValue8" :  `${data[6]}`,
      ":attrValue9" :  [1, data[1], "intial"],
      ":attrValue10" :  [2, data[3], "intial"],
      ":attrValue11" :  `${data[7]}`,
      ":attrValue12" :  `${data[8]}`
    } 
  };
  }


   } else{





      if(data[1] === "GET_STARTED"){
        var params = {
          TableName: 'wit_pages',
          Key: {
              "pageID" : data[0],
          },

          UpdateExpression : `SET #attrName2.#Name = :attrValue, postbacks_list[${i}] = :attrValue4, #attrName.#Name2 = :attrValue2, intents_list[${i}] = :attrValue5, #attrName.#Name3 = :attrValue3, intents_list[${i+1}] = :attrValue6, bot_type = :attrValue7, #attrName3.#Name4 = :attrValue9, utterances_list[${i}] = :attrValue11, #attrName3.#Name5 = :attrValue10, utterances_list[${i+1}] = :attrValue12`,
      ExpressionAttributeNames : {
          "#attrName" : "intents",
          "#attrName2" : "postbacks",
          "#attrName3" : "utterances",
          "#Name" : `${data[1]}`,
          "#Name2" : `${data[3]}`,
          "#Name3" : `${data[5]}`,
          "#Name4" : `${data[8]}`,
          "#Name5" : `${data[9]}`
        },
        ExpressionAttributeValues : {
          ":attrValue" :  [data[2],1],
          ":attrValue2" :  [data[4],1],                
          ":attrValue3" :  [data[6],2],
          ":attrValue4" :  `${data[1]}`,
          ":attrValue5" :  `${data[3]}`,                
          ":attrValue6" :  `${data[5]}`,
          ":attrValue7" :  `${data[7]}`,
          ":attrValue9" :  [1,data[3], "intial"],
          ":attrValue10" :  [2, data[5], "intial"],
          ":attrValue11" :  `${data[8]}`,
          ":attrValue12" :  `${data[9]}`
        } 
      };
    } else {
      var params = {
        TableName: 'wit_pages',
        Key: {
            "pageID" : data[0],
        },

        UpdateExpression : `SET #attrName.#Name2 = :attrValue2, intents_list[${i}] = :attrValue, #attrName.#Name3 = :attrValue3, intents_list[${i+1}] = :attrValue6, bot_type = :attrValue7, #attrName3.#Name4 = :attrValue9, utterances_list[${i}] = :attrValue11, #attrName3.#Name5 = :attrValue10, utterances_list[${i+1}] = :attrValue12`,
    ExpressionAttributeNames : {
        "#attrName" : "intents",
        "#attrName3" : "utterances",
        "#Name2" : `${data[1]}`,
        "#Name3" : `${data[3]}`,
        "#Name4" : `${data[6]}`,
        "#Name5" : `${data[7]}`
      },
      ExpressionAttributeValues : {
        ":attrValue" :  `${data[1]}`,
        ":attrValue2" :  [data[2],1],                
        ":attrValue3" :  [data[4],2],
        ":attrValue6" :  `${data[3]}`,
        ":attrValue7" :  `${data[5]}`,
        ":attrValue9" :  [1, data[1], "intial"],
        ":attrValue10" :  [2, data[3], "intial"],
        ":attrValue11" :  `${data[6]}`,
        ":attrValue12" :  `${data[7]}`    
      } 
    };
    }
   }
    const request = docClient.update(params);
    const result = await request.promise();
    return result;
  };