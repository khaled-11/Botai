// Function to handle the Postbacks //
const CryptoJS = require("crypto-js"),
rp = require('request-promise'),
callSendAPI = require("./callSendAPI"),
createUserMenu = require("./create_user_menu"),
deleteUserMenu = require("./delete_user_persistent_menu"),
requestData = require("./req_data"),
getPages = require('../database/get_page'),
updateReceived = require("../database/update_received_events"),
updateSent = require("../database/update_sent_events"),
putUser = require("../database/put_user");

module.exports = async (sender_psid, page_id, webhook_event) => {
  pageData = await getPages(page_id);
  if (pageData.Item){
    var bytes  = CryptoJS.AES.decrypt(pageData.Item.page_access_token.S, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8); 
    await senderEffect(sender_psid, "mark_seen");
    if(webhook_event.pass_thread_control){
      payload = `HANDOVER_FROM_INBOX`;
    }
    else if(webhook_event.message && webhook_event.message.quick_reply){
      payload = webhook_event.message.quick_reply.payload;
    }
    else if (webhook_event.postback.payload === "GET_STARTED" && webhook_event.postback.referral){
      if (webhook_event.postback.referral.source === "CUSTOMER_CHAT_PLUGIN"){
        payload = `GET_STARTED_WEB_PLUGIN`;
      } else{
        payload = `GET_STARTED_REF_${webhook_event.postback.referral.ref}`;
      }
    } else if(webhook_event.postback.payload === "CSHOP"){
      if (userData[0].S === "Guest"){
        payload = `GUEST_TO_INBOX`;
      } else {
        await pass_thread(sender_psid);
        payload = `HANDOVER_TO_INBOX`;
      }
    }
    else {
      payload = webhook_event.postback.payload;
    }    
    var getData = true;
    for (i = 1 ; i < pageData.Item.users_list.L.length ; i++){
      if (pageData.Item.users_list.L[i].S.includes(sender_psid)){
        var userData = pageData.Item.users_data.M[sender_psid].L;
        getData = false;
      }
    }
    if (getData == true){
        await deleteUserMenu(token,sender_psid)
        await createUserMenu(token,sender_psid)
        var fbData = await requestData(sender_psid, token);
        await putUser(page_id, sender_psid, fbData, pageData.Item.users_list.L.length)
        var pageData = await getPages(page_id);
        var userData = pageData.Item.users_data.M[sender_psid].L;
    }
    if (pageData.Item.bot_type.S === "api"){
      var state;
      try{
        body = {"new_msg":"Your page received the following event.","pageID": `${webhook_event.recipient.id}`, "senderID": `${webhook_event.sender.id}`, "timestamp": `${webhook_event.timestamp}`, "eventType": `postback`, "value": `${payload}`, "nlp": ``}
        var options = {
          method: 'post',
          uri: `${pageData.Item.post_link.S}`,
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        };
        state = await rp(options);
        if (state.includes("{{user_first_name}}")){
          state = state.replace("{{user_first_name}}", `${userData[0].S}`)
        }
        state = JSON.parse(state);
        if (state && state.token === pageData.Item.post_secret.S){
          await senderEffect(sender_psid, "typing_on");
          if (state.response.persona_id !== "none"){
            persona_id = state.response.persona_id
          } else {
            persona_id = null;
          }
          var myL = []
          var my_response_type = ""
          for ( i = 0 ; i < state.response.responses.length ; i++){
            await senderEffect(sender_psid, "typing_on");    
            response = state.response.responses[i];
            var action = null;
            fileN = null;
            st = await callSendAPI(sender_psid, response, action, fileN, token, persona_id);
            if (!st.recipient_id && state.secondaryResponse[i]){
              st2 = await callSendAPI(sender_psid, state.secondaryResponse[i], action, fileN, token, null);
              if (!st2.recipient_id){
                myL[i] = `SECONDARYFAIL___None___failed`             
              } else {
                if (state.secondaryResponse[i].text && state.secondaryResponse[i].quick_replies){
                  my_response_type += `Quick replies(${state.secondaryResponse[i].quick_replies.length}), `
                } else if (state.secondaryResponse[i].text){
                  my_response_type += "Text, "
                }
                myL[i] = `${my_response_type}___Default___replaced`
              }
            }
            else if (!st.recipient_id && !state.secondaryResponse && !state.secondaryResponse[i]){
              myL[i] = `NOSECONDARY___None___failed`
            }
            else {
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
              myL[i] = `${my_response_type.substring(0,my_response_type.length-2)}___${persona_id}___success`
            }
          }

          var myArray = [];
          for (p = 0 ; p < myL.length; p ++){
            myArray[myArray.length] = [`${my_response_type.substring(0,my_response_type.length-2)}`, `${myL[p].split("___")[1]}`, `${myL[p].split("___")[2]}`]
          }
          var sentEventData = [`${webhook_event.recipient.id}`, `${pageData.Item.sent_list.L.length}`,`${webhook_event.sender.id}`, `${webhook_event.timestamp}`, `Postback`, myArray]
          await updateSent(sentEventData);
          if (my_response_type.length > 3){
            eventData = [`${webhook_event.recipient.id}`, `${pageData.Item.received_list.L.length}`,`${webhook_event.sender.id}`, `${webhook_event.timestamp}`, 'Postback', `${payload}`, ``,`${my_response_type.substring(0,my_response_type.length-2)}`, `${pageData.Item.sent_list.L.length}`]
            await updateReceived(eventData);
          } else {
            eventData = [`${webhook_event.recipient.id}`, `${pageData.Item.received_list.L.length}`,`${webhook_event.sender.id}`, `${webhook_event.timestamp}`, 'Postback', `${payload}`, ``,`secret not valid`, ``]
            await updateReceived(eventData); 
          }
        }
        else {
          eventData = [`${webhook_event.recipient.id}`, `${pageData.Item.received_list.L.length}`,`${webhook_event.sender.id}`, `${webhook_event.timestamp}`, 'Postback', `${payload}`, ``,`secret not valid`, ``]
          await updateReceived(eventData);
        }
      }
      catch (e){
        eventData = [`${webhook_event.recipient.id}`, `${pageData.Item.received_list.L.length}`,`${webhook_event.sender.id}`, `${webhook_event.timestamp}`, 'Postback', `${payload}`, ``,`link failed`, ``]
        await updateReceived(eventData);
      }
    }
    
    // Hosted
    else if (pageData.Item.bot_type.S === "hosted"){ 
      await senderEffect(sender_psid, "typing_on");
      // Look for responses
      var responses;
      var reply_name;

      if (pageData.Item.responses.M[`${payload}`]){
        reply_name = pageData.Item.responses.M[`${payload}`].L[1].S
        responses = pageData.Item.responses.M[`${payload}`].L[0].S
        if (responses.includes("{{user_first_name}}")){
          responses = responses.replace("{{user_first_name}}", `${userData[0].S}`)
        }
      // If the response is not found for this payload
      } else {
        reply_name = pageData.Item.responses.M[`non_recognized`].L[1].S
        responses = pageData.Item.responses.M[`non_recognized`].L[0].S;
        if (responses.includes("{{user_first_name}}")){
          responses = responses.replace("{{user_first_name}}", `${userData[0].S}`)
        }
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
        var action = null;
        fileN = null;
        st = await callSendAPI(sender_psid, response, action, fileN, token, persona_id);
        resStat = "success"
        // If it failed, replace with secondary response if any.
        if (!st.recipient_id){ 
          if (finalData.secondaryResponse[0] && finalData.secondaryResponse[0]){
            resStat = "replaced";
            response = finalData.secondaryResponse[0].response;
            var action = null;
            fileN = null;
            st2 = await callSendAPI(sender_psid, response, action, fileN, token, null);
            if (!st2.recipient_id){
              resStat = "failed"
            }
          } else {
            resStat = "failed"
          }
        }
      }
      var myArray = [];
      myArray[0] = [`${my_response_type.substring(0,my_response_type.length-2)}`, `${persona_id}`, `${resStat}`, `${reply_name}`]
      eventData = [`${pageData.Item.pageID.S}`, `${pageData.Item.received_list.L.length}`,`${sender_psid}`, `${webhook_event.timestamp}`, 'Postback', `${payload}`, ``,`${my_response_type.substring(0,my_response_type.length-2)}`, `${pageData.Item.sent_list.L.length}`]
      await updateReceived(eventData);
      var sentRventData = [`${pageData.Item.pageID.S}`, `${pageData.Item.sent_list.L.length}`,`${sender_psid}`, `${webhook_event.timestamp}`, "Postback", myArray]
      await updateSent(sentRventData);
    }
    // Function to send Sender Effects //
    async function senderEffect(sender_psid, action_needed){
      try{
        response = null;
        action = action_needed;
        await callSendAPI(sender_psid, response, action, null, token);
      }
      catch(e){
        throw (e);
      }
      return;
    }
  }
}