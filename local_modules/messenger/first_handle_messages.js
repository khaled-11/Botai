const CryptoJS = require("crypto-js"),
rp = require('request-promise'),
callSendAPI = require("./callSendAPI"),
deleteUserMenu = require("./delete_user_persistent_menu"),
createUserMenu = require("./create_user_menu"),
readAudio = require("./read_audio"),
convertAudio = require('./convert_audio'),
requestData = require("./req_data"),
postSpeech = require('../wit/post_speech'),
witResolve = require("../wit/resolve"),
putUser = require("../database/put_user"),
updateReceived = require("../database/update_received_events"),
updateSent = require("../database/update_sent_events"),
getPages = require('../database/get_page');

module.exports = async (sender_psid, page_id, webhook_event) => {
  pageData = await getPages(page_id);
  pageData = await getPages(page_id);
  if (pageData.Item){
    var bytes  = CryptoJS.AES.decrypt(pageData.Item.page_access_token.S, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8); 
    await senderEffect(sender_psid, "mark_seen");
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
      if (webhook_event.message.text){
        var nlpData = await witResolve(webhook_event.message.text, pageData.Item.wit_key.S);   
        var myNLP = JSON.stringify(nlpData);
        value = webhook_event.message.text
        type = "message_text"
        typeStr = "Text Message"
      } else {
        var nlpData = await witResolve(webhook_event.message.text, pageData.Item.wit_key.S);   
        var myNLP = JSON.stringify({});
        value = JSON.stringify(webhook_event.message.attachments);
        type = "message_attachment"
        typeStr = `${webhook_event.message.attachments[0].type} Attachment`
        webhook_event.message.text = webhook_event.message.attachments[0].payload.url
      }
      var state;
      try{
        body = {"new_msg":"Your page received the following event.","pageID": `${webhook_event.recipient.id}`, "senderID": `${webhook_event.sender.id}`, "timestamp": `${webhook_event.timestamp}`, "eventType": `${type}`, "value": `${value}`, "nlp": `${myNLP}`}
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
          var sentEventData = [`${webhook_event.recipient.id}`, `${pageData.Item.sent_list.L.length}`,`${webhook_event.sender.id}`, `${webhook_event.timestamp}`, `${typeStr}`, myArray]
          await updateSent(sentEventData);
          if (my_response_type.length > 3){
            eventData = [`${webhook_event.recipient.id}`, `${pageData.Item.received_list.L.length}`,`${webhook_event.sender.id}`, `${webhook_event.timestamp}`, `${typeStr}`, `${webhook_event.message.text}`, ``,`${my_response_type.substring(0,my_response_type.length-2)}`, `${pageData.Item.sent_list.L.length}`]
            await updateReceived(eventData);
          } else {
            eventData = [`${webhook_event.recipient.id}`, `${pageData.Item.received_list.L.length}`,`${webhook_event.sender.id}`, `${webhook_event.timestamp}`, `${typeStr}`, `${webhook_event.message.text}`, ``,`secret not valid`, ``]
            await updateReceived(eventData); 
          }
        }
        else {
          eventData = [`${webhook_event.recipient.id}`, `${pageData.Item.received_list.L.length}`,`${webhook_event.sender.id}`, `${webhook_event.timestamp}`, `${typeStr}`, `${webhook_event.message.text}`, ``,`secret not valid`, ``]
          await updateReceived(eventData);
        }
      }
      catch (e){
        eventData = [`${webhook_event.recipient.id}`, `${pageData.Item.received_list.L.length}`,`${webhook_event.sender.id}`, `${webhook_event.timestamp}`, `${typeStr}`, `${webhook_event.message.text}`, ``,`link failed`, ``]
        await updateReceived(eventData);
      }
    }
  
    else if (pageData.Item.bot_type.S === "hosted"){ 
      state = await senderEffect(sender_psid, "typing_on");
    // Boolean to search and check for the user.
      if (webhook_event.message.text){
        // Get the NLP from the Wit App.
        var myNLP = await witResolve(webhook_event.message.text, pageData.Item.wit_key.S);
      }
      var reply_name;
      // If there NLP response from the Wit App
      if (myNLP){
        if (myNLP.intents[0]){
          name = myNLP.intents[0].name;
          var responses;
          var secondaryResponse;
          if (pageData.Item.responses.M[`${name}`]){
            reply_name = pageData.Item.responses.M[`${name}`].L[1].S
            responses = pageData.Item.responses.M[`${name}`].L[0].S
            if (responses.includes("{{user_first_name}}")){
              responses = responses.replace("{{user_first_name}}", `${userData[0].S}`)
            }
          } else {
            reply_name = pageData.Item.responses.M[`non_recognized`].L[1].S
              responses = pageData.Item.responses.M[`non_recognized`].L[0].S;
              if (responses.includes("{{user_first_name}}")){
                responses = responses.replace("{{user_first_name}}", `${userData[0].S}`)
              }
          }
        }
         else {
          i = 0;
          check = false
          for (x in myNLP.entities){
            name = x.split(":")[0];
            var responses;
            var secondaryResponse;
            if (pageData.Item.responses.M[`${name}`]){
              responses = pageData.Item.responses.M[`${name}`].L[0].S
              if (responses.includes("{{user_first_name}}")){
                responses = responses.replace("{{user_first_name}}", `${userData[0].S}`)
              }
            } else {
                responses = pageData.Item.responses.M[`non_recognized`].L[0].S;
                if (responses.includes("{{user_first_name}}")){
                  responses = responses.replace("{{user_first_name}}", `${userData[0].S}`)
                }
            }
            i++
          }
          if (i == 0){
            responses = pageData.Item.responses.M[`out_of_scope`].L[0].S;
            if (responses.includes("{{user_first_name}}")){
              responses = responses.replace("{{user_first_name}}", `${userData[0].S}`)
            }
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
          if (!st.recipient_id){ 
            if (finalData.secondaryResponse && finalData.secondaryResponse[0]){
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
      } else {
        if (webhook_event.message.attachments){
            response = {"text": "Sorry, we accept only text!"}
            var action = null;
            fileN = null;
            await callSendAPI(sender_psid, response, action, fileN, token);
        } else {
        // If we didn't send an error message in the audio section.
        response = {"text": "I am really Sorry, we are having technical issues right now.\nPlease try again!"}
        var action = null;
        fileN = null;
        await callSendAPI(sender_psid, response, action, fileN, token);
        }
    }
    var myArray = [];
    if (my_response_type){
      myArray[0] = [`${my_response_type.substring(0,my_response_type.length-2)}`, `${persona_id}`, `${resStat}`, `${reply_name}`]
      eventData = [`${pageData.Item.pageID.S}`, `${pageData.Item.received_list.L.length}`,`${sender_psid}`, `${webhook_event.timestamp}`, 'Text', `${webhook_event.message.text}`, `${JSON.stringify(myNLP)}`,`${my_response_type.substring(0,my_response_type.length-2)}`, `${pageData.Item.sent_list.L.length}`]
      await updateReceived(eventData);
      var sentRventData = [`${pageData.Item.pageID.S}`, `${pageData.Item.sent_list.L.length}`,`${sender_psid}`, `${webhook_event.timestamp}`, "Text", myArray]
      await updateSent(sentRventData);
    } else {
      myArray[0] = ["Text","","success","Error Message"]
      eventData = [`${pageData.Item.pageID.S}`, `${pageData.Item.received_list.L.length}`,`${sender_psid}`, `${webhook_event.timestamp}`, 'Text', `${webhook_event.message.text}`, `${JSON.stringify(myNLP)}`,`Error Text`, `${pageData.Item.sent_list.L.length}`]
      await updateReceived(eventData);
      var sentRventData = [`${pageData.Item.pageID.S}`, `${pageData.Item.sent_list.L.length}`,`${sender_psid}`, `${webhook_event.timestamp}`, "Text", myArray]
      await updateSent(sentRventData);
    }
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
  // Sleep Funtion to put the App to wait //
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
}




          // // Get the attachment URL to get the file.
          // attachmentUrl = webhook_event.message.attachments[0].payload.url;
          // // If the attachment is "MP4" which will have audio.
          // if (attachmentUrl.includes("mp4")){
          //   // Read the Audio File, and sleep before we open the file again.
          //   read = await readAudio(`${sender_psid}`, attachmentUrl);
          //   await sleep(1500);
          //   // Call function to convert this audio file to "MP3" format.
          //   convert = await convertAudio(`${sender_psid}`);
          //   await sleep(1500);
          //   // Send the "MP3" file to Wit App to get text.
          //   witSpeech = await postSpeech(`${sender_psid}`, pageData.Item.wit_key.S);
          //   // If the request was not successful.
          //   if(!witSpeech){
          //     // Get the error message and send it to the user.
          //     response = {"text": "I am really Sorry, we are having technical issues right now.\nPlease can you try again!"}
          //     var action = null;
          //     fileN = null;
          //     // Variable to terminate future error messages.
          //     var ch = true;
          //     await callSendAPI(sender_psid, response, action, null, token);
          //     // If the request was successful, but there is no text.
          //   } else if(!witSpeech.text){
          //     response = {"text": "I am sorry, but I didn't hear any words."}
          //     var action = null;
          //     fileN = null;
          //     var ch = true;
          //     await callSendAPI(sender_psid, response, action, fileN, token);
          //     // If the request was successful, and there is text.
          //   } else if (witSpeech.text){
          //     // If there is text, and everything was okay!
          //     if (!witSpeech.text.includes("the voice is not set up yet")){
          //       var myNLP = witSpeech;
          //     // If it is the blank file which Wit App will read if no files.
          //     } else {
          //       response = {"text": "I am really Sorry, we are having errors now!"}
          //       var action = null;
          //         fileN = null;
          //         var ch = true;
          //         await callSendAPI(sender_psid, response, action, fileN, token);
          //       }
          //   } 
          // If the user send any message not in "MP4" format.
        //  } else {
                  //  }








                          // if(myNLP.intents[0]){
        //   if(pageData.Item.intents.M[myNLP.intents[0].name]){
        //     thisResponse = JSON.parse(pageData.Item.intents.M[myNLP.intents[0].name].L[0].S);
        //     // Loop over the response to send multiple reponses if any.
        //     for ( i = 0 ; i < thisResponse.length ; i++){
        //       // Send sender effect before each message.
        //       state = await senderEffect(sender_psid, "typing_on");
        //       // Check if the message contains user first name and replace.
        //       if (thisResponse[i].response.text){ 
        //         if (thisResponse[i].response.text.includes("{{user_first_name}}")){
        //           display_message = thisResponse[i].response;
        //           display_message.text = display_message.text.replace("{{user_first_name}}",userData[0].S);
        //           fileN = null;
        //         } else{
        //           display_message = thisResponse[i].response;
        //           fileN = null;
        //         }
        //       } else if (thisResponse[i].response.attachment){
        //         display_message = thisResponse[i].response;
        //         fileN = null;
        //       } else {
        //         display_message  = null;
        //         fileN = thisResponse[i].response.file;
        //       }
        //       // Sending the response.
        //       var action = null;
        //       await callSendAPI(sender_psid, display_message, action, fileN, token);
        //     }
        //   } else {
        //     response = {"text": "no data for this?"}
        //     var action = null;
        //     fileN = null;
        //     await callSendAPI(sender_psid, response, action, fileN, token);
        //   }
        // } else {
        //   response = {"text": "sorry, can't understand this"}
        //   var action = null;
        //   fileN = null;
        //   await callSendAPI(sender_psid, response, action, fileN, token);
        // }
      // If there is no NLP response.
      //l = JSON.parse(pageData.Item.responses.M.non_recognized.L[0].S)
      //console.log(myNLP)