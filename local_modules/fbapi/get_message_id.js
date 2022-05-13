// Function to get Persistent Menu Data for Page
const rp = require('request-promise'),
fs = require("fs");

module.exports = async (page_id, message_id, token) => {
    var results;
    try{
        var options = {
          method: 'GET',
          uri: `https://graph.facebook.com/v9.0/${page_id}?access_token=${token}&fields=conversations`,
          json: true
      };
      conv = await rp(options);
      for (i = 0 ; i < conv.conversations.data.length ; i++){
        try{
            var options = {
              method: 'GET',
              uri: `https://graph.facebook.com/v9.0/${conv.conversations.data[i].id}?access_token=${token}&fields=messages`,
              json: true
          };
          search = await rp(options);
          for (j = 0 ; j < search.messages.data.length ; j++){
              if (search.messages.data[j].id === message_id){
                try{
                    var options = {
                      method: 'GET',
                      uri: `https://graph.facebook.com/v9.0/${conv.conversations.data[i].id}?access_token=${token}&fields=participants`,
                      json: true
                  };
                  results = await rp(options);
                } catch (e){
                  return;
                }
                j = search.messages.data.length +1;
                i = conv.conversations.data.length +1;
              }
          }
          }
          catch (e){
            return;
          }
      }
    }
    catch (e){
      return;
    }
    return results;  
};