/// Function used to add page data ///
const _ = require("lodash");
const AWS = require("aws-sdk");

var ddb = new AWS.DynamoDB();
module.exports = async (data) => {
    const params = {
        TableName: 'wit_pages',
        Item: {
        'pageID' : {S: `${data.page_id}`},
        'page_name' : {S: `${data.page_name}`},
        'responses' : {M:  {"response": {L: [{"S":"response"},{"S":'name'},{"S":'type'}]}}},
        'secondary_responses' : {M:  {"response": {L: [{"S":"response"},{"S":'name'},{"S":'type'}]}}},
        'utterances' : {M:  {"Utterance": {L: [{"S":"Utterance"}, {"S":"Intent Name"}, {"N":'0'}]}}},
        'utterances_list' : {L:  [{"S": "utterance name"}]},
        'sent' : {M:  {"Sent Event No": {L: [{"S":"userID"}, {"S":"timestamp"}, {"S":"eventType"}, {"L": [{"L":[{"S":"response type"}, {"S":"response value"}, {"S":"respond state"}]}]}]}}},
        'received_list' : {L:  [{"S": "Received event no."}]},
        'received' : {M:  {"Received Event No": {L: [{"S":"senderID"}, {"S":"timestamp"}, {"S":"eventType"}, {"S":"value"}, {"S":"nlp"}, {"S":"reply state"}, {"S":"reply id"}]}}},
        'sent_list' : {L:  [{"S": "Sent event no."}]},
        'users_data' : {M:  {"PSID": {L: [{"S": "user first name"}, {"S": "user last name"}, {"S": "profile picture"}, {"S": "general state"}, {"S": "user type"}, {"S": "user email"}, {"N":'0'}]}}},
        'users_list' : {L:  [{"S": "sender PSID"}]},
        'page_access_token' : {S: `${data.page_access_token}`},
        'wit_key' : {S: ``},
        'app_id' : {S: ``},
        'isImpacted' : {S: ``},
        'admins' : {L:  [{"S": "admin PSID"}]},
        'p_index' : {N: `${data.page_index}`},
        'bot_type' : {S: ``},
        'post_secret' : {S: ``},
        'post_link' : {S: ``},
        'comments_list' : {L:  [{"S": "Comment ID"}]},
        'comments' : {M:  {"comment_id": {L: [{"S":'message'},{"S":'from_name'},{"S":'from_id'},{"S":'post_id'},{"S":'post_link'},{"S":'reply_state'}]}}},
        'auto_reply' : {S: `false`},
        'comments_count' : {N: `0`}
    }};
    const request = ddb.putItem(params);
    const result = await request.promise();
    return result;
};
