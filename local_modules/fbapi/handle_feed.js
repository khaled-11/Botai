// Function to handle the Postbacks //
const CryptoJS = require("crypto-js"),
callSendAPI = require("../messenger/callSendAPI"),
rp = require('request-promise'),
getPages = require('../database/get_page'),
witResolve = require("../wit/resolve"),
updateSent = require("../database/update_sent_events"),
updateComments = require('../database/update_comments');

module.exports = async (id, changes) => {
  pageData = await getPages(id);
  if (pageData.Item){
    if (pageData.Item.bot_type.S === "api"){
      if (changes && changes[0] && changes[0].value){
        var bytes  = CryptoJS.AES.decrypt(pageData.Item.page_access_token.S, process.env.KEY);
        var token = bytes.toString(CryptoJS.enc.Utf8); 
        if (changes[0].value.verb === "add"){
          if (changes[0].value.item === "comment"){
            if (changes[0].value.message){
              var nlpData = await witResolve(changes[0].value.message, pageData.Item.wit_key.S);
              if (nlpData){
                var myNLP = JSON.stringify(nlpData);
              } else {
                var myNLP = JSON.stringify({})
              }
            } 
            else {
              var myNLP = JSON.stringify({})
            }
            if (changes[0].value.from.id !== id){
              var state;
              try {
                body = {"new_comment":"Your page received the following event.","pageID": `${id}`, "senderID": `${changes[0].value.from.id}`, "userName":`${changes[0].value.from.name}`, "timestamp": `${Math.floor(Date.now() / 1000)}`, "eventType": `comment`, "value": `${changes[0].value.message}`, "nlp": `${myNLP}`}
                var options = {
                  method: 'post',
                  uri: `${pageData.Item.post_link.S}`,
                  body: JSON.stringify(body),
                  headers: { 'Content-Type': 'application/json' },
                };
                state = await rp(options);
                if (state.includes("{{user_first_name}}")){
                  state = state.replace("{{user_first_name}}", `${changes[0].value.from.name}`)
                }
                state = JSON.parse(state); 
                if (state && state.token === pageData.Item.post_secret.S){          
                  response = state.response.response;
                  if (state.response.persona_id !== "none"){
                    persona_id = state.response.persona_id
                  } else {
                    persona_id = null;
                  }
                  st = await callSendAPI(null, response, null, null, token, persona_id, changes[0].value.comment_id);
                  if (!st.recipient_id && state.secondaryResponse){
                    st2 = await callSendAPI(null, state.secondaryResponse, null, null, token, null, changes[0].value.comment_id);
                    if (!st2.recipient_id){
                      resStat = "failed"
                      data = {'comment_id':changes[0].value.comment_id ,'message': changes[0].value.message, 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':"none"}
                      newIndex = pageData.Item.comments_count.N;
                      newIndex++;
                      await updateComments(id,"add",data, newIndex); 
                    } else {
                      resStat = "replaced"
                      data = {'comment_id':changes[0].value.comment_id ,'message': changes[0].value.message, 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':"replied"}
                      newIndex = pageData.Item.comments_count.N;
                      newIndex++;
                      await updateComments(id,"add",data, newIndex); 
                      var myArray = [];
                      if (state.secondaryResponse.text && state.secondaryResponse.quick_replies){
                        my_response_type = `Quick replies(${response.quick_replies.length}).`
                      } else if (state.secondaryResponse.text){
                        my_response_type = "Text."
                      }
                      myArray[0] = [`${my_response_type}`, `Default`, `${resStat}`, `Secondary Response`]
                      var sentEventData = [`${pageData.Item.pageID.S}`, `${pageData.Item.sent_list.L.length}`,`${changes[0].value.from.id}`, `${changes[0].value.created_time}`, "Comment", myArray]
                      await updateSent(sentEventData);
                    }
                  } else if (!st.recipient_id && !state.secondaryResponse){
                    resStat = "failed"
                    data = {'comment_id':changes[0].value.comment_id ,'message': changes[0].value.message, 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':"none"}
                    newIndex = pageData.Item.comments_count.N;
                    newIndex++;
                    await updateComments(id,"add",data, newIndex); 
                  } else {
                    resStat = "success"
                    data = {'comment_id':changes[0].value.comment_id ,'message': changes[0].value.message, 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':"replied"}
                    newIndex = pageData.Item.comments_count.N;
                    newIndex++;
                    await updateComments(id,"add",data, newIndex);
                    if (response.text && response.quick_replies){
                      my_response_type = `Quick replies(${response.quick_replies.length})`
                    } else if (response.text){
                      my_response_type = "Text"
                    } else if (response.attachment && response.attachment.type ==="audio"){
                      my_response_type = "Audio attachment"
                    } else if (response.attachment && response.attachment.type ==="video"){
                      my_response_type = "Video attachment"
                    } else if (response.attachment && response.attachment.type ==="image"){
                      my_response_type = "Image attachment"
                    } else if (response.attachment && response.attachment.type ==="file"){
                      my_response_type = "File attachment"
                    } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "generic" ){
                      my_response_type = "Generic template"
                    } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "button" ){
                      my_response_type = "Button template"
                    } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "media" ){
                      my_response_type = "Media template"
                    } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "airline_boardingpass" ){
                      my_response_type = "Airline boardingpass template"
                    } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "airline_checkin"){
                      my_response_type = "Airline check-in template"
                    } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "airline_itinerary"){
                      my_response_type = "Airline itinerary template"
                    } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "airline_update"){
                      my_response_type = "Airline update template"
                    } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "receipt" ){
                      my_response_type = "Receipt template"
                    } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "product" ){
                      my_response_type = "Product template"
                    }
                    var myArray = [];
                    myArray[0] = [`${my_response_type}`, `${persona_id}`, `${resStat}`, `Custom Response`]
                    var sentEventData = [`${pageData.Item.pageID.S}`, `${pageData.Item.sent_list.L.length}`,`${changes[0].value.from.id}`, `${changes[0].value.created_time}`, "Comment", myArray]
                    await updateSent(sentEventData);
                  }
                } else {
                  data = {'comment_id':changes[0].value.comment_id ,'message': changes[0].value.message, 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':"none"}
                  newIndex = pageData.Item.comments_count.N;
                  newIndex++;
                  await updateComments(id,"add",data, newIndex);
                }
              }
              catch (e){
                data = {'comment_id':changes[0].value.comment_id ,'message': changes[0].value.message, 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':"none"}
                newIndex = pageData.Item.comments_count.N;
                newIndex++;
                await updateComments(id,"add",data, newIndex);              
              }
            }
            else {
              data = {'comment_id':changes[0].value.comment_id ,'message': changes[0].value.message, 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':"none"}
              newIndex = pageData.Item.comments_count.N;
              newIndex++;
              await updateComments(id,"add",data, newIndex);
            } 
          }
        }
        else if (changes[0].value.verb === "remove"){
          data = {'comment_id':changes[0].value.comment_id}
          if (pageData.Item.comments.M[`${changes[0].value.comment_id}`]){
            newIndex = pageData.Item.comments_count.N
            newIndex--
          } else {
            newIndex = pageData.Item.comments_count.N
            newIndex++
            newIndex--
          }
          await updateComments(id,"remove",data, newIndex)
        }
      }
    }
    else if (pageData.Item.bot_type.S === "hosted"){ 
      var bytes  = CryptoJS.AES.decrypt(pageData.Item.page_access_token.S, process.env.KEY);
      var token = bytes.toString(CryptoJS.enc.Utf8); 
      if (changes && changes[0] && changes[0].value){
        if (changes[0].value.verb === "add"){
          if (changes[0].value.item === "comment"){
            var reply_name;
            if (pageData.Item.auto_reply.S === "false"){
              if (changes[0].value.message){
                data = {'comment_id':changes[0].value.comment_id ,'message': changes[0].value.message, 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':"none"}
              } else {
                data = {'comment_id':changes[0].value.comment_id ,'message': "NO TEXT FOUND", 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':"none"}
              }
              newIndex = pageData.Item.comments_count.N;
              newIndex++;
              await updateComments(id,"add",data, newIndex);
            } 
            else if (pageData.Item.auto_reply.S === "auto_default"){
              reply_name = pageData.Item.responses.M[`default_reply`].L[1].S
              if (pageData.Item.secondary_responses.M[`default_reply`]){
                secondaryResponse = pageData.Item.secondary_responses.M[`default_reply`].L[0].S;
                if (secondaryResponse.includes("{{user_first_name}}")){
                  secondaryResponse = secondaryResponse.replace("{{user_first_name}}", `${changes[0].value.from.name}`)
                }
              }
              responses = pageData.Item.responses.M[`default_reply`].L[0].S;
              if (responses.includes("{{user_first_name}}")){
                responses = responses.replace("{{user_first_name}}", `${changes[0].value.from.name}`)
              }
              if (changes[0].value.message){
                data = {'comment_id':changes[0].value.comment_id ,'message': changes[0].value.message, 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':"replied_+_Default_+_Default"}
              } else {
                data = {'comment_id':changes[0].value.comment_id ,'message': "NO TEXT FOUND", 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':"replied_+_Default_+_Default"}
              }
              newIndex = pageData.Item.comments_count.N;
              newIndex++;
              await updateComments(id,"add",data, newIndex);
            } else {
              if (changes[0].value.message){
                var myNLP = await witResolve(changes[0].value.message, pageData.Item.wit_key.S);
                if (myNLP && myNLP.intents[0] && pageData.Item.responses.M[`${myNLP.intents[0].name}`]){
                  reply_name = pageData.Item.responses.M[`${myNLP.intents[0].name}`].L[1].S
                  var responses;
                  var secondaryResponse;
                  if (pageData.Item.secondary_responses.M[`${myNLP.intents[0].name}`]){
                    secondaryResponse = pageData.Item.secondary_responses.M[`${myNLP.intents[0].name}`].L[0].S;
                    if (secondaryResponse.includes("{{user_first_name}}")){
                      secondaryResponse = secondaryResponse.replace("{{user_first_name}}", `${changes[0].value.from.name}`)
                    }
                  }
                  responses = pageData.Item.responses.M[`${myNLP.intents[0].name}`].L[0].S
                  if (responses.includes("{{user_first_name}}")){
                    responses = responses.replace("{{user_first_name}}", `${changes[0].value.from.name}`)
                  }
                  data = {'comment_id':changes[0].value.comment_id ,'message': changes[0].value.message, 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':`replied_+_${myNLP.intents[0].name}_+_${pageData.Item.responses.M[`${myNLP.intents[0].name}`].L[1].S}`}
                  newIndex = pageData.Item.comments_count.N;
                  newIndex++;
                  await updateComments(id,"add",data, newIndex);
                } else {
                  reply_name = pageData.Item.responses.M[`default_reply`].L[1].S
                  if (pageData.Item.secondary_responses.M[`default_reply`]){
                    secondaryResponse = pageData.Item.secondary_responses.M[`default_reply`].L[0].S;
                    if (secondaryResponse.includes("{{user_first_name}}")){
                      secondaryResponse = secondaryResponse.replace("{{user_first_name}}", `${changes[0].value.from.name}`)
                    }
                  }
                  responses = pageData.Item.responses.M[`default_reply`].L[0].S;
                  if (responses.includes("{{user_first_name}}")){
                    responses = responses.replace("{{user_first_name}}", `${changes[0].value.from.name}`)
                  }
                  data = {'comment_id':changes[0].value.comment_id ,'message': changes[0].value.message, 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':`replied_+_Default_+_Default`}
                  newIndex = pageData.Item.comments_count.N;
                  newIndex++;
                  await updateComments(id,"add",data, newIndex);
                }
              } else {
                reply_name = pageData.Item.responses.M[`default_reply`].L[1].S
                if (pageData.Item.secondary_responses.M[`default_reply`]){
                  secondaryResponse = pageData.Item.secondary_responses.M[`default_reply`].L[0].S;
                  if (secondaryResponse.includes("{{user_first_name}}")){
                    secondaryResponse = secondaryResponse.replace("{{user_first_name}}", `${changes[0].value.from.name}`)
                  }
                }
                responses = pageData.Item.responses.M[`default_reply`].L[0].S;
                if (responses.includes("{{user_first_name}}")){
                  responses = responses.replace("{{user_first_name}}", `${changes[0].value.from.name}`)
                }
                data = {'comment_id':changes[0].value.comment_id ,'message': changes[0].value.message, 'from_id': changes[0].value.from.id, 'from_name':changes[0].value.from.name, 'post_id':changes[0].value.post.id,'post_link':changes[0].value.post.permalink_url, 'reply_state':`replied_+_Default_+_Default`}
                newIndex = pageData.Item.comments_count.N;
                newIndex++;
                await updateComments(id,"add",data, newIndex);
              }
            }   
            if (pageData.Item.auto_reply.S !== "false" && changes[0].value.from.id !== pageData.Item.pageID.S){
              var secondaryFinalData;
              if (secondaryResponse){
                secondaryFinalData = JSON.parse(secondaryResponse)
              }
              finalData = JSON.parse(responses)
              if (finalData.persona_id){
                persona_id = finalData.persona_id;
              } else {
                persona_id = null;
              }
              var my_response_type = ""
              var resStat
              // Loop to send the main response
              for ( i = 0 ; i < finalData.response.length ; i++){
                response = finalData.response[i].response;
                if (response.text && response.quick_replies){
                  my_response_type += `Quick replies(${response.quick_replies.length}), `
                } else if (response.text){
                  my_response_type += "Text, "
                } else if (response.attachment && response.attachment.type ==="audio"){
                  my_response_type += "Audio attachment, "
                } else if (response.attachment && response.attachment.type ==="video"){
                  my_response_type += "Video attachment, "
                } else if (response.attachment && response.attachment.type ==="image"){
                  my_response_type += "Image attachment, "
                } else if (response.attachment && response.attachment.type ==="file"){
                  my_response_type += "File attachment, "
                } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "generic" ){
                  my_response_type += "Generic template, "
                } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "button" ){
                  my_response_type += "Button template, "
                } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "media" ){
                  my_response_type += "Media template, "
                } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "airline_boardingpass" ){
                  my_response_type += "Airline boardingpass template, "
                } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "airline_checkin"){
                  my_response_type += "Airline check-in template, "
                } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "airline_itinerary"){
                  my_response_type += "Airline itinerary template, "
                } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "airline_update"){
                  my_response_type += "Airline update template, "
                } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "receipt" ){
                  my_response_type += "Receipt template, "
                } else if (response.attachment && response.attachment.type ==="template" && response.attachment.payload.template_type === "product" ){
                  my_response_type += "Product template, "
                }
                st = await callSendAPI(null, response, null, null, token, persona_id, changes[0].value.comment_id);
                resStat = "success"
                if (!st.recipient_id && secondaryFinalData){
                  resStat = "replaced";
                  response = secondaryFinalData.response[i].response;
                  st2 = await callSendAPI(null, response, null, null, token, null, changes[0].value.comment_id);
                  if (!st2.recipient_id){
                    resStat = "failed"
                  }
                }
              }
              var myArray = [];
              myArray[0] = [`${my_response_type.substring(0,my_response_type.length-2)}`, `${persona_id}`, `${resStat}`, `${reply_name}`]
              var sentRventData = [`${pageData.Item.pageID.S}`, `${pageData.Item.sent_list.L.length}`,`${changes[0].value.from.id}`, `${changes[0].value.created_time}`, "Comment", myArray]
              await updateSent(sentRventData);
            }
          }
        }
        else if (changes[0].value.verb === "remove"){
          data = {'comment_id':changes[0].value.comment_id}
          if (pageData.Item.comments.M[`${changes[0].value.comment_id}`]){
            newIndex = pageData.Item.comments_count.N
            newIndex--
          } else {
            newIndex = pageData.Item.comments_count.N
            newIndex++
            newIndex--
          }
          await updateComments(id,"remove",data, newIndex)
        }
      }
    }
  }
}