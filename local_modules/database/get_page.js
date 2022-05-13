/// Function to get Page data from the Database ///
const _ = require("lodash");
const AWS = require("aws-sdk");

AWS.config.update({region: 'us-east-1'});


var ddb = new AWS.DynamoDB();
module.exports = async (page_id) => {
  var data;
  try{
    const params = {
      TableName: 'wit_pages',
      Key: {
        'pageID': {S: page_id}
      },
      ProjectionExpression: 'comments_count, comments_list, auto_reply, pageID, comments, isImpacted, app_id, utterances, utterances_list, page_access_token, wit_key, page_name, admin, users_data, users_list, p_index, bot_type, post_link, post_secret, received, sent, sent_list, received_list, responses, secondary_responses'
    };
  
  const request = ddb.getItem(params);
  data = await request.promise();

  } catch(e){
      throw(e);
  }
    return data;
};
