/// Function to get user data from the Database ///
const _ = require("lodash");
const AWS = require("aws-sdk");

var ddb = new AWS.DynamoDB();
module.exports = async client_id => {
  var data;
  try{
    const params = {
      TableName: 'wit_clients',
      Key: {
        'clientID': {S: client_id}
      }
    };
  
  const request = ddb.deleteItem(params);
  data = await request.promise();
  } catch(e){
throw(e);
  }
    // in case no blocks are found return undefined
    return data;
  };
