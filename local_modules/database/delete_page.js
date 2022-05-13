/// Function to get user data from the Database ///
const _ = require("lodash");
const AWS = require("aws-sdk");

var ddb = new AWS.DynamoDB();
module.exports = async pageID => {
  var data;
  try{
    const params = {
      TableName: 'wit_pages',
      Key: {
        'pageID': {S: pageID},
      }
    };
  
  const request = ddb.deleteItem(params);
  data = await request.promise();
  } catch(e){
    throw (e);
  }
    // in case no blocks are found return undefined
    return data;
  };
