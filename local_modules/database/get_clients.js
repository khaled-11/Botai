/// Function to get Clients data from the Database ///
const _ = require("lodash");
const AWS = require("aws-sdk");

var ddb = new AWS.DynamoDB();
module.exports = async (user_id) => {
  var data;
  try{
    const params = {
      TableName: 'wit_clients',
      Key: {
        'clientID': {S: user_id}
      },
      ProjectionExpression: 'clientID, user_name, user_email, pages_id, pages_name, pages_language, pages_state, app_type, current_page, update_state'
    };
  
  const request = ddb.getItem(params);
  data = await request.promise();
  } catch(e){
      throw(e);
  }
    return data;
};
