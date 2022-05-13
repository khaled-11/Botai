function mLink(){
  window.open(`https://m.me/${pageData.pageID.S}`, '_blank');
}
function fbLink(){
  window.open(`https://facebook.com/${pageData.pageID.S}`, '_blank');
}
function allPages(){
  $('divMain').replaceWith("<divMain></divMain>");
  window.location.href ="/dashboard"
  $('#load22').show();
}
function privateReplies(){
  $(".page-wrapper").removeClass("toggled");
  $(".sidebar-dropdown").removeClass("active");
  $(".sidebar-submenu").slideUp(200);
  $(".sidebar-dropdown").parent().removeClass("active");
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.title = "Botai | Page Comments Feed";
  mainP = `<divMain><h2>Page Comments Feed</h2><hr><div class="form-group col-md-12"><p>These are the comments on the current and new posts since you linked <b>${pageData.page_name.S}</b> to Botai. You can send private reply <b>(ONE MESSAGE)</b> in Messenger to each comment. If you turn automatic replies on, you can send a default message <b>(Default Private Reply)</b> to all comments, or train the Wit App to understand comments to use all the intents responses. We will replace multi-messages responses with the backup response to satisfy the <b>ONE MESSAGE</b> requirement. <b>Quick Replies</b> after attachments and templates doesn't count as multi messages. Only <b>Text</b> before templates and attachments is counted as multi messages response and the entire response will be replaced with the <b>Text / Quick Replies</b> backup response.</p><p>You can turn the auto-reply feature off and manually reply to each comment using the saved responses or ignore the comment. You may create dummy payload responses to use for your manual replies. The same replacement rules will be applied to manual replies. If a user deleted a comment, it won't be available for private reply and will be deleted from our database immediately.</p></div><hr><div class="row"><div class="form-group col-md-6"><div class="custom-control custom-switch" style = "margin-top:10px; margin-left:10px;"><input type="checkbox" class="custom-control-input"  id="auto_reply_state"><label class="custom-control-label" id = "label_type" for="auto_reply_state">Turn Auto Reply on.</label></div></div><div class="form-group col-md-6"><select id = "reply_type" style="margin-top:10px; display:none;" class="form-control form-control-sm"><option checked value= "default" > Send default message to all comments. </option><option checked value= "nlp" >Use Wit.ai to understand comments.</option></select></div></div><hr><h2>Comments</h2><input class="form-control" id="myInput" type="text" placeholder="Search.."><div class="d-flex justify-content-center"><a class="btn btn-sm btn-info" onclick='refreshData2("feed")'>Refresh</a></div><hr><div class="row row-cols-1 row-cols-sm-2" id ="cards">`
  comments = pageData.comments.M
  for(o = 1 ; o < pageData.comments_list.L.length ; o++){
    if(comments[`${pageData.comments_list.L[o].S}`]){
      mainP += `<dr><div class="col-sm" style="margin-bottom: 15px;"><div class="card"><div class="card-body"><div class="row justify-content-center"><h5 class="card-title">${comments[`${pageData.comments_list.L[o].S}`].L[0].S}</h5></div><hr><p class="card-text">From: ${comments[`${pageData.comments_list.L[o].S}`].L[2].S}</p><p class="card-text">User ID: ${comments[`${pageData.comments_list.L[o].S}`].L[1].S}</p><p class="card-text">Comment ID: ${pageData.comments_list.L[o].S}</p><p class="card-text">Post Link: <a href = "${comments[`${pageData.comments_list.L[o].S}`].L[4].S}">${comments[`${pageData.comments_list.L[o].S}`].L[4].S}</a></p><hr>`
      if (comments[`${pageData.comments_list.L[o].S}`].L[1].S !== pageData.pageID.S){
        if (comments[`${pageData.comments_list.L[o].S}`].L[5].S === "none"){
          mainP += `<div class="row justify-content-center"><button type="button" class="btn btn-primary" style = "margin-top:10px;" id = "reply_to_user_${o}" onclick="showReply('${o}')">Reply to user</button></div><div id = "rep_name_${o}" class="row justify-content-center" style = "display:none"><div class="form-group col-md-9">Response Name: <select id="response_name_${o}" name="response_name">`
          for (x in pageData.responses.M){
            if (x !== "response"){
              mainP += `<option value= "${x}" >${pageData.responses.M[`${x}`].L[1].S}</option>`
            }
          }
          mainP += `</select></div><div class="form-group col-md-6"><div class="row justify-content-center"><button type="button" class="btn btn-success" id = "send_reply_${o}" onclick="sendReply('response_name_${o}_+_${pageData.comments_list.L[o].S}')">Send</button></div></div></div><div id = "success_msg_${o}" class="row justify-content-center" style = "display:none"><h5 class="card-title" style= "color:green; ">Reply Sent! ✔️</h5></div><div id = "fail_msg_${o}" class="row justify-content-center" style = "display:none"><h5 class="card-title" style= "color:red; ">Something went wrong!</h5></div></div></div></div></dr>`
        } 
        else if (comments[`${pageData.comments_list.L[o].S}`].L[5].S === "replied_+_default_+_default"){
          mainP += `<div class="row justify-content-center"><h5 class="card-title" style= "text-align:center; color:green; margin-top:10px;">Replied successfully! ✔️<br>Intent: ${comments[`${pageData.comments_list.L[o].S}`].L[5].S.split("_+_")[1]}. Response: Default Private Reply.</h5></div></div></div></div></dr>`
        } 
        else {
          mainP += `<div class="row justify-content-center"><h5 class="card-title" style= "text-align:center; color:green; margin-top:10px;">Replied successfully! ✔️<br>Intent: ${comments[`${pageData.comments_list.L[o].S}`].L[5].S.split("_+_")[1]}. Response: (${comments[`${pageData.comments_list.L[o].S}`].L[5].S.split("_+_")[2]})</h5></div></div></div></div></dr>`
        }
      } else {
        mainP += `<div class="row justify-content-center"><h5 class="card-title" style= "color:red; margin-top:10px;">Can't reply to this user!</h5></div></div></div></div></dr>`
      }
    }
  }
  mainP +=`</div></div></divMain>`
  $('divMain').replaceWith(mainP);    
  if (pageData.auto_reply.S === "auto_nlp"){
    newVal = `<input type="checkbox" checked class="custom-control-input"  id="auto_reply_state">`
    $('#auto_reply_state').replaceWith(newVal);    
    $('#reply_type').show();
    document.getElementById("reply_type").value = "nlp"
  } else if (pageData.auto_reply.S === "auto_default"){
    newVal = `<input type="checkbox" checked class="custom-control-input"  id="auto_reply_state">`
    $('#auto_reply_state').replaceWith(newVal);    
    $('#reply_type').show();
    document.getElementById("reply_type").value = "default"
  }
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#cards dr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  })
  document.querySelector('#auto_reply_state').addEventListener('change', event => {
    if (document.getElementById("auto_reply_state").checked == true){
      pageData.auto_reply.S = "auto_default"
      fetch(`/update_auto_reply?page_id=${pageData.pageID.S}&value=auto_default`)
      .then(response => response.json())
      .then(data => {
        if (data.fail){
          fetch(`/update_auto_reply?page_id=${pageData.pageID.S}&value=auto_default`)
        }
      })
      .catch((error) => {
        fetch(`/update_auto_reply?page_id=${pageData.pageID.S}&value=auto_default`)
      });
      $('#reply_type').show();
      document.getElementById("label_type").innerHTML = "Turn Auto Reply off."
    } else {
      pageData.auto_reply.S = "false"
      fetch(`/update_auto_reply?page_id=${pageData.pageID.S}&value=false`)
      .then(response => response.json())
      .then(data => {
        if (data.fail){
          fetch(`/update_auto_reply?page_id=${pageData.pageID.S}&value=false`)
        }
      })
      .catch((error) => {
        fetch(`/update_auto_reply?page_id=${pageData.pageID.S}&value=false`)
      });
      $('#reply_type').hide();
      document.getElementById("label_type").innerHTML = "Turn Auto Reply on."
    }
  });
  document.querySelector('#reply_type').addEventListener('change', event => {
    if (document.getElementById("reply_type").value === "default"){
      pageData.auto_reply.S = "auto_default"
      fetch(`/update_auto_reply?page_id=${pageData.pageID.S}&value=auto_default`)
      .then(response => response.json())
      .then(data => {
        if (data.fail){
          fetch(`/update_auto_reply?page_id=${pageData.pageID.S}&value=auto_default`)
        }
      })
      .catch((error) => {
        fetch(`/update_auto_reply?page_id=${pageData.pageID.S}&value=auto_default`)
      });
    } 
    else {
      pageData.auto_reply.S = "auto_nlp"
      fetch(`/update_auto_reply?page_id=${pageData.pageID.S}&value=auto_nlp`)
      .then(response => response.json())
      .then(data => {
        if (data.fail){
          fetch(`/update_auto_reply?page_id=${pageData.pageID.S}&value=auto_nlp`)
        }
      })
      .catch((error) => {
        fetch(`/update_auto_reply?page_id=${pageData.pageID.S}&value=auto_nlp`)
      });
    }
  });
}
function showReply(o){
  $(`#rep_name_${o}`).show();
  $(`#reply_to_user_${o}`).hide();
}
function sendReply(p){
  document.getElementById(`send_reply_${p.split("_+_")[0].split("_")[2]}`).innerHTML = ` 
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Sending </span>`
  document.getElementById(`send_reply_${p.split("_+_")[0].split("_")[2]}`).disabled = true 
  o = p.split("_+_")[0]
  id = p.split("_+_")[1]
  reply = document.getElementById(`${o}`).value
  fetch(`/reply_comment?page_id=${document.getElementById("page_h_id").value}&comment_id=${id}&reply=${reply}`)
  .then(response => response.json())
  .then(data => {
    if (data.success){
      $(`#rep_name_${o.split("_")[2]}`).hide();
      $(`#success_msg_${o.split("_")[2]}`).show();
    } else {
      $(`#fail_msg_${o.split("_")[2]}`).show();
      document.getElementById(`send_reply_${p.split("_+_")[0].split("_")[2]}`).innerHTML = `Send`
      document.getElementById(`send_reply_${p.split("_+_")[0].split("_")[2]}`).disabled = false 
    }
  })
  .catch((error) => {
    sendReply(p);
  });
}
function logs(link){
  $(".page-wrapper").removeClass("toggled");
  $(".sidebar-dropdown").removeClass("active");
  $(".sidebar-submenu").slideUp(200);
  $(".sidebar-dropdown").parent().removeClass("active");
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  if (link === "sendEvents"){
    document.title = "Botai | Sent Messages";
    mainP = `<divMain><h2>Sent Messages</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the messages which was sent from our App to your page users. Each response include the user ID and the timestamp. It also include the original event type, response type, persona ID, and the response status.</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-info" onclick='refreshData("sendEvents")'>Refresh</a></div><hr><div class="container-fluid" style = "width:100%">`;
  for (i = 1 ; i < pageData.sent_list.L.length; i++){
    mainP += `<div class="alert alert-success" role="alert"><div class="table-responsive" id="tbl"><table class="table table-hover"><thead><h5><b>${pageData.sent_list.L[i].S} (${pageData.sent.M[pageData.sent_list.L[i].S].L[3].L[0].L[0].L[0].S})</b></h5></thead><tbody><tr><th scope="row">To user</th><td>${pageData.sent.M[pageData.sent_list.L[i].S].L[0].S}</td></tr><tr><th scope="row">Timestamp</th><td>${pageData.sent.M[pageData.sent_list.L[i].S].L[1].S}</td></tr><tr><th scope="row">Trigger Event</th><td>${pageData.sent.M[pageData.sent_list.L[i].S].L[2].S}</td></tr>`;
    pers = pageData.sent.M[pageData.sent_list.L[i].S].L[3].L[0].L[0].L[1].S;
    if (pers && pers !== "null"){
      mainP +=`
      <tr><th scope="row">Persona ID</th><td >${pageData.sent.M[pageData.sent_list.L[i].S].L[3].L[0].L[0].L[1].S}</td></tr>`
    } else {
      mainP +=`<tr><th scope="row">Persona ID</th><td>Default</td></tr>`
    }
    y = pageData.sent.M[pageData.sent_list.L[i].S].L[3].L[0].L[0].L[2].S;
    if (y === "success"){
      mainP +=`<tr><th scope="row">Responses status</th><td style="color:green">Went through!</td></tr></tbody></table></div></div>`
    } else if (y === "replaced") {
      mainP +=`<tr><th scope="row">Responses status</th><td style="color:blue">Replaced with Secondary</td></tr></tbody></table></div></div>`
    } else {
      mainP +=`<tr><th scope="row">Responses status</th><td style="color:red">Failed</td></tr></tbody></table></div></div>`
    }
  }
  mainP += `</div></div></divMain>`
} 
else if (link === "receivedEvents"){
  document.title = "Botai | Received Messages"
  mainP = `<divMain><h2>Received Messages</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the messages and postbacks your page received after you connected our App. You will see the event type, user ID, timestamp, received value and the reply id.</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-info" onclick='refreshData("receivedEvents")'>Refresh</a></div><hr><div class="container-fluid" style = "width:100%">`;
  for (i = 1 ; i < pageData.received_list.L.length; i++){
    mainP += `<div class="alert alert-success" role="alert"><div class="table-responsive" id="tbl"><table class="table table-hover"><thead><h5><b>${pageData.received_list.L[i].S} (${pageData.received.M[pageData.received_list.L[i].S].L[2].S.toUpperCase()})</b></h5></thead><tbody><tr><th scope="row">From user</th><td>${pageData.received.M[pageData.received_list.L[i].S].L[0].S}</td></tr><tr><th scope="row">Timestamp</th><td>${pageData.received.M[pageData.received_list.L[i].S].L[1].S}</td></tr><tr><th scope="row">Event Value</th><td>${pageData.received.M[pageData.received_list.L[i].S].L[3].S}</td></tr>`;
    if (pageData.received.M[pageData.received_list.L[i].S].L[4].S !== "undefined" && pageData.received.M[pageData.received_list.L[i].S].L[4].S !== ""){
      var myNLP = JSON.parse(pageData.received.M[pageData.received_list.L[i].S].L[4].S)
      if (myNLP.intents[0]){
        mainP +=`<tr><th scope="row">Intent</th><td>${myNLP.intents[0].name}</td></tr>`
      } else {
        mainP +=`<tr><th scope="row">Intent</th><td>Out of Scope</td></tr>`
      }
    }
    if (pageData.received.M[pageData.received_list.L[i].S].L[6].S !== "undefined" && pageData.received.M[pageData.received_list.L[i].S].L[6].S !== ""){
      mainP += `<tr><th scope="row">Reply ID</th><td>Replied with ${pageData.received.M[pageData.received_list.L[i].S].L[5].S}. (Sent Message #${pageData.received.M[pageData.received_list.L[i].S].L[6].S})</td></tr></tbody></table></div></div>`
    } else {
      mainP += `<tr><th scope="row">Reply ID</th><td style="color:red">Failed to Reply</td></tr></tbody></table></div></div>`
    }
  }
  mainP += `</div></div></divMain>`
  }
  $('divMain').replaceWith(mainP);
}
function refreshData(type){
  $('divMain').replaceWith('<divMain></divMain>');
  $('#load22').show();
  fetch(`/page_data?page_id=${document.getElementById("page_h_id").value}`)
  .then(response => response.json())
  .then(data => {
    pageData = data.page_data.Item;
    document.getElementById("page_name").innerHTML = pageData.page_name.S;
    document.getElementById("received_count").innerHTML = pageData.received_list.L.length -1;
    document.getElementById("comments").innerHTML = pageData.comments_count.N;
    document.getElementById("sent_count").innerHTML = pageData.sent_list.L.length -1;
    $('#load22').hide();
    logs(`${type}`) 
  })
  .catch((error) => {
    refreshData(type);
  });
}
function refreshData2(){
  $('divMain').replaceWith('<divMain></divMain>');
  $('#load22').show();
  fetch(`/page_data?page_id=${document.getElementById("page_h_id").value}`)
  .then(response => response.json())
  .then(data => {
    pageData = data.page_data.Item;
    document.getElementById("page_name").innerHTML = pageData.page_name.S;
    document.getElementById("received_count").innerHTML = pageData.received_list.L.length -1;
    document.getElementById("comments").innerHTML = pageData.comments_count.N;
    document.getElementById("sent_count").innerHTML = pageData.sent_list.L.length -1;
    $('#load22').hide();
    privateReplies() 
  })
  .catch((error) => {
    refreshData2();
  });
}
function messengerResponses(){
  $(".page-wrapper").removeClass("toggled");
  $(".sidebar-dropdown").removeClass("active");
  $(".sidebar-submenu").slideUp(200);
  $(".sidebar-dropdown").parent().removeClass("active");
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.title = "Botai | Messenger Responses"
  mainP = `<divMain><h2>App Responses</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the responses for this App. The <b>"Default Response"</b> is used if the received postback or the identified intent doesn't have a response. The <b>"Out of Scope Response"</b> is used when the Wit App identify the user input as out of scope. The <b>"Default Private Reply"</b> is used When you turn on auto reply to comment and choose to use the default reply to all comments. It is also being used if the Wit App identify intent and there is no response for this intent. <b>To change the default responses</b>, please kindly create <b> new payload response</b> with the same values <b>(non_recognized , out_of_scope , default_reply)</b>.</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-success" onclick="addMessengerResponse('addMessengerResponse')">Add Response</a></div><hr></div><div class="container-fluid" style = "width:100%"><div class="table-responsive" id="tbl"><input class="form-control" id="myInput" type="text" placeholder="Search.."><table class="table table-hover table-md" ><thead><tr><th >Response:</th><td></td></tr></thead><tbody>`;
  // Default non recognized message
  let non_recognized = pageData.responses.M.non_recognized.L[0].S;
  let JSON_non_recognized = JSON.parse(non_recognized)
  var response_type = []
  response_type[0] = ""
  persona_name_0 = `${JSON_non_recognized.persona_name}`
  for (i = 0 ; i < JSON_non_recognized.response.length ; i++){
    response_type[0] += getResponseType(JSON_non_recognized.response[i])
  }
  // Default out of scope intents.
  let out_of_scope = pageData.responses.M.out_of_scope.L[0].S;
  let JSON_out_of_scope = JSON.parse(out_of_scope)
  response_type[1] = ""
  persona_name_1 = `${JSON_out_of_scope.persona_name}`
  for (i = 0 ; i < JSON_out_of_scope.response.length ; i++){
    response_type[1] += getResponseType(JSON_out_of_scope.response[i])
  }
  // Default auto reply intents.
  let default_reply = pageData.responses.M.default_reply.L[0].S;
  let JSON_default_reply = JSON.parse(default_reply)
  response_type[2] = ""
  persona_name_2 = `${JSON_default_reply.persona_name}`
  for (i = 0 ; i < JSON_default_reply.response.length ; i++){
    response_type[2] += getResponseType(JSON_default_reply.response[i])
  }
  mainP += `<tr><td><b>${pageData.responses.M['non_recognized'].L[1].S}:</b/> <b style="color:#000080; background-color: #d2f8d2; padding:0.5px;">(${response_type[0].substring(0,response_type[0].length-2)})</b> <b style="color:#000080; background-color: #ffe9ec; padding:0.5px;">Persona: (${persona_name_0})</b><br>Assigned to: <b style="color:#000080; background-color: #DBF3FA; padding:0.5px;">Default: non_recognized</b></td><td align="center"><button type="button" class="btn btn-danger" disabled>Delete</button></td></tr><tr><td><b>${pageData.responses.M['out_of_scope'].L[1].S}:</b/> <b style="color:#000080; background-color: #d2f8d2; padding:0.5px;">(${response_type[1].substring(0,response_type[1].length-2)})</b> <b style="color:#000080; background-color: #ffe9ec; padding:0.5px;">Persona: (${persona_name_1})</b><br>Assigned to: <b style="color:#000080; background-color: #DBF3FA; padding:0.5px;">NLP: out_of_scope</b></td><td align="center"><button type="button" class="btn btn-danger" disabled>Delete</button></td></tr><tr><td><b>${pageData.responses.M['default_reply'].L[1].S}:</b/> <b style="color:#000080; background-color: #d2f8d2; padding:0.5px;">(${response_type[2].substring(0,response_type[2].length-2)})</b> <b style="color:#000080; background-color: #ffe9ec; padding:0.5px;">Persona: (${persona_name_2})</b><br>Assigned to: <b style="color:#000080; background-color: #DBF3FA; padding:0.5px;">Comments: default_reply</b></td><td align="center"><button type="button" class="btn btn-danger" disabled>Delete</button></td></tr>`
  // All Responses
  for (x in pageData.responses.M){
    if (x !== "non_recognized" && x !== "out_of_scope" && x !== "response" && x !== "default_reply"){
      let currentResponse = pageData.responses.M[`${x}`].L[0].S;
      let JSON_currentResponse = JSON.parse(currentResponse)
      my_persona_name = JSON_currentResponse.persona_name;
      var my_response_type = "";
      for (i = 0 ; i < JSON_currentResponse.response.length ; i++){
        my_response_type += getResponseType(JSON_currentResponse.response[i])
      }   
      mainP += `<tr><td><b>${pageData.responses.M[`${x}`].L[1].S}:</b/> <b style="color:#000080; background-color: #d2f8d2; padding:0.5px;">(${my_response_type.substring(0,my_response_type.length-2)})</b> <b style="color:#000080; background-color: #ffe9ec; padding:0.5px;">Persona: (${my_persona_name})</b><br>Assigned to: <b style="color:#000080; background-color: #DBF3FA; padding:0.5px;">${pageData.responses.M[`${x}`].L[2].S}: ${x}</b></td><td align="center"><button type="button" class="btn btn-danger" onclick="deleteResponse('${pageData.responses.M[`${x}`].L[1].S}_+_${x}')">Delete</button></td>`
    }
  }
  mainP += `</tr></tbody></table></div></div> </divMain>`
  $('divMain').replaceWith(mainP);  
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#tbl tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
}
function getResponseType(res){
  let my_response_type = ""
  if (res.response.text && res.response.quick_replies){
    my_response_type += `Quick replies(${res.response.quick_replies.length}), `
  } else if (res.response.text){
    my_response_type += "Text, "
  } else if (res.response.attachment && res.response.attachment.type ==="audio"){
    my_response_type += "Audio attachment, "
  } else if (res.response.attachment && res.response.attachment.type ==="video"){
    my_response_type += "Video attachment, "
  } else if (res.response.attachment && res.response.attachment.type ==="image"){
    my_response_type += "Image attachment, "
  } else if (res.response.attachment && res.response.attachment.type ==="file"){
    my_response_type += "File attachment, "
  } else if (res.response.attachment && res.response.attachment.type ==="template" && res.response.attachment.payload.template_type === "generic" ){
    my_response_type += "Generic template, "
  } else if (res.response.attachment && res.response.attachment.type ==="template" && res.response.attachment.payload.template_type === "button" ){
    my_response_type += "Button template, "
  } else if (res.response.attachment && res.response.attachment.type ==="template" && res.response.attachment.payload.template_type === "media" ){
    my_response_type += "Media template, "
  } else if (res.response.attachment && res.response.attachment.type ==="template" && res.response.attachment.payload.template_type === "airline_boardingpass" ){
    my_response_type += "Airline boardingpass template, "
  } else if (res.response.attachment && res.response.attachment.type ==="template" && res.response.attachment.payload.template_type === "airline_checkin"){
    my_response_type += "Airline check-in template, "
  } else if (res.response.attachment && res.response.attachment.type ==="template" && res.response.attachment.payload.template_type === "airline_itinerary"){
    my_response_type += "Airline itinerary template, "
  } else if (res.response.attachment && res.response.attachment.type ==="template" && res.response.attachment.payload.template_type === "airline_update"){
    my_response_type += "Airline update template, "
  } else if (res.response.attachment && res.response.attachment.type ==="template" && res.response.attachment.payload.template_type === "receipt" ){
    my_response_type += "Receipt template, "
  } else if (res.response.attachment && res.response.attachment.type ==="template" && res.response.attachment.payload.template_type === "product" ){
    my_response_type += "Product template, "
  }
  return my_response_type;
}

  async function addMessengerResponse(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    $('divMain').replaceWith("<divMain></divMain>");  
    $('#load22').show(); 
    var persona;
    await fetch(`/intent_entity?key=${pageData.wit_key.S}`)
    .then(response => response.json())
    .then(data => {
      if (data.intents){
        myIntents = data.intents;
        myEntities = data.entities;
      } else {
        addMessengerResponse();
      }
    })
    .catch((error) => {
      addMessengerResponse();
    });
    tok = {token: `${pageData.page_access_token.S}`}
    var persona;
    await fetch(`/get_personas`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tok)
    })
    .then(response => response.json())
    .then(data => {
      if (data.state){
        persona = data;
        $('#load22').hide(); 
      } else {
        addMessengerResponse();
      }
    })
    .catch((error) => {
      addMessengerResponse();
    });
    document.title = "Botai | New Response"
    mainP = `<divMain>
    <divNew>
    <button class="btn btn-info btn-sm" type="button" onclick = "messengerResponses()" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button>
    <h2>New Response</h2><hr>
    <div class="row">
    <div class="form-group col-md-12">
    <p>To add new response, type the response name, select the response type, then enter the response data. You can assign the response to intents or postback payloads, and add persona if needed. If you add quick replies after attachments or templates, you will not be able to add persona. We will ask for a backup text message to replace attachments and templates messages if the message failed for any reason.</p>
    <hr>
    </div>
    </div>
    <div class="container-fluid" style = "width:100%">
    <div class="row justify-content-center" id="res_warn" style="display:none">
    <h5 style = "color:red">Please fill all the required fields.</h5> 
    </div>
    <div class="row">
      <div class="col-sm-6">
      Response Name:<input type="text" minlength="3" placeholder="Ex: Response for purchase intent" id = "res_name">          
      </div>
      <div class="col-sm-6"> 
      Response type: <select id="response_type" name="response_type">
      <option checked value= "text" >Text</option>
      <option value= "quick_replies" >Quick Replies</option>
      <option value= "attachment" >Attachment</option>
      <option value= "template" >Template</option>
      </select>      
      </div>
      </div>
      
      <div class="row">
      <div class="col-sm-6" id="attachment_select" style="display:none"> 
      Attachment type: <select id="attachments" name="attachments">
      <option checked value= "image" >Image</option>
      <option value= "audio" >Audio</option>
      <option value= "video" >Video</option>
      <option value= "file" >File</option>      
      </select>                        
      </div>

      <div class="col-sm-12" id="quick_text" style="display:none">
      Text value:<textarea class="form-control" placeholder="Add {{user_first_name}} for user name." id="quick_text_value" required minlength="8" rows="1"></textarea>         
      <hr>
      </div>  
    
      <div class="col-sm-12" id="quick_replies_count" style="display:none"> 
      Quick Replies count: <select id="quick_replies_count_value" name="quick_replies_count_value">
      <option checked value= "1_r" >One Quick Reply</option>
      <option value="2_r">Two Quick Replies</option>
      <option value="3_r">Three Quick Replies</option>
      <option value="4_r">Four Quick Replies</option>
      <option value="5_r">Five Quick Replies</option>
      <option value="6_r">Six Quick Replies</option>
      <option value="7_r">Seven Quick Replies</option>
      <option value="8_r">Eight Quick Replies</option>
      <option value="9_r">Nine Quick Replies</option>
      </select>
      </div>

      <div class="col-sm-12" id="quick_cards" style="display:none">
      <div class="row row-cols-1 row-cols-sm-2">
      <div class="col-sm" style="margin-bottom: 15px;">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Quick Reply #1</h5>
            <p class="card-text">Please add the payload and the title.</p>
            Reply Title:<input type="text" id = "quick_1_title">          
            Reply Payload:<input type="text" id = "quick_1_payload">          
            </div>
        </div> 
      </div>
      </div>
      <hr>                      
      </div>


      <div class="col-sm-6" id="template_select" style="display:none"> 
      Template type: <select id="templates" name="templates">
      <option checked value= "generic_template" >Generic template</option>
      <option disabled value="button_template">Button template</option>
      <option disabled value="product_template">Product template</option>
      <option disabled value="template">Receipt template</option>      
      <option disabled value="template">Airline Boarding Pass template</option>      
      <option disabled value="template">Airline Check-in template</option>      
      <option disabled value="template">Airline Itinerary Pass template</option>      
      <option disabled value="template">Airline Update Pass template</option>      
      </select>                        
      </div>

      <div class="col-sm-6" id="generic_template_count" style="display:none"> 
      Elements count: <select id="generic_template_count_value" name="generic_template_count_value">
      <option checked value= "1_l" >One Element</option>
      <option value="2_l">Two Elements</option>
      <option value="3_l">Three Elements</option>
      <option value="4_l">Four Elements</option>
      <option value="5_l">Five Elements</option>
      <option value="6_l">Six Elements</option>
      <option value="7_l">Seven Elements</option>
      <option value="8_l">Eight Elements</option>
      <option value="9_l">Nine Elements</option>
      </select>  
      </div>




      <div class="col-sm-12" id="generic_template" style="display:none">
      <hr>

      <div class="custom-control custom-switch" style="margin-bottom:5px;">
      <input type="checkbox" class="custom-control-input"  id="add_text_before_generic_template">
      <label class="custom-control-label" for="add_text_before_generic_template">Add Text before the generic template.</label>
      </div>

      <div id="generic_template_text_before" style="display:none">
      Text value:<textarea class="form-control" placeholder="Ex: {{user_first_name}}, please look at the following.." id="generic_template_text_before_value" required minlength="8" rows="1"></textarea>         
      </div>


      <div class="row row-cols-1 row-cols-sm-2">
      <div class="col-sm" style="margin-bottom: 15px;">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Element #1</h5>
          <p class="card-text">Please add the title, and subtitle for this element. You can add image url if any or leave it empty.</p>
          Element Title:<input type="text" id = "template_1_title">          
          Element Subtitle:<input type="text" id = "template_1_subtitle">  
          Image url:<input type="text"  placeholder="Leave empty for no image." id = "template_1_url">
          <hr>
          <h5 class="card-title">Default Action</h5>
          URL:<input type="text" placeholder="Leave empty if no URL." id = "template_default_1_url">
          <hr>
          How many buttons <select id="buttons_count_template_1" name="buttons_count_template_1">
          <option checked value= "1_b" >One Button</option>
          <option value="2_b">Two Button</option>
          <option value="3_b">Three Button</option>
          </select>
          <hr>
          <div id = "buttons_1">
          <div id = "buttons_1_1">
          <h5>Button #1</h5>
          Button Type <select id="button_type_1_1" name="button_type_1_1">
          <option checked value= "url" >Web URL</option>
          <option value="postback">Postback Payload</option>
          </select>
          <div id = "weburl_1_1_div">
          URL:<input type="text" id="weburl_1_1">
          Title:<input type="text" id="weburl_1_1_title">
          </div>  
          <div id = "postback_1_1_div" style = "display:none">
          Payload:<input type="text" id="postback_1_1">
          Title:<input type="text" id="postback_1_1_title">
          </div>  
          </div> 
          <hr>
          </div>           
          </div>
      </div> 
    </div>
      </div>
      <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input"  id="add_quick_replies_after_generic_template">
      <label class="custom-control-label" for="add_quick_replies_after_generic_template">Add quick replies after the generic template.</label>
      </div> 


      <div id = "quick_r_after_generic_template" style = "display:none">
      Quick Replies count: <select id="quick_replies_count_for_generic_template_value" name="quick_replies_count_for_generic_template_value">
      <option checked value= "1_r" >One Quick Reply</option>
      <option value="2_r">Two Quick Replies</option>
      <option value="3_r">Three Quick Replies</option>
      <option value="4_r">Four Quick Replies</option>
      </select>
      <div id="quick_cards_for_generic_template" style="display:full">
      <div class="row row-cols-1 row-cols-sm-2">
      <div class="col-sm" style="margin-bottom: 15px;">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Quick Reply #1</h5>
            <p class="card-text">Please add the payload and the title.</p>
            Reply Title:<input type="text" id = "quick_1_title_for_generic_template">          
            Reply Payload:<input type="text" id = "quick_1_payload_for_generic_template">          
            </div>
        </div> 
      </div>
      </div></div></div><hr></div>


      <div class="col-sm-6" id="attachment_role" style="display:none"> 
      Attachment role: <select id="attachment_role_value" name="attachment_role_value">
      <option checked value="upload">Fetch from URL</option>
      <option disabled value="use">Use saved attachment</option>
      </select>                        
      </div>

      <div class="col-sm-12" id="text_value_div" style="display:full">
      Text value:<textarea class="form-control" placeholder="Add {{user_first_name}} for user name." id="text_value" required minlength="8" rows="2"></textarea>         
      <hr>                      
      </div>
      <div class="col-sm-12" id="image_link_div" style="display:none">
      <hr>
      <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input"  id="add_text_before_image">
      <label class="custom-control-label" for="add_text_before_image">Add Text before the image.</label>
      </div>
      <div id="image_text_before" style="display:none">
      Text value:<textarea class="form-control" placeholder="Ex: {{user_first_name}}, this image is the blue color of this product." id="image_text_before_value" required minlength="8" rows="1"></textarea>         
      </div>
      Image link:<input type="url" id = "image_link">
      <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input"  id="add_quick_replies_after_image">
      <label class="custom-control-label" for="add_quick_replies_after_image">Add quick replies after the image.</label>
      </div> 
      <div id = "quick_r_after_image" style = "display:none">
      Quick Replies count: <select id="quick_replies_count_for_image_value" name="quick_replies_count_for_image_value">
      <option checked value= "1_r" >One Quick Reply</option>
      <option value="2_r">Two Quick Replies</option>
      <option value="3_r">Three Quick Replies</option>
      <option value="4_r">Four Quick Replies</option>
      </select>
      <div id="quick_cards_for_image" style="display:full">
      <div class="row row-cols-1 row-cols-sm-2">
      <div class="col-sm" style="margin-bottom: 15px;">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Quick Reply #1</h5>
            <p class="card-text">Please add the payload and the title.</p>
            Reply Title:<input type="text" id = "quick_1_title_for_image">          
            Reply Payload:<input type="text" id = "quick_1_payload_for_image">          
            </div>
        </div> 
      </div>
      </div>
      </div>
      </div>
      <hr>       
      </div>
      <div class="col-sm-12" id="audio_link_div" style="display:none">
      <hr>
      <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input"  id="add_text_before_audio">
      <label class="custom-control-label" for="add_text_before_audio">Add Text before the audio.</label>
      </div>
      <div id="audio_text_before" style="display:none">
      Text value:<textarea class="form-control" placeholder="Ex: {{user_first_name}}, this audio file explain more." id="audio_text_before_value" required minlength="8" rows="1"></textarea>         
      </div>
      Audio link:<input type="url" id = "audio_link">
      <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input"  id="add_quick_replies_after_audio">
      <label class="custom-control-label" for="add_quick_replies_after_audio">Add quick replies after the audio.</label>
      </div> 
      <div id = "quick_r_after_audio" style = "display:none">
      Quick Replies count: <select id="quick_replies_count_for_audio_value" name="quick_replies_count_for_audio_value">
      <option checked value= "1_r" >One Quick Reply</option>
      <option value="2_r">Two Quick Replies</option>
      <option value="3_r">Three Quick Replies</option>
      <option value="4_r">Four Quick Replies</option>
      </select>
      <div id="quick_cards_for_audio" style="display:full">
      <div class="row row-cols-1 row-cols-sm-2">
      <div class="col-sm" style="margin-bottom: 15px;">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Quick Reply #1</h5>
            <p class="card-text">Please add the payload and the title.</p>
            Reply Title:<input type="text" id = "quick_1_title_for_audio">          
            Reply Payload:<input type="text" id = "quick_1_payload_for_audio">          
            </div>
        </div> 
      </div>
      </div>
      </div>
      </div>
      <hr>          
      </div>
      <div class="col-sm-12" id="video_link_div" style="display:none">
      <hr>
      <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input"  id="add_text_before_video">
      <label class="custom-control-label" for="add_text_before_video">Add Text before the video.</label>
      </div>
      <div id="video_text_before" style="display:none">
      Text value:<textarea class="form-control" placeholder="Ex: {{user_first_name}}, this video file explain more." id="video_text_before_value" required minlength="8" rows="1"></textarea>         
      </div>
      Video link:<input type="url" id = "video_link">
      <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input"  id="add_quick_replies_after_video">
      <label class="custom-control-label" for="add_quick_replies_after_video">Add quick replies after the video.</label>
      </div> 
      <div id = "quick_r_after_video" style = "display:none">
      Quick Replies count: <select id="quick_replies_count_for_video_value" name="quick_replies_count_for_video_value">
      <option checked value= "1_r" >One Quick Reply</option>
      <option value="2_r">Two Quick Replies</option>
      <option value="3_r">Three Quick Replies</option>
      <option value="4_r">Four Quick Replies</option>
      </select>
      <div id="quick_cards_for_video" style="display:full">
      <div class="row row-cols-1 row-cols-sm-2">
      <div class="col-sm" style="margin-bottom: 15px;">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Quick Reply #1</h5>
            <p class="card-text">Please add the payload and the title.</p>
            Reply Title:<input type="text" id = "quick_1_title_for_video">          
            Reply Payload:<input type="text" id = "quick_1_payload_for_video">          
            </div>
        </div> 
      </div>
      </div>
      </div>
      </div>
      <hr>          
      </div>
      <div class="col-sm-12" id="file_link_div" style="display:none">
      <hr>
      <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input"  id="add_text_before_file">
      <label class="custom-control-label" for="add_text_before_file">Add Text before the file.</label>
      </div>
      <div id="file_text_before" style="display:none">
      Text value:<textarea class="form-control" placeholder="Ex: {{user_first_name}}, this file file explain more." id="file_text_before_value" required minlength="8" rows="1"></textarea>         
      </div>
      File link:<input type="url" id = "file_link">
      <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input"  id="add_quick_replies_after_file">
      <label class="custom-control-label" for="add_quick_replies_after_file">Add quick replies after the file.</label>
      </div>
      <div id = "quick_r_after_file" style = "display:none">
      Quick Replies count: <select id="quick_replies_count_for_file_value" name="quick_replies_count_for_file_value">
      <option checked value= "1_r" >One Quick Reply</option>
      <option value="2_r">Two Quick Replies</option>
      <option value="3_r">Three Quick Replies</option>
      <option value="4_r">Four Quick Replies</option>
      </select>
      <div id="quick_cards_for_file" style="display:full">
      <div class="row row-cols-1 row-cols-sm-2">
      <div class="col-sm" style="margin-bottom: 15px;">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Quick Reply #1</h5>
            <p class="card-text">Please add the payload and the title.</p>
            Reply Title:<input type="text" id = "quick_1_title_for_file">          
            Reply Payload:<input type="text" id = "quick_1_payload_for_file">          
            </div>
        </div> 
      </div>
      </div>
      </div>
      </div>

      <hr>          
      </div>
      </div>
      <div class="row">
      <div class="col-sm-6">
      Assign to: <select id="assign" name="assign">
      <option checked value="postback">Postback Payload</option>   
      <option value= "intent">Intent Only</option>
      <option disabled value="entity_only">Entity Only</option>  
      <option disabled value="entity_only">Entity / No Matches</option>        
      </select>                        
      </div>      
      <div class="col-sm-6" id="intent_value" style="display:none">      

      Intent: <select id="assign_value_intent" name="assign_value_intent">
      <option checked value= "out_of_scope" > --- Out of Scope --- </option>
      `
for (i = 0 ; i < myIntents.length ; i ++) {
  mainP += `
    <option value="${myIntents[i].name}">${myIntents[i].name}</option>`
  }
  

  mainP += `</select></div>

      
      

      <div class="col-sm-3" id="intent_value_2" style="display:none">
      Intent: <select id="assign_value_intent_2" name="assign_value_intent_2">
      <option checked value= "out_of_scope" > --- Out of Scope --- </option>

      `

for (i = 0 ; i < myIntents.length ; i ++) {
  mainP += `
    <option value="${myIntents[i].name}">${myIntents[i].name}</option>`
  }
  

  mainP += `</select></div>

      <div class="col-sm-3" id="entity_value" style="display:none">
      Entity: <select id="assign_value_entity_2" name="assign_value_entity_2">
      `

for (i = 0 ; i < myEntities.length ; i ++) {
  mainP += `
    <option value="${myEntities[i].name}">${myEntities[i].name}</option>`
  }
  

  mainP += `</select></div>
      <div class="col-sm-6" id="entity_only" style="display:none">
      Entity: <select id="assign_value_entity_only" name="assign_value_entity_only">
      `
      
for (i = 0 ; i < myEntities.length ; i ++) {
  mainP += `
    <option value="${myEntities[i].name}">${myEntities[i].name}</option>`
  }
  

  mainP += `</select></div>
      <div class="col-sm-6" id="payload_value" style="display:full">
      Payload value:<input type="text" minlength="3" id = "assign_value_payload">          
      </div>
      
      <div class="col-sm-6" id="entity_matching" style="display:none">
      Entity matching values:<input type="text" minlength="3" placeholder="Ex: Tomorrow/Saturday/weekend" id = "entity_matching_value">          
      </div>
      `
      


if (persona && persona.state){
  mainP += `
  <div class="col-sm-6" id = "pers_div" style="display:full">
  Persona: <select id="persona_value" name="persona_value">
  <option checked value= "default" >Default</option>
`  
for (i = 0 ; i < persona.state.data.length ; i ++) {
  mainP += `<option value="${persona.state.data[i].name}_${persona.state.data[i].id}">${persona.state.data[i].name}</option>`
}

mainP+= `</select></div>`
}

mainP += `
      </div>
      <hr>
      <div id = "divReplaceAtt" style = "display:none">
      <h2>Backup Response</h2>
      <div class="row">
       <div class="form-group col-md-12">
       <p>This is a backup response to replace failed attachment messages. <b>For Messenger replies</b>, The backup text message will replace the <b>attachment message only</b>, and not the entire response. <b>For comment replies</b>, the <b>entire</b> response will be replaced with the backup response if you added <b>Text</b> message before the attachment or if the attachement message failed.</p>
       </div></div>
         <div class="row">
         <div class="col-sm-12" style="display:full">
         Replace Text value:<textarea class="form-control" placeholder="Ex: Hi {{user_first_name}}, please access the file using the following link. https://botai.me/attachment.jpg" id="replace_text_value" required minlength="8" rows=""></textarea>         
         <hr>
         </div>
         </div></div> 
         
         
         <div id = "divReplaceTem" style = "display:none">
         <h2>Backup Response</h2>
         <div class="row">
          <div class="form-group col-md-12">
          <p>This is a backup response to replace failed template messages. <b>For Messenger replies</b>, The backup text message will replace the <b>templat message only</b>, and not the entire response. <b>For comment replies</b>, the <b>entire</b> response will be replaced with the backup response if you added <b>Text</b> message before the template or if the template message failed.</p>
          </div></div>
            <div class="row">
            <div class="col-sm-12" style="display:full">
            Replace Text value:<textarea class="form-control" placeholder="Ex: Hi {{user_first_name}}, please see more products at. https://botai.me/products" id="replace_text_value_t" required minlength="8" rows=""></textarea>         
            <hr>
            </div>
            </div></div>  
         </div>
         <div id = "warn_exist" class="col-sm-6" style="display:none">
     <h6 style="color:red;">Are you overwriting the old response with a new one?<h6>
     <input class="form-check-input" type="checkbox" id="confirm_replace">
     <label class="form-check-label" for="defaultCheck1">Yes, replace.</label>
      </div>

      <div class="row justify-content-center">
      <button type="button" id="addResponse_1" class="btn btn-md btn-success" style="width:100px; margin-top:10px" onclick="addResponse();">Add</button>
      </div>
</divNew>
      </divMain>`

    $('divMain').replaceWith(mainP);

    document.querySelector('#add_quick_replies_after_generic_template').addEventListener('change', event => {
      if (document.getElementById("add_quick_replies_after_generic_template").checked == true){
        $('#quick_r_after_generic_template').show();
        $('#pers_div').hide();
        document.getElementById("persona_value").value = "default";
      } else {
        $('#quick_r_after_generic_template').hide();
        $('#pers_div').show();
      }
    });

      document.querySelector('#add_text_before_generic_template').addEventListener('change', event => {
        if (document.getElementById("add_text_before_generic_template").checked == true){
          $('#generic_template_text_before').show();
        } else {
          $('#generic_template_text_before').hide();
        }
      });

      document.querySelector('#quick_replies_count_for_generic_template_value').addEventListener('change', event => {
        newRes = document.getElementById("quick_replies_count_for_generic_template_value").value;
        var myN = 0;
        if (newRes.split("_")[0]){
          myN = newRes.split("_")[0];
        }
        var newBody = `
        <div id="quick_cards_for_generic_template">
        <div class="row row-cols-1 row-cols-sm-2">
        `;
        for (i = 0 ; i < myN ; i++){
          newBody +=`
          <div class="col-sm" style="margin-bottom: 15px;">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Quick Reply #${i+1}</h5>
              <p class="card-text">Please add the payload and the title.</p>
              Reply Title:<input type="text" id = "quick_${i+1}_title_for_generic_template">          
              Reply Payload:<input type="text" id = "quick_${i+1}_payload_for_generic_template">          
              </div>
          </div></div>`;
        }
        newBody += `</div><hr></div>`
        $("#quick_cards_for_generic_template").replaceWith(newBody);
      });




    document.querySelector('#add_quick_replies_after_image').addEventListener('change', event => {
      if (document.getElementById("add_quick_replies_after_image").checked == true){
        $('#quick_r_after_image').show();
        $('#pers_div').hide();
        document.getElementById("persona_value").value = "default";
      } else {
        $('#quick_r_after_image').hide();
        $('#pers_div').show();
      }
    });

      document.querySelector('#add_text_before_image').addEventListener('change', event => {
        if (document.getElementById("add_text_before_image").checked == true){
          $('#image_text_before').show();
        } else {
          $('#image_text_before').hide();
        }
      });

      document.querySelector('#quick_replies_count_for_image_value').addEventListener('change', event => {
        newRes = document.getElementById("quick_replies_count_for_image_value").value;
        var myN = 0;
        if (newRes.split("_")[0]){
          myN = newRes.split("_")[0];
        }
        var newBody = `
        <div id="quick_cards_for_image">
        <div class="row row-cols-1 row-cols-sm-2">
        `;
        for (i = 0 ; i < myN ; i++){
          newBody +=`
          <div class="col-sm" style="margin-bottom: 15px;">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Quick Reply #${i+1}</h5>
              <p class="card-text">Please add the payload and the title.</p>
              Reply Title:<input type="text" id = "quick_${i+1}_title_for_image">          
              Reply Payload:<input type="text" id = "quick_${i+1}_payload_for_image">          
              </div>
          </div></div>`;
        }
        newBody += `</div><hr></div>`
        $("#quick_cards_for_image").replaceWith(newBody);
      });

      document.querySelector('#add_quick_replies_after_audio').addEventListener('change', event => {
        if (document.getElementById("add_quick_replies_after_audio").checked == true){
          $('#quick_r_after_audio').show();
          $('#pers_div').hide();
          document.getElementById("persona_value").value = "default";
        } else {
          $('#quick_r_after_audio').hide();
          $('#pers_div').show();
        }
      });
  
        document.querySelector('#add_text_before_audio').addEventListener('change', event => {
          if (document.getElementById("add_text_before_audio").checked == true){
            $('#audio_text_before').show();
          } else {
            $('#audio_text_before').hide();
          }
        });
  
        document.querySelector('#quick_replies_count_for_audio_value').addEventListener('change', event => {
          newRes = document.getElementById("quick_replies_count_for_audio_value").value;
          var myN = 0;
          if (newRes.split("_")[0]){
            myN = newRes.split("_")[0];
          }
          var newBody = `
          <div id="quick_cards_for_audio">
          <div class="row row-cols-1 row-cols-sm-2">
          `;
          for (i = 0 ; i < myN ; i++){
            newBody +=`
            <div class="col-sm" style="margin-bottom: 15px;">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Quick Reply #${i+1}</h5>
                <p class="card-text">Please add the payload and the title.</p>
                Reply Title:<input type="text" id = "quick_${i+1}_title_for_audio">          
                Reply Payload:<input type="text" id = "quick_${i+1}_payload_for_audio">          
                </div>
            </div></div>`;
          }
          newBody += `</div><hr></div>`
          $("#quick_cards_for_audio").replaceWith(newBody);
        });




        document.querySelector('#add_quick_replies_after_video').addEventListener('change', event => {
          if (document.getElementById("add_quick_replies_after_video").checked == true){
            $('#quick_r_after_video').show();
            $('#pers_div').hide();
            document.getElementById("persona_value").value = "default";
          } else {
            $('#quick_r_after_video').hide();
            $('#pers_div').show();
          }
        });
    
          document.querySelector('#add_text_before_video').addEventListener('change', event => {
            if (document.getElementById("add_text_before_video").checked == true){
              $('#video_text_before').show();
            } else {
              $('#video_text_before').hide();
            }
          });
    
          document.querySelector('#quick_replies_count_for_video_value').addEventListener('change', event => {
            newRes = document.getElementById("quick_replies_count_for_video_value").value;
            var myN = 0;
            if (newRes.split("_")[0]){
              myN = newRes.split("_")[0];
            }
            var newBody = `
            <div id="quick_cards_for_video">
            <div class="row row-cols-1 row-cols-sm-2">
            `;
            for (i = 0 ; i < myN ; i++){
              newBody +=`
              <div class="col-sm" style="margin-bottom: 15px;">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Quick Reply #${i+1}</h5>
                  <p class="card-text">Please add the payload and the title.</p>
                  Reply Title:<input type="text" id = "quick_${i+1}_title_for_video">          
                  Reply Payload:<input type="text" id = "quick_${i+1}_payload_for_video">          
                  </div>
              </div></div>`;
            }
            newBody += `</div><hr></div>`
            $("#quick_cards_for_video").replaceWith(newBody);
          });


          document.querySelector('#add_quick_replies_after_file').addEventListener('change', event => {
            if (document.getElementById("add_quick_replies_after_file").checked == true){
              $('#quick_r_after_file').show();
              $('#pers_div').hide();
              document.getElementById("persona_value").value = "default";
            } else {
              $('#quick_r_after_file').hide();
              $('#pers_div').show();
            }
          });
      
            document.querySelector('#add_text_before_file').addEventListener('change', event => {
              if (document.getElementById("add_text_before_file").checked == true){
                $('#file_text_before').show();
              } else {
                $('#file_text_before').hide();
              }
            });
      
            document.querySelector('#quick_replies_count_for_file_value').addEventListener('change', event => {
              newRes = document.getElementById("quick_replies_count_for_file_value").value;
              var myN = 0;
              if (newRes.split("_")[0]){
                myN = newRes.split("_")[0];
              }
              var newBody = `
              <div id="quick_cards_for_file">
              <div class="row row-cols-1 row-cols-sm-2">
              `;
              for (i = 0 ; i < myN ; i++){
                newBody +=`
                <div class="col-sm" style="margin-bottom: 15px;">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">Quick Reply #${i+1}</h5>
                    <p class="card-text">Please add the payload and the title.</p>
                    Reply Title:<input type="text" id = "quick_${i+1}_title_for_file">          
                    Reply Payload:<input type="text" id = "quick_${i+1}_payload_for_file">          
                    </div>
                </div></div>`;
              }
              newBody += `</div><hr></div>`
              $("#quick_cards_for_file").replaceWith(newBody);
            });
    $("#image_link").on("keyup", function(){ 
      document.getElementById("replace_text_value").value = document.getElementById("image_link").value
    });
    $("#audio_link").on("keyup", function(){ 
      document.getElementById("replace_text_value").value = document.getElementById("audio_link").value
    });
    $("#video_link").on("keyup", function(){ 
      document.getElementById("replace_text_value").value = document.getElementById("video_link").value
    });
    $("#file_link").on("keyup", function(){ 
      document.getElementById("replace_text_value").value = document.getElementById("file_link").value
    });

    
    document.querySelector('#attachments').addEventListener('change', event => {
      newRes = document.getElementById("attachments").value;
      if (newRes === "image"){
        $('#image_link_div').show();
        $('#audio_link_div').hide();
        $('#file_link_div').hide();
        $('#video_link_div').hide();
      } else if (newRes === "audio"){
        $('#image_link_div').hide();
        $('#audio_link_div').show();
        $('#file_link_div').hide();
        $('#video_link_div').hide();
      } else if (newRes === "video"){
        $('#image_link_div').hide();
        $('#audio_link_div').hide();
        $('#file_link_div').hide();
        $('#video_link_div').show();
      } else {
        $('#image_link_div').hide();
        $('#audio_link_div').hide();
        $('#file_link_div').show();
        $('#video_link_div').hide();
      }
    })




    document.querySelector('#quick_replies_count_value').addEventListener('change', event => {
      newRes = document.getElementById("quick_replies_count_value").value;
      var myN = 0;
      if (newRes.split("_")[0]){
        myN = newRes.split("_")[0];
      }
      var newBody = `
      <div class="col-sm-12" id="quick_cards">
      <div class="row row-cols-1 row-cols-sm-2">
      `;
      for (i = 0 ; i < myN ; i++){
        newBody +=`
        <div class="col-sm" style="margin-bottom: 15px;">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Quick Reply #${i+1}</h5>
            <p class="card-text">Please add the payload and the title.</p>
            Reply Title:<input type="text" id = "quick_${i+1}_title">          
            Reply Payload:<input type="text" id = "quick_${i+1}_payload">          
            </div>
        </div></div>`;
      }
      newBody += `</div><hr></div>`
      $("#quick_cards").replaceWith(newBody);
    });


    document.querySelector('#generic_template_count_value').addEventListener('change', event => {
      newRes = document.getElementById("generic_template_count_value").value;
      var myN = 0;
      if (newRes.split("_")[0]){
        myN = newRes.split("_")[0];
      }
      
      var newBody = `
      <div class="col-sm-12" id="generic_template">
      <hr>
      <div class="custom-control custom-switch" style="margin-bottom:5px;">
      <input type="checkbox" class="custom-control-input"  id="add_text_before_generic_template">
      <label class="custom-control-label" for="add_text_before_generic_template">Add Text before the generic template.</label>
      </div>

      <div id="generic_template_text_before" style="display:none">
      Text value:<textarea class="form-control" placeholder="Ex: {{user_first_name}}, please look at the following.." id="generic_template_text_before_value" required minlength="8" rows="1"></textarea>         
      </div>
      <div class="row row-cols-1 row-cols-sm-2">
      `;
      for (i = 0 ; i < myN ; i++){
        newBody +=`
        <div class="col-sm" style="margin-bottom: 15px;">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Element #${i+1}</h5>
            <p class="card-text">Please add the title, and subtitle for this element. You can add image url if any or leave it empty.</p>
            Element Title:<input type="text" id = "template_${i+1}_title">          
            Element Subtitle:<input type="text" id = "template_${i+1}_subtitle">  
            Image url:<input type="text" placeholder="Leave empty for no image." id = "template_${i+1}_url">
            <hr>
            <h5 class="card-title">Default Action</h5>
            URL:<input type="url" placeholder="Leave empty if no URL." id = "template_default_${i+1}_url">
            <hr>
            How many buttons <select id="buttons_count_template_${i+1}" name="buttons_count_template_${i+1}">
            <option checked value= "1_b">One Button</option>
            <option value="2_b">Two Button</option>
            <option value="3_b">Three Button</option>
            </select>
            <hr>
            <div id = "buttons_${i+1}">
            <div id = "buttons_${i+1}_1">
            <h5>Button #1</h5>
            Button Type <select id="button_type_${i+1}_1" name="button_type_${i+1}_1">
            <option checked value= "url" >Web URL</option>
            <option value="postback">Postback Payload</option>
            </select>
            <div id = "weburl_${i+1}_1_div">
            URL:<input type="text" id="weburl_${i+1}_1">
            Title:<input type="text" id="weburl_${i+1}_1_title">
            </div>  
            <div id = "postback_${i+1}_1_div" style = "display:none">
            Payload:<input type="text" id="postback_${i+1}_1">
            Title:<input type="text" id="postback_${i+1}_1_title">
            </div>  
            </div> 
            <hr>
            </div>           
            </div>
        </div> 
      </div>`;
      }
      newBody += `</div>
      <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input"  id="add_quick_replies_after_generic_template">
      <label class="custom-control-label" for="add_quick_replies_after_generic_template">Add quick replies after the generic template.</label>
      </div> 

      <div id = "quick_r_after_generic_template" style = "display:none">
      Quick Replies count: <select id="quick_replies_count_for_generic_template_value" name="quick_replies_count_for_generic_template_value">
      <option checked value= "1_r" >One Quick Reply</option>
      <option value="2_r">Two Quick Replies</option>
      <option value="3_r">Three Quick Replies</option>
      <option value="4_r">Four Quick Replies</option>
      </select>
      <div id="quick_cards_for_generic_template" style="display:full">
      <div class="row row-cols-1 row-cols-sm-2">
      <div class="col-sm" style="margin-bottom: 15px;">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Quick Reply #1</h5>
            <p class="card-text">Please add the payload and the title.</p>
            Reply Title:<input type="text" id = "quick_1_title_for_generic_template">          
            Reply Payload:<input type="text" id = "quick_1_payload_for_generic_template">          
            </div>
        </div> 
      </div>
      </div></div></div>
      <hr></div>`
      $("#generic_template").replaceWith(newBody);

      document.querySelector('#add_quick_replies_after_generic_template').addEventListener('change', event => {
        if (document.getElementById("add_quick_replies_after_generic_template").checked == true){
          $('#quick_r_after_generic_template').show();
          $('#pers_div').hide();
          document.getElementById("persona_value").value = "default";
        } else {
          $('#quick_r_after_generic_template').hide();
          $('#pers_div').show();
        }
      });
  
        document.querySelector('#add_text_before_generic_template').addEventListener('change', event => {
          if (document.getElementById("add_text_before_generic_template").checked == true){
            $('#generic_template_text_before').show();
          } else {
            $('#generic_template_text_before').hide();
          }
        });
  
        document.querySelector('#quick_replies_count_for_generic_template_value').addEventListener('change', event => {
          newRes = document.getElementById("quick_replies_count_for_generic_template_value").value;
          var myN = 0;
          if (newRes.split("_")[0]){
            myN = newRes.split("_")[0];
          }
          var newBody = `
          <div id="quick_cards_for_generic_template">
          <div class="row row-cols-1 row-cols-sm-2">
          `;
          for (i = 0 ; i < myN ; i++){
            newBody +=`
            <div class="col-sm" style="margin-bottom: 15px;">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Quick Reply #${i+1}</h5>
                <p class="card-text">Please add the payload and the title.</p>
                Reply Title:<input type="text" id = "quick_${i+1}_title_for_generic_template">          
                Reply Payload:<input type="text" id = "quick_${i+1}_payload_for_generic_template">          
                </div>
            </div></div>`;
          }
          newBody += `</div><hr></div>`
          $("#quick_cards_for_generic_template").replaceWith(newBody);
        });

      var arr2 = []
      arr2[0] = null
      for ( q = 1 ; q <= myN ; q++){
        arr2[q] = q;
      }
      for (x in arr2){
        if (x !== "0"){
        document.querySelector(`#button_type_${x}_1`).addEventListener('change', event => {
        let check =  document.getElementById(event.target.id).value
        if (check === "postback"){
          $(`#weburl_${event.target.id.split("_")[2]}_${event.target.id.split("_")[3]}_div`).hide();
          $(`#postback_${event.target.id.split("_")[2]}_${event.target.id.split("_")[3]}_div`).show();
        } else {
          $(`#weburl_${event.target.id.split("_")[2]}_${event.target.id.split("_")[3]}_div`).show();
          $(`#postback_${event.target.id.split("_")[2]}_${event.target.id.split("_")[3]}_div`).hide();
        }
      });
    }}
    arr2 = [];
      for (p = 1 ; p <= myN ; p++){
        var arr = [];
        document.querySelector(`#buttons_count_template_${p}`).addEventListener('change', event => {
          newRes = document.getElementById(event.target.id).value;
          var myN = 0;
          if (newRes.split("_")[0]){
            myN = newRes.split("_")[0];
          }
          var elementIs = event.target.id.split("_")[3]
          buttonsCount = myN
          
          arr[0] = null;
          for (i = 1 ; i <= myN ; i++){
            arr[i] = i;
          }
          var newBody = `<div id = "buttons_${elementIs}">`;
            for (x in arr){
              if (x !== "0"){
                newBody +=`
                <h5> Button #${x}</h5>
                <div id = "buttons_${elementIs}_${x}">
                Button Type <select id="button_type_${elementIs}_${x}" name="button_type_${x}_${i}">
                <option checked value= "url" >Web URL</option>
                <option value="postback">Postback Payload</option>
                </select>
                <div id = "weburl_${elementIs}_${x}_div">
                URL:<input type="text" id="weburl_${elementIs}_${x}">
                Title:<input type="text" id="weburl_${elementIs}_${x}_title">
                </div>  
                <div id = "postback_${elementIs}_${x}_div" style = "display:none">
                Payload:<input type="text" id="postback_${elementIs}_${x}">
                Title:<input type="text" id="postback_${elementIs}_${x}_title">
                </div>  
                </div><hr>`;
              }
            }
            newBody += `</div>`
            $(`#buttons_${elementIs}`).replaceWith(newBody);
            for (x in arr){
              if (x !== "0"){
              document.querySelector(`#button_type_${elementIs}_${x}`).addEventListener('change', event => {
              let check =  document.getElementById(event.target.id).value
              if (check === "postback"){
                $(`#weburl_${event.target.id.split("_")[2]}_${event.target.id.split("_")[3]}_div`).hide();
                $(`#postback_${event.target.id.split("_")[2]}_${event.target.id.split("_")[3]}_div`).show();
              } else {
                $(`#weburl_${event.target.id.split("_")[2]}_${event.target.id.split("_")[3]}_div`).show();
                $(`#postback_${event.target.id.split("_")[2]}_${event.target.id.split("_")[3]}_div`).hide();
              }
            });
          }}
          arr = []
      });
  }
    });

    document.querySelector(`#button_type_1_1`).addEventListener('change', event => {
      let check =  document.getElementById("button_type_1_1").value
      if (check === "postback"){
        $(`#weburl_1_1_div`).hide();
        $(`#postback_1_1_div`).show();
      } else {
        $(`#weburl_1_1_div`).show();
        $(`#postback_1_1_div`).hide();
      }
    });

    document.querySelector('#buttons_count_template_1').addEventListener('change', event => {
      newRes = document.getElementById("buttons_count_template_1").value;
      var myN = 0;
      if (newRes.split("_")[0]){
        myN = newRes.split("_")[0];
      }
      
      var newBody = `<div id = "buttons_1">`;
      for (i = 0 ; i < myN ; i++){
        newBody +=`
        <h5> Button #${i+1}</h5>
        <div id = "buttons_1_${i+1}">
        Button Type <select id="button_type_1_${i+1}" name="button_type_1_${i+1}">
        <option checked value= "url" >Web URL</option>
        <option value="postback">Postback Payload</option>
        </select>
        <div id = "weburl_1_${i+1}_div">
        URL:<input type="text" id="weburl_1_${i+1}">
        Title:<input type="text" id="weburl_1_${i+1}_title">
        </div>  
        <div id = "postback_1_${i+1}_div" style = "display:none">

        Payload:<input type="text" id="postback_1_${i+1}">
        Title:<input type="text" id="postback_1_${i+1}_title">
        </div>  
        </div><hr>`;
      }
      newBody += `</div>`
      $("#buttons_1").replaceWith(newBody);

      var myArr = []
      myArr[0] = null
      for (i = 1 ; i <= myN ; i++){
        myArr[i] = i
      }
      for (x in myArr){
        if (x !== "0"){
        document.querySelector(`#button_type_1_${x}`).addEventListener('change', event => {
        let check =  document.getElementById(event.target.id).value
        if (check === "postback"){
          $(`#weburl_${event.target.id.split("_")[2]}_${event.target.id.split("_")[3]}_div`).hide();
          $(`#postback_${event.target.id.split("_")[2]}_${event.target.id.split("_")[3]}_div`).show();
        } else {
          $(`#weburl_${event.target.id.split("_")[2]}_${event.target.id.split("_")[3]}_div`).show();
          $(`#postback_${event.target.id.split("_")[2]}_${event.target.id.split("_")[3]}_div`).hide();
        }
      });
    }}
    myArr = []
   });


    document.querySelector('#response_type').addEventListener('change', event => {
      newRes = document.getElementById("response_type").value;
      if (newRes === "attachment"){
        $('#generic_template_count').hide();
        $('#generic_template').hide();
        $('#divReplaceAtt').show();
        $('#image_link_div').show();
        $('#divReplaceTem').hide();
        $('#attachment_role').show();
        $('#attachment_select').show();
        $('#template_select').hide();
        $('#quick_replies_count').hide();
        $('#text_value_div').hide();
        $('#quick_text').hide();
        $('#audio_link_div').hide();
        $('#video_link_div').hide();
        $('#file_link_div').hide();
        $('#quick_cards').hide();
      } else if (newRes === "template"){
        $('#generic_template_count').show();
        $('#generic_template').show();
        $('#divReplaceAtt').hide();
        $('#divReplaceTem').show();
        $('#quick_cards').hide();
        $('#attachment_role').hide();
        $('#template_select').show();
        $('#attachment_select').hide();
        $('#quick_replies_count').hide();
        $('#image_link_div').hide();
        $('#text_value_div').hide();
        $('#quick_text').hide();
        $('#audio_link_div').hide();
        $('#video_link_div').hide();
        $('#file_link_div').hide();
      } else if (newRes === "quick_replies"){
        $('#divReplaceTem').hide();
        $('#generic_template_count').hide();
        $('#generic_template').hide();
        $('#divReplaceAtt').hide();
        $('#quick_cards').show();
        $('#attachment_role').hide();
        $('#quick_replies_count').show();
        $('#attachment_select').hide();
        $('#template_select').hide();
        $('#image_link_div').hide();
        $('#text_value_div').hide();
        $('#quick_text').show();
        $('#audio_link_div').hide();
        $('#video_link_div').hide();
        $('#file_link_div').hide();
      } else {
        $('#divReplaceTem').hide();
        $('#generic_template_count').hide();
        $('#generic_template').hide();
        $('#divReplaceAtt').hide();
        $('#quick_cards').hide();
        $('#attachment_role').hide();
        $('#attachment_select').hide();
        $('#template_select').hide();
        $('#quick_replies_count').hide();
        $('#image_link_div').hide();
        $('#text_value_div').show();
        $('#quick_text').hide();
        $('#audio_link_div').hide();
        $('#video_link_div').hide();
        $('#file_link_div').hide();
      }
    })

    document.querySelector('#assign').addEventListener('change', event => {
      newRes = document.getElementById("assign").value;
      if (newRes === "intent"){
        $('#intent_value').show();
        $('#entity_value').hide();
        $('#entity_only').hide();
        $('#intent_value_2').hide();
        $('#payload_value').hide();
        $('#entity_matching').hide();
      } else if (newRes === "entity"){
        $('#entity_matching').show();
        $('#intent_value_2').show();
        $('#entity_value').show();
        $('#intent_value').hide();
        $('#entity_only').hide();
        $('#payload_value').hide();
      } else if (newRes === "entity_only"){
        $('#entity_matching').show();
        $('#entity_only').show();
        $('#intent_value_2').hide();
        $('#entity_value').hide();
        $('#intent_value').hide();
        $('#payload_value').hide();
      } else if (newRes === "postback"){
        $('#entity_matching').hide();
        $('#payload_value').show();
        $('#entity_value').hide();
        $('#entity_only').hide();
        $('#intent_value_2').hide();
        $('#intent_value').hide();
      }
    })

    // Default non recognized message
  }
  // Function to assosiate the intent
  function addResponse(){
    let check = false;
    let check1 = false;
    let check2 = false;
    let res = [];
    res[0]= {};
    let secRes = [];
    secRes[0]= {};

    $("divNew").on("keyup", function(){         
      $('#res_warn').hide()
      newRes = document.getElementById("quick_replies_count_for_audio_value").value;
      myN = newRes.split("_")[0];
      for (i = 1 ; i <= myN ; i ++){
          document.getElementById(`quick_${i}_payload_for_audio`).style.borderColor = "none";
          document.getElementById(`quick_${i}_payload_for_audio`).style.borderWidth = "0px";
          document.getElementById(`quick_${i}_title_for_audio`).style.borderColor = "none";
          document.getElementById(`quick_${i}_title_for_audio`).style.borderWidth = "0px";
      } 
      newRes = document.getElementById("quick_replies_count_for_image_value").value;
      myN = newRes.split("_")[0];
      for (i = 1 ; i <= myN ; i ++){
          document.getElementById(`quick_${i}_title_for_image`).style.borderColor = "none";
          document.getElementById(`quick_${i}_title_for_image`).style.borderWidth = "0px";
          document.getElementById(`quick_${i}_payload_for_image`).style.borderColor = "none";
          document.getElementById(`quick_${i}_payload_for_image`).style.borderWidth = "0px";
      } 
      newRes = document.getElementById("quick_replies_count_for_file_value").value;
      myN = newRes.split("_")[0];
      for (i = 1 ; i <= myN ; i ++){
          document.getElementById(`quick_${i}_title_for_file`).style.borderColor = "none";
          document.getElementById(`quick_${i}_title_for_file`).style.borderWidth = "0px";
          document.getElementById(`quick_${i}_payload_for_file`).style.borderColor = "none";
          document.getElementById(`quick_${i}_payload_for_file`).style.borderWidth = "0px";
      } 
      newRes = document.getElementById("quick_replies_count_for_video_value").value;
      myN = newRes.split("_")[0];
      for (i = 1 ; i <= myN ; i ++){
          document.getElementById(`quick_${i}_title_for_video`).style.borderColor = "none";
          document.getElementById(`quick_${i}_title_for_video`).style.borderWidth = "0px";
          document.getElementById(`quick_${i}_payload_for_video`).style.borderColor = "none";
          document.getElementById(`quick_${i}_payload_for_video`).style.borderWidth = "0px";
      } 
      newRes = document.getElementById("quick_replies_count_for_generic_template_value").value;
      myN = newRes.split("_")[0];
      for (i = 1 ; i <= myN ; i ++){
          document.getElementById(`quick_${i}_title_for_generic_template`).style.borderColor = "none";
          document.getElementById(`quick_${i}_title_for_generic_template`).style.borderWidth = "0px";
          document.getElementById(`quick_${i}_payload_for_generic_template`).style.borderColor = "none";
          document.getElementById(`quick_${i}_payload_for_generic_template`).style.borderWidth = "0px";
      } 

      newRes = document.getElementById("quick_replies_count_value").value;
      myN = newRes.split("_")[0];
      for (i = 1 ; i <= myN ; i ++){
        document.getElementById(`quick_${i}_title`).style.borderColor = "none";
        document.getElementById(`quick_${i}_title`).style.borderWidth = "0px";
        document.getElementById(`quick_${i}_payload`).style.borderColor = "none";
        document.getElementById(`quick_${i}_payload`).style.borderWidth = "0px";
      }


      for (i = 1 ; i < 4 ; i++){
        if (document.getElementById(`weburl_1_${i}`)){
          document.getElementById(`weburl_1_${i}`).style.borderColor = "none";
          document.getElementById(`weburl_1_${i}`).style.borderWidth = "0px";
        }
        if (document.getElementById(`weburl_1_${i}_title`)){
          document.getElementById(`weburl_1_${i}_title`).style.borderColor = "none";
          document.getElementById(`weburl_1_${i}_title`).style.borderWidth = "0px";
        }
        if (document.getElementById(`postback_${i}_1`)){
          document.getElementById(`postback_${i}_1`).style.borderColor = "none";
          document.getElementById(`postback_${i}_1`).style.borderWidth = "0px";
        }
        if (document.getElementById(`postback_${i}_1_title`)){
          document.getElementById(`postback_${i}_1_title`).style.borderColor = "none";
          document.getElementById(`postback_${i}_1_title`).style.borderWidth = "0px";
        }
      }

      document.getElementById("generic_template_text_before_value").style.borderColor = "none";
      document.getElementById("generic_template_text_before_value").style.borderWidth = "0px";

      
      document.getElementById("audio_text_before_value").style.borderColor = "none";
      document.getElementById("audio_text_before_value").style.borderWidth = "0px";
      document.getElementById("image_text_before_value").style.borderColor = "none";
      document.getElementById("image_text_before_value").style.borderWidth = "0px";
      document.getElementById("template_1_subtitle").style.borderColor = "none";
      document.getElementById("template_1_subtitle").style.borderWidth = "0px";
      document.getElementById("template_1_title").style.borderColor = "none";
      document.getElementById("template_1_title").style.borderWidth = "0px";
      document.getElementById("replace_text_value").style.borderColor = "none";
      document.getElementById("replace_text_value").style.borderWidth = "0px";
      document.getElementById("replace_text_value_t").style.borderColor = "none";
      document.getElementById("replace_text_value_t").style.borderWidth = "0px";
      document.getElementById("text_value").style.borderColor = "none";
      document.getElementById("text_value").style.borderWidth = "0px";
      document.getElementById("res_name").style.borderColor = "none";
      document.getElementById("res_name").style.borderWidth = "0px";
      document.getElementById("image_link").style.borderColor = "none";
      document.getElementById("image_link").style.borderWidth = "0px";
      document.getElementById("audio_link").style.borderColor = "none";
      document.getElementById("audio_link").style.borderWidth = "0px";
      document.getElementById("video_link").style.borderColor = "none";
      document.getElementById("video_link").style.borderWidth = "0px";
      document.getElementById("file_link").style.borderColor = "none";
      document.getElementById("file_link").style.borderWidth = "0px";
      document.getElementById("quick_text_value").style.borderColor = "none";
      document.getElementById("quick_text_value").style.borderWidth = "0px";
      document.getElementById("assign_value_payload").style.borderColor = "none";
      document.getElementById("assign_value_payload").style.borderWidth = "0px";
      $('#divNew').unbind('keyup');
    });
    
      if (document.getElementById("res_name").value.length<3){
        document.getElementById("res_name").style.borderColor = "red";
        document.getElementById("res_name").style.borderWidth = "2px";
        $('#res_warn').show()
        check = false;
      } else {
        check = true;
      }
    
    if (document.getElementById("response_type").value === "text"){
      if (document.getElementById("text_value").value.length<7){
        document.getElementById("text_value").style.borderColor = "red";
        document.getElementById("text_value").style.borderWidth = "2px";
        $('#res_warn').show()
        check1 = false;
      } else {
        document.getElementById("text_value").style.borderColor = "green";
        document.getElementById("text_value").style.borderWidth = "2px";
        check1 = true;
        res[0].response ={"text":`${document.getElementById("text_value").value}`}
      }
    }
    
    
    
    
    
    else if (document.getElementById("response_type").value === "quick_replies"){
        newRes = document.getElementById("quick_replies_count_value").value;
        myN = newRes.split("_")[0];
        for (i = 1 ; i <= myN ; i ++){
          if (document.getElementById(`quick_${i}_title`).value === ""){
            check1 = false;
            $('#res_warn').show()
            document.getElementById(`quick_${i}_title`).style.borderColor = "red";
            document.getElementById(`quick_${i}_title`).style.borderWidth = "2px";
          } 
          if (document.getElementById(`quick_${i}_payload`).value === ""){
            check1 = false;
            $('#res_warn').show()
            document.getElementById(`quick_${i}_payload`).style.borderColor = "red";
            document.getElementById(`quick_${i}_payload`).style.borderWidth = "2px";
          
          }
          if (document.getElementById("quick_text_value").value.length<7){
            check1 = false;
            $('#res_warn').show()
            document.getElementById("quick_text_value").style.borderColor = "red";
            document.getElementById("quick_text_value").style.borderWidth = "2px";
          }
          if (document.getElementById("quick_text_value").value.length>7 && document.getElementById(`quick_${i}_title`).value !== "" && document.getElementById(`quick_${i}_payload`).value !== ""){
            check1 = true;
            var qr = []
            newRes = document.getElementById("quick_replies_count_value").value;
            myN = newRes.split("_")[0];
            for (i = 1 ; i <= myN ; i ++){
              qr[i-1] = {"content_type":"text","title":`${document.getElementById(`quick_${i}_title`).value}`, "payload":`${document.getElementById(`quick_${i}_payload`).value}`}
            }
            res[0].response ={"text":`${document.getElementById("quick_text_value").value}`, "quick_replies":qr}
          }
        }
      }
      else if (document.getElementById("response_type").value === "template"){
        iou = 0;
        if (document.getElementById("add_text_before_generic_template").checked == true) {
          if (document.getElementById("generic_template_text_before_value").value.length<7){
            check1 = false;
            $('#res_warn').show()
            document.getElementById("generic_template_text_before_value").style.borderColor = "red";
            document.getElementById("generic_template_text_before_value").style.borderWidth = "2px";
          } else {
            res[iou].response = {"text":`${document.getElementById("generic_template_text_before_value").value}`}
            check1 = true;
            iou++;
          }
        }

        newN = document.getElementById("generic_template_count_value").value.split("_")[0]
        for (y = 1 ; y <= newN; y++){
          if (document.getElementById(`template_${y}_title`).value.length < 2){
            check1 = false
            $('#res_warn').show()
            document.getElementById(`template_${y}_title`).style.borderColor = "red";
            document.getElementById(`template_${y}_title`).style.borderWidth = "2px";
          } else {
            check1 = true;
          }

          if (document.getElementById(`template_${y}_subtitle`).value.length < 2){
            check1 = false
            $('#res_warn').show()
            document.getElementById(`template_${y}_subtitle`).style.borderColor = "red";
            document.getElementById(`template_${y}_subtitle`).style.borderWidth = "2px";
          } else {
            check1 = true;
          }
          
          myN = document.getElementById(`buttons_count_template_${y}`).value.split("_")[0];
          for (i = 1 ; i <= myN ; i++){
            if (document.getElementById(`button_type_${y}_${i}`).value === "postback"){
              if (document.getElementById(`postback_${y}_${i}`).value.length < 2){
                check1 = false
                $('#res_warn').show()
                document.getElementById(`postback_${y}_${i}`).style.borderColor = "red";
                document.getElementById(`postback_${y}_${i}`).style.borderWidth = "2px";
              } else {
                check1 = true;
              }
              if (document.getElementById(`postback_${y}_${i}_title`).value.length < 2){
                check1 = false
                $('#res_warn').show()
                document.getElementById(`postback_${y}_${i}_title`).style.borderColor = "red";
                document.getElementById(`postback_${y}_${i}_title`).style.borderWidth = "2px";
              } else {
                check1 = true;
              }
            } else {
              if (document.getElementById(`weburl_${y}_${i}`).value.length < 2){
                check1 = false
                $('#res_warn').show()
                document.getElementById(`weburl_${y}_${i}`).style.borderColor = "red";
                document.getElementById(`weburl_${y}_${i}`).style.borderWidth = "2px";
              } else {
                check1 = true;
              }
              if (document.getElementById(`weburl_${y}_${i}_title`).value.length < 2){
                check1 = false
                $('#res_warn').show()
                document.getElementById(`weburl_${y}_${i}_title`).style.borderColor = "red";
                document.getElementById(`weburl_${y}_${i}_title`).style.borderWidth = "2px";
              } else {
                check1 = true;
              }
            }
          }
        }
      


        if (document.getElementById("replace_text_value_t").value.length<7){
          document.getElementById("replace_text_value_t").style.borderColor = "red";
          document.getElementById("replace_text_value_t").style.borderWidth = "2px";
          check1 = false;
          $('#res_warn').show();
        } else {
          check1 = true;
        }


          if (check1 === true){
            res[iou] = {};
            newN = document.getElementById("generic_template_count_value").value.split("_")[0]
            elements = []
            for (y = 0 ; y < newN; y++){
              buttons = []
              elements[y] = {}
              myN = document.getElementById(`buttons_count_template_${y+1}`).value.split("_")[0];
              for (i = 0 ; i < myN ; i++){
                if (document.getElementById(`button_type_${y+1}_${i+1}`).value === "postback"){
                  buttons[i] = {"type":"postback", "payload":`${document.getElementById(`postback_${y+1}_${i+1}`).value}`, "title":`${document.getElementById(`postback_${y+1}_${i+1}_title`).value}`}
                } else {
                  buttons[i] = {"type":"web_url", "url":`${document.getElementById(`weburl_${y+1}_${i+1}`).value}`, "title":`${document.getElementById(`weburl_${y+1}_${i+1}_title`).value}`}
                }
              }
              elements[y].title = document.getElementById(`template_${y+1}_title`).value;
              elements[y].subtitle = document.getElementById(`template_${y+1}_subtitle`).value;
              elements[y].image_url = document.getElementById(`template_${y+1}_url`).value;
              if (`${document.getElementById(`template_default_${y+1}_url`).value}` !== ""){
                elements[y].default_action = {"type":"web_url","url":`${document.getElementById(`template_default_${y+1}_url`).value}`}
              }
              elements[y].buttons = buttons
            }
            res[iou].response = {
              "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"generic",
                  "elements":elements
                }
              }
            }
            secRes[0].response = {"text":`${document.getElementById("replace_text_value_t").value}`
          }


          if (document.getElementById("add_quick_replies_after_generic_template").checked == true) {
            newRes = document.getElementById("quick_replies_count_for_generic_template_value").value;
            myN = newRes.split("_")[0];
            for (i = 1 ; i <= myN ; i ++){
              if (document.getElementById(`quick_${i}_title_for_generic_template`).value === ""){
                check1 = false;
                $('#res_warn').show()
                document.getElementById(`quick_${i}_title_for_generic_template`).style.borderColor = "red";
                document.getElementById(`quick_${i}_title_for_generic_template`).style.borderWidth = "2px";
              } 
              if (document.getElementById(`quick_${i}_payload_for_generic_template`).value === ""){
                check1 = false;
                $('#res_warn').show()
                document.getElementById(`quick_${i}_payload_for_generic_template`).style.borderColor = "red";
                document.getElementById(`quick_${i}_payload_for_generic_template`).style.borderWidth = "2px";
              
              }
              if (document.getElementById(`quick_${i}_title_for_generic_template`).value !== "" && document.getElementById(`quick_${i}_payload_for_generic_template`).value !== ""){
                check1 = true;
                var qr = []
                newRes = document.getElementById("quick_replies_count_for_generic_template_value").value;
                myN = newRes.split("_")[0];
                for (i = 1 ; i <= myN ; i ++){
                  qr[i-1] = {"content_type":"text","title":`${document.getElementById(`quick_${i}_title_for_generic_template`).value}`, "payload":`${document.getElementById(`quick_${i}_payload_for_generic_template`).value}`}
                }
                res[iou].response = {
                  "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"generic",
                      "elements":elements
                    }
                  }, "quick_replies":qr
                }
                secRes[0].response ={"text":`${document.getElementById("replace_text_value_t").value}`, "quick_replies":qr}
              }
            }
          }
        }
      }
          

     else if (document.getElementById("response_type").value === "attachment"){
     
     
      if (document.getElementById("attachments").value === "image"){
        iou = 0;
        if (document.getElementById("add_text_before_image").checked == true) {
          if (document.getElementById("image_text_before_value").value.length<7){
            check1 = false;
            $('#res_warn').show()
            document.getElementById("image_text_before_value").style.borderColor = "red";
            document.getElementById("image_text_before_value").style.borderWidth = "2px";
          } else {
            res[iou].response = {"text":`${document.getElementById("image_text_before_value").value}`}
            check1 = true;
            iou++;
          }
        }

        if (document.getElementById("replace_text_value").value.length<7){
          document.getElementById("replace_text_value").style.borderColor = "red";
          document.getElementById("replace_text_value").style.borderWidth = "2px";
          check1 = false;
          $('#res_warn').show();
        } else {
          check1 = true;
        }

        if (check1 == true || document.getElementById("add_text_before_image").checked == false){
          try{
            check1 == true;
            res[iou] = {};
            res[iou].response = {"attachment":{type:"image", payload:{url:`${document.getElementById("image_link").value}`}}}
            secRes[0].response = {"text":`${document.getElementById("replace_text_value").value}`}
            new URL(document.getElementById("image_link").value)
          } catch (_){
            document.getElementById("image_link").style.borderColor = "red";
            document.getElementById("image_link").style.borderWidth = "2px";
            check1 = false;
            $('#res_warn').show()
          }
        }
        if (check1 == true){
          if (document.getElementById("add_quick_replies_after_image").checked == true) {
            newRes = document.getElementById("quick_replies_count_for_image_value").value;
            myN = newRes.split("_")[0];
            for (i = 1 ; i <= myN ; i ++){
              if (document.getElementById(`quick_${i}_title_for_image`).value === ""){
                check1 = false;
                $('#res_warn').show()
                document.getElementById(`quick_${i}_title_for_image`).style.borderColor = "red";
                document.getElementById(`quick_${i}_title_for_image`).style.borderWidth = "2px";
              } 
              if (document.getElementById(`quick_${i}_payload_for_image`).value === ""){
                check1 = false;
                $('#res_warn').show()
                document.getElementById(`quick_${i}_payload_for_image`).style.borderColor = "red";
                document.getElementById(`quick_${i}_payload_for_image`).style.borderWidth = "2px";  
              }
              if (document.getElementById(`quick_${i}_title_for_image`).value !== "" && document.getElementById(`quick_${i}_payload_for_image`).value !== ""){
                check1 = true;
                var qr = []
                newRes = document.getElementById("quick_replies_count_for_image_value").value;
                myN = newRes.split("_")[0];
                for (i = 1 ; i <= myN ; i ++){
                  qr[i-1] = {"content_type":"text","title":`${document.getElementById(`quick_${i}_title_for_image`).value}`, "payload":`${document.getElementById(`quick_${i}_payload_for_image`).value}`}
                }
                res[iou].response = {"attachment":{type:"image", payload:{url:`${document.getElementById("image_link").value}`}},"quick_replies":qr}
                secRes[0].response ={"text":`${document.getElementById("replace_text_value").value}`, "quick_replies":qr}
              }
            }
          }
        }
        
      } else if (document.getElementById("attachments").value === "audio"){
        
        iou = 0;
        if (document.getElementById("add_text_before_audio").checked == true) {
          if (document.getElementById("audio_text_before_value").value.length<7){
            check1 = false;
            $('#res_warn').show()
            document.getElementById("audio_text_before_value").style.borderColor = "red";
            document.getElementById("audio_text_before_value").style.borderWidth = "2px";
          } else {
            res[iou].response = {"text":`${document.getElementById("audio_text_before_value").value}`}
            check1 = true;
            iou++;
          }
        }

        if (document.getElementById("replace_text_value").value.length<7){
          document.getElementById("replace_text_value").style.borderColor = "red";
          document.getElementById("replace_text_value").style.borderWidth = "2px";
          check1 = false;
          $('#res_warn').show();
        } else {
          check1 = true;
        }
        if (check1 == true || document.getElementById("add_text_before_audio").checked == false){
          try{
            check1 == true;
            res[iou] = {};
            res[iou].response = {"attachment":{type:"audio", payload:{url:`${document.getElementById("audio_link").value}`}}}
            secRes[0].response = {"text":`${document.getElementById("replace_text_value").value}`}
            new URL(document.getElementById("audio_link").value)
          } catch (_){
            document.getElementById("audio_link").style.borderColor = "red";
            document.getElementById("audio_link").style.borderWidth = "2px";
            check1 = false;
            $('#res_warn').show()
          }
        }
        if (check1 == true){
          if (document.getElementById("add_quick_replies_after_audio").checked == true) {
            newRes = document.getElementById("quick_replies_count_for_audio_value").value;
            myN = newRes.split("_")[0];
            for (i = 1 ; i <= myN ; i ++){
              if (document.getElementById(`quick_${i}_title_for_audio`).value === ""){
                check1 = false;
                $('#res_warn').show()
                document.getElementById(`quick_${i}_title_for_audio`).style.borderColor = "red";
                document.getElementById(`quick_${i}_title_for_audio`).style.borderWidth = "2px";
              } 
              if (document.getElementById(`quick_${i}_payload_for_audio`).value === ""){
                check1 = false;
                $('#res_warn').show()
                document.getElementById(`quick_${i}_payload_for_audio`).style.borderColor = "red";
                document.getElementById(`quick_${i}_payload_for_audio`).style.borderWidth = "2px";
              }
              if (document.getElementById(`quick_${i}_title_for_audio`).value !== "" && document.getElementById(`quick_${i}_payload_for_audio`).value !== ""){
                check1 = true;
                var qr = []
                newRes = document.getElementById("quick_replies_count_for_audio_value").value;
                myN = newRes.split("_")[0];
                for (i = 1 ; i <= myN ; i ++){
                  qr[i-1] = {"content_type":"text","title":`${document.getElementById(`quick_${i}_title_for_audio`).value}`, "payload":`${document.getElementById(`quick_${i}_payload_for_audio`).value}`}
                }
                res[iou].response = {"attachment":{type:"audio", payload:{url:`${document.getElementById("audio_link").value}`}},"quick_replies":qr}
                secRes[0].response = {"text":`${document.getElementById("replace_text_value").value}`, "quick_replies":qr}              
              }
            }
          }
        }
        
        
        
      } else if (document.getElementById("attachments").value === "video"){  


        iou = 0;
        if (document.getElementById("add_text_before_video").checked == true) {
          if (document.getElementById("video_text_before_value").value.length<7){
            check1 = false;
            $('#res_warn').show()
            document.getElementById("video_text_before_value").style.borderColor = "red";
            document.getElementById("video_text_before_value").style.borderWidth = "2px";
          } else {
            res[iou].response = {"text":`${document.getElementById("video_text_before_value").value}`}
            check1 = true;
            iou++;
          }
        }

        if (document.getElementById("replace_text_value").value.length<7){
          document.getElementById("replace_text_value").style.borderColor = "red";
          document.getElementById("replace_text_value").style.borderWidth = "2px";
          check1 = false;
          $('#res_warn').show();
        } else {
          check1 = true;
        }
        if (check1 == true || document.getElementById("add_text_before_video").checked == false){
          try{
            check1 == true;
            res[iou] = {};
            res[iou].response = {"attachment":{type:"video", payload:{url:`${document.getElementById("video_link").value}`}}}
            secRes[0].response = {"text":`${document.getElementById("replace_text_value").value}`}
            new URL(document.getElementById("video_link").value)
          } catch (_){
            document.getElementById("video_link").style.borderColor = "red";
            document.getElementById("video_link").style.borderWidth = "2px";
            check1 = false;
            $('#res_warn').show()
          }
        }
        if (check1 == true){
          if (document.getElementById("add_quick_replies_after_video").checked == true) {
            newRes = document.getElementById("quick_replies_count_for_video_value").value;
            myN = newRes.split("_")[0];
            for (i = 1 ; i <= myN ; i ++){
              if (document.getElementById(`quick_${i}_title_for_video`).value === ""){
                check1 = false;
                $('#res_warn').show()
                document.getElementById(`quick_${i}_title_for_video`).style.borderColor = "red";
                document.getElementById(`quick_${i}_title_for_video`).style.borderWidth = "2px";
              } 
              if (document.getElementById(`quick_${i}_payload_for_video`).value === ""){
                check1 = false;
                $('#res_warn').show()
                document.getElementById(`quick_${i}_payload_for_video`).style.borderColor = "red";
                document.getElementById(`quick_${i}_payload_for_video`).style.borderWidth = "2px";
              }
              if (document.getElementById(`quick_${i}_title_for_video`).value !== "" && document.getElementById(`quick_${i}_payload_for_video`).value !== ""){
                check1 = true;
                var qr = []
                newRes = document.getElementById("quick_replies_count_for_video_value").value;
                myN = newRes.split("_")[0];
                for (i = 1 ; i <= myN ; i ++){
                  qr[i-1] = {"content_type":"text","title":`${document.getElementById(`quick_${i}_title_for_video`).value}`, "payload":`${document.getElementById(`quick_${i}_payload_for_video`).value}`}
                }
                res[iou].response = {"attachment":{type:"video", payload:{url:`${document.getElementById("video_link").value}`}},"quick_replies":qr}
                secRes[0].response = {"text":`${document.getElementById("replace_text_value").value}`, "quick_replies":qr}
              }
            }
          }
        }
      } else if (document.getElementById("attachments").value === "file"){ 
        iou = 0;
        if (document.getElementById("add_text_before_file").checked == true) {
          if (document.getElementById("file_text_before_value").value.length<7){
            check1 = false;
            $('#res_warn').show()
            document.getElementById("file_text_before_value").style.borderColor = "red";
            document.getElementById("file_text_before_value").style.borderWidth = "2px";
          } else {
            res[iou].response = {"text":`${document.getElementById("file_text_before_value").value}`}
            check1 = true;
            iou++;
          }
        }
        if (document.getElementById("replace_text_value").value.length<7){
          document.getElementById("replace_text_value").style.borderColor = "red";
          document.getElementById("replace_text_value").style.borderWidth = "2px";
          check1 = false;
          $('#res_warn').show();
        } else {
          check1 = true;
        }
        if (check1 == true || document.getElementById("add_text_before_file").checked == false){
          try{
            check1 == true;
            res[iou] = {};
            res[iou].response = {"attachment":{type:"file", payload:{url:`${document.getElementById("file_link").value}`}}}
            secRes[0].response = {"text":`${document.getElementById("replace_text_value").value}`}
            new URL(document.getElementById("file_link").value)
          } catch (_){
            document.getElementById("file_link").style.borderColor = "red";
            document.getElementById("file_link").style.borderWidth = "2px";
            check1 = false;
            $('#res_warn').show()
          }
        }
        if (check1 == true){
          if (document.getElementById("add_quick_replies_after_file").checked == true) {
            newRes = document.getElementById("quick_replies_count_for_file_value").value;
            myN = newRes.split("_")[0];
            for (i = 1 ; i <= myN ; i ++){
              if (document.getElementById(`quick_${i}_title_for_file`).value === ""){
                check1 = false;
                $('#res_warn').show()
                document.getElementById(`quick_${i}_title_for_file`).style.borderColor = "red";
                document.getElementById(`quick_${i}_title_for_file`).style.borderWidth = "2px";
              } 
              if (document.getElementById(`quick_${i}_payload_for_file`).value === ""){
                check1 = false;
                $('#res_warn').show()
                document.getElementById(`quick_${i}_payload_for_file`).style.borderColor = "red";
                document.getElementById(`quick_${i}_payload_for_file`).style.borderWidth = "2px";
              }
              if (document.getElementById("quick_text_for_file_value").value.length>7 && document.getElementById(`quick_${i}_title_for_file`).value !== "" && document.getElementById(`quick_${i}_payload_for_file`).value !== ""){
                check1 = true;
                var qr = []
                newRes = document.getElementById("quick_replies_count_for_file_value").value;
                myN = newRes.split("_")[0];
                for (i = 1 ; i <= myN ; i ++){
                  qr[i-1] = {"content_type":"text","title":`${document.getElementById(`quick_${i}_title_for_file`).value}`, "payload":`${document.getElementById(`quick_${i}_payload_for_file`).value}`}
                }
                res[iou].response = {"attachment":{type:"file", payload:{url:`${document.getElementById("file_link").value}`}},"quick_replies":qr}
                secRes[0].response = {"text":`${document.getElementById("replace_text_value").value}`, "quick_replies":qr}
              }
            }
          }
        }
      }
    }

    if (document.getElementById("assign").value === "intent"){
        check2 = true;
        res[0].type = {"name":`Intent`}
        res[0].assign_to = {"value":`${document.getElementById("assign_value_intent").value}`}
      
    }
    else if (document.getElementById("assign").value === "entity_no_matches"){
        res[0].type = {"name":`Entity no matches`}
        res[0].assign_to = {"value":`${document.getElementById("assign_value_entity_only").value}`}
        check2 = true;
    } else if (document.getElementById("assign").value === "entity_only"){
        res[0].type = {"name":`Entity`}
        res[0].assign_to = {"value":`${document.getElementById("assign_value_entity_only").value}`}
        check2 = true;
    } else if (document.getElementById("assign").value === "postback"){
      if (document.getElementById("assign_value_payload").value.length<3){
        document.getElementById("assign_value_payload").style.borderColor = "red";
        document.getElementById("assign_value_payload").style.borderWidth = "2px";
        check2 = false;
        $('#res_warn').show()
      } else {
        check2 = true;
        res[0].type = {"name":`Postback`}
        res[0].assign_to = {"value":`${document.getElementById("assign_value_payload").value}`}
      }
    }
    if(check1 == true && check2 == true && check == true){
      if (res[0].assign_to_2 && pageData.responses.M[`${res[0].assign_to.value}_${res[0].assign_to_2.value}`] || pageData.responses.M[`${res[0].assign_to.value}`]){
        $('#warn_exist').show();
        $("divNew").on("keyup", function(){  
          $('#warn_exist').hide();
          
        });
      } 
      if (document.getElementById("confirm_replace").checked || !pageData.responses.M[`${res[0].assign_to.value}`]){
        document.getElementById(`addResponse_1`).disabled = true; 
        document.getElementById(`addResponse_1`).innerHTML = ` 
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Adding </span>`
        entityData = document.getElementById("entity_matching_value").value;
        if ( entityData.length > 1 ){
        }
        var formData = {}
        formData.response = []
        formData.secondaryResponse = []
        if (document.getElementById("persona_value")){
          persona = document.getElementById("persona_value").value;
        } else {
          persona = "default_";
        }
        if (persona !== "default"){
          formData.persona_id = persona.split("_")[1]
          formData.persona_name = persona.split("_")[0]
        } else {
          formData.persona_name = persona.split("_")[0]
        }
        formData.response = res
        if (secRes){
          formData.secondaryResponse = secRes
        }
        
        fetch(`/add_response?page_id=${pageData.pageID.S}&response_name=${document.getElementById("res_name").value}&assosiated_with=${res[0].assign_to.value}&type=${res[0].type.name}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => { 
          if (data.data.Item){
            pageData = data.data.Item
          } else {
            addResponse();
          }
          //Add the response to the data
          messengerResponses();
        })
        .catch((error) => {
          addResponse();
        });
      } 
    } else {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }

    // Function to confirm delete utterance
    async function deleteResponse(x){
      mainP = `<divMain><h2>Delete Response <b>${x.split("_+_")[0]}</b></h2><hr><div class="row"><div class="form-group col-md-12"><p>Are you sure that you want to delete <b>${x.split("_+_")[0]}</b>?</p><button type="button" class="btn btn-danger" style="margin-right:5px;" id="deleteRes" onclick="deleteResponse_2('${x.split("_+_")[1]}')">Delete Response</button><button type="button" class="btn btn-secondary" onclick="messengerResponses();">Cancel</button></div></div>`
      $('divMain').replaceWith(mainP);      
    }
    // Function to  delete utterance
    async function deleteResponse_2(x){
      document.getElementById("deleteRes").innerHTML = ` 
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Deleting </span>`
      document.getElementById("deleteRes").disabled = true 
      //$('#load22').show(); 
        await fetch(`/delete_response?response=${x}&page_id=${pageData.pageID.S}`)
        .then(response => response.json())
        .then(data => {
          pageData = data.data.Item
          messengerResponses();
          //$('#load22').hide();
        })
        .catch((error) => {
          deleteResponse(x);
        });

    }
  // Function to check the menu on body click and close.
  function checkMenu(){
    if($(".page-wrapper.chiller-theme.toggled")[0]){
      $(".page-wrapper").removeClass('toggled')
    }
  }
  // Function fo open and close the side menu bar.
  jQuery(function ($) {
    $(".sidebar-dropdown > a").click(function() {
      $(".sidebar-submenu").slideUp(200);
        if ($(this).parent().hasClass("active")) {
        $(".sidebar-dropdown").removeClass("active");
        $(this).parent().removeClass("active");
      } else {
        $(".sidebar-dropdown").removeClass("active");
        $(this).next(".sidebar-submenu").slideDown(200);
        $(this).parent().addClass("active");
      }
    });
    $("#close-sidebar").click(function() {
      $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function() {
      $(".page-wrapper").addClass("toggled");
    });
  });
  // Function for File Upload
  function fileUpload() {
    document.querySelector('#fileUpload').addEventListener('change', event => {
      files = event.target.files
      if (files[0].name.includes(".zip")){
        $('divImportMsg').replaceWith("<divImportMsg><h6 style='color:green; ; margin-bottom:25px''> <b>This looks good! Click import to check and create new App.</b> </h6></divImportMsg>");
        document.getElementById("imButton").disabled = false;
      } else {
        $('divImportMsg').replaceWith("<divImportMsg><h6 style='color:red; margin-bottom:25px'> <b>This doesn't seem to be a .zip file. Please upload .zip file for the Wit App data.</b> </h6></divImportMsg>");
        document.getElementById("imButton").disabled = true;
      }
    })
  }
  // Function for App import
  async function importApp() {
    $('divMain').replaceWith("<divMain></divMain>");      
    $('#load22').show();
    const formData = new FormData()
    formData.append('file', files[0])
    await fetch(`/import_app?app_id=${pageData.app_id.S}&wit_key=${pageData.wit_key.S}&page_id=${pageData.pageID.S}`, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      $('#load22').hide();
      ai_tab('import_app');
      if (data.successMsg){
        $('divImportMsg').replaceWith(`<divImportMsg><h6 style='color:green; ; margin-bottom:25px''> <b>All good!! ${data.successMsg}</b> </h6></divImportMsg>`);
        pageData.wit_key.S = data.app_token;
        pageData.app_id.S = data.app_id;
      } else {
        $('divImportMsg').replaceWith(`<divImportMsg><h6 style='color:red; ; margin-bottom:25px''> <b>Error: ${data.failMsg}</b> </h6></divImportMsg>`);
      }
    })
    .catch(error => {
      importApp();
    })   
  }
  // Function to display/hide the secret
  function displayFun() {
    var x = document.getElementById("app_secret");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  } 
  // Function to display/hide the token during change
  function displayai_tab() {
    var x = document.getElementById("app_token");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  // Function to update the post link and secret
  // Need check and adjust
  async function updateFun(Val) {
    if (Val === "link"){
      await fetch(`/post_update?page_id=${pageData.pageID.S}&data1=${document.getElementById("post_url").value}&data2=${pageData.post_secret.S}`)
      .then(response => response.json())
      .then(data => {
        pageData.post_link.S = document.getElementById("post_url").value;
        ai_tab('postURL')
        document.getElementById("updateState2").innerHTML = "<b>Link Updated!</b>"
      })
      .catch((error) => {
        updateFun(Val)
      });
    } else {
      await fetch(`/post_update?page_id=${pageData.pageID.S}&data1=${pageData.post_link.S}&data2=${document.getElementById("app_secret").value}`)
      .then(response => response.json())
      .then(data => {
        pageData.post_secret.S = document.getElementById("app_secret").value;
        ai_tab('postURL')
        document.getElementById("updateState").innerHTML = "<b>Secret Updated!</b>"
      })
      .catch((error) => {
        updateFun(Val);
      });
    }
  }
  // Function to change and update the Wit App
  async function updateai_tab() {
    document.getElementById("changeButton").disabled = true;
    await fetch(`/update_wit?page_id=${pageData.pageID.S}&&id1=${pageData.app_id.S}&token1=${pageData.wit_key.S}&id2=${document.getElementById("app_id").value}&token2=${document.getElementById("app_token").value}`)
    .then(response => response.json())
    .then(data => {
      if (data.success){
        pageData.wit_key.S = document.getElementById("app_token").value;
        pageData.app_id.S = document.getElementById("app_id").value;
        document.getElementById("updateState3").innerHTML = "<b style='color:green'>Wit App Updated!</b>"
      } else {
        document.getElementById("changeButton").disabled = false;
        document.getElementById("updateState3").innerHTML = "<b style='color:red'>This App credentials are not valid.!</b>"
      }
    })
    .catch((error) => {
      updateai_tab();
    });
  }
  // Function to export the current Wit App
  async function exportApp() {
    await fetch(`/export_app?token=${pageData.wit_key.S}`)
    .then(response => response.json())
    .then(data => {
      if (data.sucess){
        $('divExportMsg').replaceWith(`<divExportMsg><h6 style='color:green; margin-bottom:25px;'> <b>All good!! Here is your link:<br><br><a href = "${data.url}">Download</a></b> </h6></divExportMsg>`);
      } else {
        $('divExportMsg').replaceWith(`<divExportMsg><h6 style='color:red; margin-bottom:25px;'> <b>Something went wrong!</b> </h6></divExportMsg>`);
      }
    })
    .catch((error) => {
      exportApp()
    });
  }
  // Function to confirm delete utterance
  async function deleteUtterance1(utterance){
    mainP = `<divMain><h2>Delete Utterance <b>${utterance}</b></h2><hr><div class="row"><div class="form-group col-md-12"><p>Are you sure that you want to delete <b>${utterance}</b>?</p><button type="button" class="btn btn-danger" style="margin-right:5px;" onclick="deleteUtterance('${utterance}')">Delete Intent</button><button type="button" class="btn btn-secondary" onclick="ai_tab('utterances')">Cancel</button></div></div>`
    $('divMain').replaceWith(mainP);      
  }
  // Function to  delete utterance
  async function deleteUtterance(utterance){
    $('divMain').replaceWith("<divMain></divMain>");      
    $('#load22').show(); 
    if (pageData.utterances.M[`${utterance}`]){
      await fetch(`/delete_utterance?pageID=${pageData.pageID.S}&index=${pageData.utterances.M[`${utterance}`].L[0].N}&intent="delete"&utterance=${utterance}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        $('#load22').hide();
        ai_tab('utterances') 
      })
      .catch((error) => {
        deleteUtterance1(utterance);
      });
    } else {
      await fetch(`/delete_utterance?pageID=${pageData.pageID.S}&index=9999&intent="delete"&utterance=${utterance}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        $('#load22').hide();
        ai_tab('utterances') 
      })
      .catch((error) => {
        deleteUtterance1(utterance);
      });
    }
  }
  // Function to confirm delete intent
  async function deleteIntent1(intent){
    mainP = `<divMain><button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('intent')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button><h2>Delete Intent <b>${intent.split("_+_")[0]}</b></h2><hr><div class="row"><div class="form-group col-md-12"><p>Are you sure that you want to delete <b>${intent.split("_+_")[0]}</b>? This will convert all the assosiated utterances into Out of Scope.<br>*Currently, you have <b>${intent.split("_+_")[1]}</b> utterances trained for this intent!</p><button type="button" class="btn btn-danger" style="margin-right:5px;" onclick="deleteIntent('${intent.split("_+_")[0]}')">Delete Intent</button><button type="button" class="btn btn-secondary" onclick="ai_tab('intent')">Cancel</button></div></div> `
    $('divMain').replaceWith(mainP);      
  }
  // Function to  delete intent
  async function deleteIntent(intent){
    $('divMain').replaceWith("<divMain></divMain>");      
    $('#load22').show(); 
    await fetch(`/delete_intent?intent=${intent}&key=${pageData.wit_key.S}`)
    .then(response => response.json())
    .then(data => {
      $('#load22').hide();
      ai_tab('intent') 
    })
    .catch((error) => {
      deleteIntent1(intent)
    });
  }
  // Function to confirm delete entity.
  async function deleteEntity1(entity){
    mainP = `<divMain><button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('entities')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button><h2>Delete Entity <b>${entity.split("_+_")[0]}</b></h2><hr><div class="row"><div class="form-group col-md-12"><p>Are you sure that you want to delete <b>${entity.split("_+_")[0]}</b>? This will remove it from the utterances in use.<br>*Currently, you have <b>${entity.split("_+_")[1]}</b> utterances trained for this entity!</p><button type="button" class="btn btn-danger" style="margin-right:5px;" onclick="deleteEntity('${entity.split("_+_")[0]}')">Delete Intent</button><button type="button" class="btn btn-secondary" onclick="ai_tab('intent')">Cancel</button></div></div>`
    $('divMain').replaceWith(mainP);      
  }
  // Function to  delete entity.
  async function deleteEntity(entity){
    $('divMain').replaceWith("<divMain></divMain>");      
    $('#load22').show(); 
    await fetch(`/delete_entity?entity=${entity}&key=${pageData.wit_key.S}`)
    .then(response => response.json())
    .then(data => {
      $('#load22').hide();
      ai_tab('entities') 
    })
    .catch((error) => {
      deleteEntity(entity)
    });
  }

  async function addEntity(){
    document.getElementById(`addEntity`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Adding </span>`
    document.getElementById(`addEntity`).disabled = true 
      await fetch(`/add_entity?entity=${document.getElementById("entity_name").value}&key=${pageData.wit_key.S}&keyword=${document.getElementById("keyword").checked}&free_text=${document.getElementById("free_text").checked}`)
      .then(response => response.json())
      .then(data => {
        if (data.success){
          ai_tab('entities') 
        } else {
          document.getElementById("updateState5").innerHTML = "<b style='color:red'>This name either contain unsupported characters or it already exists. Please try a different name.</b>"
          document.getElementById(`addEntity`).innerHTML = ` 
          Add`
          document.getElementById(`addEntity`).disabled = false 
        }
      })
      .catch((error) => {
        addEntity();
    });
  }

  async function builtEntity(name){
    document.getElementById(`add-${name.split("/")[1]}`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Adding`
    document.getElementById(`add-${name.split("/")[1]}`).disabled = true;
    await fetch(`/add_entity?entity=wit$${name.split("/")[1]}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        if (data.success){
          document.getElementById(`add-${name.split("/")[1]}`).innerHTML = `Added`;
          document.getElementById(`confirm-${name.split("/")[1]}`).innerHTML = `Entity Added ✔️.`;
        } else {
          document.getElementById(`add-${name.split("/")[1]}`).innerHTML = `Add`
          document.getElementById(`add-${name.split("/")[1]}`).disabled = false
          document.getElementById(`confirm-${name.split("/")[1]}`).style = `color:red`
          document.getElementById(`confirm-${name.split("/")[1]}`).innerHTML = `Try Again!`
        }
      })
      .catch((error) => {
        builtEntity(name)
    });
  }

  async function deleteTrait1(trait){
    mainP = `
    <divMain>
    <button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('traits')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button>
          <h2>Delete Trait <b>${trait.split("_+_")[0]}</b></h2>
        <hr>
        <div class="row">
          <div class="form-group col-md-12">
            <p>Are you sure that you want to delete <b>${trait.split("_+_")[0]}</b>? This will remove it from the utterances in use.<br>*Currently, you have <b>${trait.split("_+_")[1]}</b> utterances trained for this trait!</p>
              <button type="button" class="btn btn-danger" style="margin-right:5px;" onclick="deleteTrait('${trait.split("_+_")[0]}')">
                    Delete Intent
                  </button>
                  <button type="button" class="btn btn-secondary" onclick="ai_tab('traits')">
                    Cancel
                  </button>
              </div>

        </div>
                 
    `
    $('divMain').replaceWith(mainP);      
  }


  async function deleteTrait(trait){
    $('divMain').replaceWith("<divMain></divMain>");      
    $('#load22').show(); 
        await fetch(`/delete_trait?trait=${trait}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        $('#load22').hide();
        ai_tab('traits') 
      })
      .catch((error) => {
        deleteTrait(trait)
    });
  }

  async function deleteDomain(url){
    mainP = `
    <divMain>
    <button class="btn btn-info btn-sm" type="button" onclick = "FacebookTab('whitelist')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button>
          <h2>Delete Whitelisted domain <b>${url}</b></h2>
        <hr>
        <div class="row">
          <div class="form-group col-md-12">
            <p>Are you sure that you want to delete domain <b>${url}</b>? You will no longer be able to use this domain with certain features!</p>
              <button type="button" class="btn btn-danger" style="margin-right:5px;" id = "deleteDomain2" onclick="deleteDomain2('${url}')">
                    Delete Domain
                  </button>
                  <button type="button" class="btn btn-secondary" onclick="FacebookTab('whitelist')">
                    Cancel
                  </button>
              </div>

        </div>
                 
    `
    $('divMain').replaceWith(mainP);      
  }

  async function deleteDomain2(url){
    document.getElementById(`deleteDomain2`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Deleting`
    document.getElementById(`deleteDomain2`).disabled = true
    tok = {current: `${whitelisted_data}`,deleteURL: `${url}` ,token: `${pageData.page_access_token.S}`}
          await fetch(`/whitelisted`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tok)
        })
          .then(response => response.json())
          .then(data => {
            if (data.state){
              whitelisted_data = data.state;
              FacebookTab('whitelist')
            } else {
              whitelisted_data = null;
              FacebookTab('whitelist')
            }

          })
          .catch((error) => {
            deleteDomain2(url)
        });
  }








  
  async function deleteMenu2(){
    document.getElementById(`deleteMenu2`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Deleting`
    document.getElementById(`deleteMenu2`).disabled = true
    tok = {deleteMenu: `` ,token: `${pageData.page_access_token.S}`}
        await fetch(`/delete_menu`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tok)
      })
          .then(response => response.json())
          .then(data => {
            if (data.state){
              psMenu_data = []
              FacebookTab('persistentMenu')
            } else {
              psMenu_data = null
              FacebookTab('persistentMenu')
            }

          })
          .catch((error) => {
            deleteMenu2()
        });
          
  }


  async function deleteMenu(){
    mainP = `
    <divMain>
    <button class="btn btn-info btn-sm" type="button" onclick = "FacebookTab('persistentMenu')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button>
          <h2>Delete <b>Persistent Menu</b></h2>
        <hr>
        <div class="row">
          <div class="form-group col-md-12">
            <p>Are you sure that you want to delete <b>Persistent Menu</b>? Users won't see the menu anymore!</p>
              <button type="button" class="btn btn-danger" style="margin-right:5px;" id = "deleteMenu2" onclick="deleteMenu2()">
                    Delete Menu
                  </button>
                  <button type="button" class="btn btn-secondary" onclick="FacebookTab('persistentMenu')">
                    Cancel
                  </button>
              </div>

        </div>
                 
    `
    $('divMain').replaceWith(mainP);      
  }


  async function createGetStarted(){
    document.getElementById(`createGetStarted`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Creating </span>`
    document.getElementById(`createGetStarted`).disabled = true 
  tok = {new: "", token: `${pageData.page_access_token.S}`}
        await fetch(`/post_get_started`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tok)
      })
          .then(response => response.json())
          .then(data => {
            if (data.state){
              get_started_data = {data:[{get_started:{payload:"GET_STARTED"}}]}
              FacebookTab('get_started')
            } else {
              get_started_data = null;
              FacebookTab('get_started')
            }
          })
          .catch((error) => {
            createGetStarted()
        });
          
  }


  async function deleteGetStarted2(){
    document.getElementById(`deleteGetStarted`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Deleting </span>`
    document.getElementById(`deleteGetStarted`).disabled = true 
  tok = {token: `${pageData.page_access_token.S}`}
        await fetch(`/delete_get_started`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tok)
      })
          .then(response => response.json())
          .then(data => {
            if (data.state){
              get_started_data = {data:[]};
              FacebookTab('get_started')
            } else {
              get_started_data = null;
              FacebookTab('get_started')
            }
          })
          .catch((error) => {
            deleteGetStarted2()
        });
  }


  async function deleteGetStarted(){
    mainP = `
    <divMain>
    <button class="btn btn-info btn-sm" type="button" onclick = "FacebookTab('get_started')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button>
          <h2>Delete <b>Get Started Button</b></h2>
        <hr>
        <div class="row">
          <div class="form-group col-md-12">
            <p>Are you sure that you want to delete <b>Get Started Button</b>? This will delete the persistent menu as well!</p>
              <button type="button" class="btn btn-danger" style="margin-right:5px;" id = "deleteGetStarted" onclick="deleteGetStarted2()">
                    Delete Get Started
                  </button>
                  <button type="button" class="btn btn-secondary" onclick="FacebookTab('get_started')">
                    Cancel
                  </button>
              </div>

        </div>
                 
    `
    $('divMain').replaceWith(mainP);      
  }

  async function updateGreeting(){
    if (document.getElementById("addGreeting")){
      document.getElementById(`addGreeting`).innerHTML = ` 
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Adding Message</span>`
      document.getElementById(`addGreeting`).disabled = true 
    } else {
      document.getElementById(`updateGreeting`).innerHTML = ` 
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Updating Message</span>`
      document.getElementById(`updateGreeting`).disabled = true 
    }

  tok = {greeting:`${document.getElementById(`greeting_message`).value}`, token: `${pageData.page_access_token.S}`}
        await fetch(`/set_greeting`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tok)
      })
          .then(response => response.json())
          .then(data => {
            if (data.state){
              greeting_data = `${tok.greeting}`;
              FacebookTab('greeting')
            } else {
              greeting_data = null;
              FacebookTab('greeting')
            }
          })
          .catch((error) => {
            updateGreeting()
        });

  }





  async function deleteGreeting2(){
    document.getElementById(`deleteGreeting2`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Deleting </span>`
    document.getElementById(`deleteGreeting2`).disabled = true 
  tok = {token: `${pageData.page_access_token.S}`}
        await fetch(`/delete_greeting`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tok)
      })
          .then(response => response.json())
          .then(data => {
            if (data.state){
              greeting_data = "";
              FacebookTab('greeting')
            } else {
              greeting_data = null;
              FacebookTab('greeting')
            }
          })
          .catch((error) => {
            deleteGreeting2()
        });
  }


  async function deleteGreeting(){
    mainP = `
    <divMain>
    <button class="btn btn-info btn-sm" type="button" onclick = "FacebookTab('greeting')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button>

          <h2>Delete <b>Greeting Message</b></h2>
        <hr>
        <div class="row">
          <div class="form-group col-md-12">
            <p>Are you sure that you want to delete <b>Greeting Message</b>? It won't be visiblw to new users!</p>
              <button type="button" class="btn btn-danger" style="margin-right:5px;" id = "deleteGreeting2" onclick="deleteGreeting2()">
                    Delete Greeting
                  </button>
                  <button type="button" class="btn btn-secondary" onclick="FacebookTab('greeting')">
                    Cancel
                  </button>
              </div>

        </div>
                 
    `
    $('divMain').replaceWith(mainP);      
  }





















  async function deleteMenuItem2(item){
    document.getElementById(`deleteMenuItem2`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Deleting`
    document.getElementById(`deleteMenuItem2`).disabled = true
  tok = {current: psMenu_data, deleteItem: `${item}`, token: `${pageData.page_access_token.S}`}
           await fetch(`/persistent_menu`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tok)
      })
          .then(response => response.json())
          .then(data => {
            if (data.state){
              psMenu_data = current;
              FacebookTab('persistentMenu')
            } else {
              psMenu_data = null;
              FacebookTab('persistentMenu')
            }
          })
          .catch((error) => {
            deleteMenuItem2()
        });
  }


  async function deleteMenuItem(title){
    mainP = `
    <divMain>
    <button class="btn btn-info btn-sm" type="button" onclick = "FacebookTab('persistentMenu')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button>
          <h2>Delete Menu Item <b>${title}</b></h2>
        <hr>
        <div class="row">
          <div class="form-group col-md-12">
            <p>Are you sure that you want to delete Menu Item <b>${title}</b>? Users won't see it any more in the menu!</p>
              <button type="button" class="btn btn-danger" style="margin-right:5px;" id = "deleteMenuItem2" onclick="deleteMenuItem2('${title}')">
                    Delete Item
                  </button>
                  <button type="button" class="btn btn-secondary" onclick="FacebookTab('persistentMenu')">
                    Cancel
                  </button>
              </div>

        </div>
                 
    `
    $('divMain').replaceWith(mainP);      
  }












  async function deletePersona2(personaID){
    document.getElementById(`deletePersona2`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Deleting Persona </span>`
    document.getElementById(`deletePersona2`).disabled = true 
    tok = {persona_id: `${personaID}` ,token: `${pageData.page_access_token.S}`}
           await fetch(`/personas`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tok)
      })
          .then(response => response.json())
          .then(data => {
            FacebookTab('personas')
          })
          .catch((error) => {
            deletePersona2(personaID)
        });
  }


  async function deletePersonas(personaID){
    mainP = `
    <divMain>
    <button class="btn btn-info btn-sm" type="button" onclick = "FacebookTab('personas')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button>
          <h2>Delete Persona <b>${personaID}</b></h2>
        <hr>
        <div class="row">
          <div class="form-group col-md-12">
            <p>Are you sure that you want to delete persona <b>${personaID}</b>? You will no longer be able to use this Persona in replies!</p>
              <button type="button" class="btn btn-danger" style="margin-right:5px;" id = "deletePersona2" onclick="deletePersona2('${personaID}')">
                    Delete Persona
                  </button>
                  <button type="button" class="btn btn-secondary" onclick="FacebookTab('personas')">
                    Cancel
                  </button>
              </div>

        </div>
                 
    `
    $('divMain').replaceWith(mainP);      
  }

  async function addTrait(){
    document.getElementById(`addTrait`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Adding </span>`
    document.getElementById(`addTrait`).disabled = true 
      await fetch(`/add_trait?trait=${document.getElementById("trait_name").value}&key=${pageData.wit_key.S}&values=${document.getElementById("trait_values").value}`)
      .then(response => response.json())
      .then(data => {
        if (data.success){
          ai_tab('traits') 
        } else {
          document.getElementById(`addTrait`).innerHTML = ` 
          Add`
          document.getElementById(`addTrait`).disabled = false 
          document.getElementById("updateState6").innerHTML = "<b style='color:red'>This name either contain unsupported characters or it already exists. Please try a different name.</b>"
        }
      })
      .catch((error) => {
        addTrait()
    });
  }


  async function addUtterance(){
    check = true
    for ( i = 0 ; i < myUtterances.utterances.length ; i++){
        if (myUtterances.utterances[i].text === document.getElementById("utterance_name").value){
            check = false;
        }
    }
    if (pageData.utterances.M[`${document.getElementById("utterance_name").value}`]){
        if (pageData.utterances.M[`${document.getElementById("utterance_name").value}`].L[2].S === "creating"){
            check = false;
        }
    }
    if (check == false){
        document.getElementById("updateState7").innerHTML = "<b style='color:red'>This utterance already exists!</b>"
    }
    else {
        await clearInterval(refreshIntervalId);
        document.getElementById(`addUtterance`).innerHTML = ` 
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding`
        document.getElementById(`addUtterance`).disabled = true 
        var uttSend = {};
        uttSend.text = document.getElementById("utterance_name").value;
        uttSend.intent = document.getElementById("intents").value;
        uttSend.entities = []
        if (enTrain1){
            uttSend.entities[0] = enTrain1
            uttSend.entities[0].entity = document.getElementById("ent1").value
        }
        if (enTrain2){
            uttSend.entities[1] = enTrain2
            uttSend.entities[1].entity = document.getElementById("ent2").value
        }
        if (enTrain3){
            uttSend.entities[2] = enTrain3
            uttSend.entities[2].entity = document.getElementById("ent3").value
        }
        if (enTrain4){
            uttSend.entities[3] = enTrain4
            uttSend.entities[3].entity = document.getElementById("ent4").value
        }
        uttSend.key = pageData.wit_key.S
        uttSend.pageID = pageData.pageID.S
        uttSend.index = pageData.utterances_list.L.length
        uttSend.traits = [];
        if (document.getElementById("tr1")){
          if (document.getElementById("trV1").value !== "nothing"){
                uttSend.traits[0] = {trait:`${document.getElementById("tr1").value}`, value:`${document.getElementById("trV1").value}`}
          }
        }
        if (document.getElementById("tr2")){
            if (document.getElementById("trV2").value !== "nothing"){
                uttSend.traits[1] = {"trait":`${document.getElementById("tr2").value}`, "value":`${document.getElementById("trV2").value}`}
            }
        }
        await fetch(`/post_utterance`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(uttSend)
        })
        .then(response => response.json())
        .then(data => {
            if (data.state){
              ai_tab('utterances') 
            } else {
              $('#addUtterance').replaceWith('<button class="btn btn-primary btn-md" style="margin-top:15px;" id = "addUtterance" onclick = "addUtterance()" id="addUtterance">Add Utterance</button>');
              document.getElementById("updateState7").innerHTML = "<b style='color:red'>Some error happened. Please check the input and try again!</b>"
            }
        })
        .catch((error) => {
            addUtterance()
        });
    }
}



  async function builtTrait(name){

    document.getElementById(`add-${name.split("/")[1]}`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Adding`
    document.getElementById(`add-${name.split("/")[1]}`).disabled = true

    await fetch(`/add_trait?trait=wit$${name.split("/")[1]}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        if (data.success){
          document.getElementById(`add-${name.split("/")[1]}`).innerHTML = `Added`;
          document.getElementById(`confirm-${name.split("/")[1]}`).innerHTML = `Entity Added ✔️.`;
        } else {
          document.getElementById(`add-${name.split("/")[1]}`).innerHTML = `Add`
          document.getElementById(`add-${name.split("/")[1]}`).disabled = false
          document.getElementById(`confirm-${name.split("/")[1]}`).style = `color:red`
          document.getElementById(`confirm-${name.split("/")[1]}`).innerHTML = `Try Again!`
        }
      })
      .catch((error) => {
        builtTrait(name)
    });
  }


  async function addIntent(){
    document.getElementById(`addIntent`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Adding </span>`
    document.getElementById("addIntent").disabled = true;
      await fetch(`/add_intent?intent=${document.getElementById("intent_name").value}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        if (data.success){
          ai_tab('intent') 
        } else {
          document.getElementById(`addIntent`).innerHTML = ` 
          Add`
          document.getElementById("addIntent").disabled = false;
          document.getElementById("updateState4").innerHTML = "<b style='color:red'>This name either exists or have special characters!<br>Only use 2+ alphanumeric and underscore characters when naming your intent.<br>The intent name cannot start with a number.</b>"
        }
      })
      .catch((error) => {
        addIntent()
    });
  }


  async function addPersona(){
    document.getElementById(`addPersona`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Adding </span>`
    document.getElementById("addPersona").disabled = true;
    var tok = {name:`${document.getElementById("persona_name").value}`, link : `${document.getElementById("persona_link").value}`, token:`${pageData.page_access_token.S}`}
    await fetch(`/personas`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tok)
      })
          .then(response => response.json())
          .then(data => {
            if (data.state){
            FacebookTab('personas')
            } else {
              document.getElementById(`updateStatePersona`).innerHTML = `<b style = "color:red">Please check the image link and try again.</b>`
            document.getElementById(`addPersona`).innerHTML = ` 
            Add`
            document.getElementById("addPersona").disabled = false;
            }

          })
          .catch((error) => {
            addPersona()
        });

  }





  async function addItem(){
    document.getElementById(`addItem`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Adding </span>`
    document.getElementById("addItem").disabled = true;
    var tok = {current: psMenu_data ,type:`${document.getElementById("menu_item").value}`, title:`${document.getElementById("item_title").value}`, value:`${document.getElementById("item_value").value}`, token:`${pageData.page_access_token.S}`}
        await fetch(`/persistent_menu`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tok)
      })
          .then(response => response.json())
          .then(data => {
            if (data.state){
              psMenu_data = current
              FacebookTab('persistentMenu')
            } else {
              document.getElementById(`updateStateItem`).innerHTML = `<b style = "color:red">Please check the values and try again. If you don't have Get Started button active, you will need to create one to use the persistent menu.</b>`
            document.getElementById(`addItem`).innerHTML = ` 
Add`
          document.getElementById("addItem").disabled = false;
            }
          })
          .catch((error) => {
            addItem()
        });
  }













  async function addDomain(){
    document.getElementById(`addDomain`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Adding </span>`
    document.getElementById("addDomain").disabled = true;
    var tok = {current: `${whitelisted_data}`, url:`${document.getElementById("domain_url").value}`, token:`${pageData.page_access_token.S}`}
    await fetch(`/whitelisted`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tok)
      })
          .then(response => response.json())
          .then(data => {
            if (data.state){
              whitelisted_data = data.state;
              FacebookTab('whitelist')
            } else {
              document.getElementById(`updateStateDomain`).innerHTML = `<b style = "color:red">Please check the link and try again.</b>`
              document.getElementById(`addDomain`).innerHTML = ` Add`
              document.getElementById("addDomain").disabled = false;
            }

          })
          .catch((error) => {
            addDomain()
        });

  }


  async function entity_data(name){
      await fetch(`/entity?name=${name}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        if (data.entity){
          ai_tab('entities') 

        } else {
          ai_tab('entities') 
        }
      })
      .catch((error) => {
        entity_data(name)
    });
  }


  async function trait_data(name){
    var data2;
      await fetch(`/trait?name=${name}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        if (data.trait){
          data2 = data
        } else {
          ai_tab('traits') 
        }
      })
      .catch((error) => {
        trait_data(name)
    });
    return data2
  }



  // function back_feed(){
  //   mainP = `<divMain>
  //                     <h2>Page Content Feed</h2>
  //                   <div class="row">
  //                     <div class="form-group col-md-12">
  //                       <p>These are the recent post for this page.</p>
  //                       <hr>
  //                       </div>
  //                       </div>
  //                       <div class="row row-cols-1 row-cols-sm-2">
  //                 `


  //     for (i = 0 ; i < pageFeed.length ; i ++){

  //       var comment_ = 0;
  //       if (pageFeed[i].comments){
  //         comment_ = pageFeed[i].comments.data.length;
  //       }
  //       if (pageFeed[i].message){
  //         mainP += `        
  //         <div class="col-sm" style="margin-bottom: 15px;">
  //         <div class="card">
  //         <div class="card-body">
  //           <div class="row justify-content-center">
  //           <h5 class="card-title">${pageFeed[i].message}</h5>
  //           </div>
  //           <hr>
  //           <p class="card-text">From: ${pageFeed[i].from.name}</p>
  //           <p class="card-text">User ID: ${pageFeed[i].from.id}</p>
  //           <p class="card-text">Can Reply: ${pageFeed[i].can_reply_privately}</p>
  //           <p class="card-text">Feed ID: ${pageFeed[i].id}</p>
  //           <p class="card-text" onclick="comments('${i}')">Comments Count: <b><u>${comment_}</u></b></p>
  //           </div>
  //           </div>
  //           </div>
  //         `
  //       }
                
  //   }
  //             mainP +=`
  //               </div></div>
  //               </divMain>
  //             `
  //             $('divMain').replaceWith(mainP);
  //             document.body.scrollTop = 0;
  //             document.documentElement.scrollTop = 0;

  // }

  // function comments(index){
  //   mainP = `<divMain>
  //               <button class="btn btn-info btn-sm" type="button" onclick = "back_feed()" style ="margin-bottom:15px;">
  //                       <span class="badge"><=</span>Back </button>
  //                     <h2>Page Content Feed</h2>
  //                   <div class="row">
  //                     <div class="form-group col-md-12">
  //                       <p>These are the comments for <b>${pageFeed[index].id}</b> post.</p>
  //                       <hr>
  //                       </div>
  //                       </div>
  //                       <div class="row row-cols-1 row-cols-sm-2">
  //                 `
  //     for (i = 0 ; i < pageFeed[index].comments.data.length ; i ++){

  //       if (pageFeed[index].comments.data[i].message){
  //         mainP += `        
  //         <div class="col-sm" style="margin-bottom: 15px;">
  //         <div class="card">
  //         <div class="card-body">
  //           <div class="row justify-content-center">
  //           <h5 class="card-title">${pageFeed[index].comments.data[i].message}</h5>
  //           </div>
  //           <hr>
  //           <p class="card-text">From: ${pageFeed[index].comments.data[i].from.name}</p>
  //           <p class="card-text">User ID: ${pageFeed[index].comments.data[i].from.id}</p>
  //           <p class="card-text">Can Reply: ${pageFeed[index].comments.data[i].can_reply_privately}</p>
  //           <p class="card-text">Feed ID: ${pageFeed[index].comments.data[i].id}</p>
  //           </div>
  //           </div>
  //           </div>
  //         `
  //       }     
  //   }
  //             mainP +=`

  //               </div></div>
  //               </divMain>
  //             `

  //             $('divMain').replaceWith(mainP);
  //             document.body.scrollTop = 0;
  // document.documentElement.scrollTop = 0;
  // }






















        function fun(){
        }
        function fun1(){
        }  
        
        async function testUtt(){
          document.getElementById("fTrait").checked == false
          document.getElementById("sTrait").checked == false
          $("#fTrait").replaceWith(`<input type="checkbox" class="custom-control-input" onchange="trainWTrait('1')" id="sTrait">`)
          $("#sTrait").replaceWith(`<input type="checkbox" class="custom-control-input" onchange="trainWTrait('2')" id="fTrait">`)
          trainWTrait('1')
          trainWTrait('2')
          document.getElementById(`testUtt`).innerHTML = ` 
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Testing </span>`
          document.getElementById(`testUtt`).disabled = true 
              value = document.getElementById("utterance_name").value
              await fetch(`/resolve?text=${value}&key=${pageData.wit_key.S}`)
                .then(response => response.json())
                .then(async data => {
                  document.getElementById(`testUtt`).innerHTML = `Test Again`
                  document.getElementById(`testUtt`).disabled = false 
                  if (data.nlp){
                    enTrain1 = null;
                    enTrain2 = null;
                    enTrain3 = null;
                    enTrain4 = null;
                    if (data.nlp.intents[0]){
                      document.getElementById("intents").value = data.nlp.intents[0].name
                    }
                  var current = "";
                    for (x in data.nlp.entities) {
                  if (enTrain1 == null) {
                    start = data.nlp.entities[`${x}`][0]['start']
                    end = data.nlp.entities[`${x}`][0]['end']
                    enTrain1 = {start:start, end : end, body:data.nlp.entities[`${x}`][0]['body'].toString()}
                    $('#en1').show("fast");
                    document.getElementById("entity1").innerHTML = data.nlp.entities[`${x}`][0]['body'].toString()
                    document.getElementById("ent1").value = x.split(":")[0]
                  } else if (enTrain2 == null ){
                    start = data.nlp.entities[`${x}`][0]['start']
                    end = data.nlp.entities[`${x}`][0]['end']
                    enTrain2 = {start:start, end : end, body:data.nlp.entities[`${x}`][0]['body'].toString()}
                    $('#en2').show("fast");
                    document.getElementById("entity2").innerHTML = data.nlp.entities[`${x}`][0]['body'].toString()
                    document.getElementById("ent2").value = x.split(":")[0]
                  } else if (enTrain3 == null){
                    start = data.nlp.entities[`${x}`][0]['start']
                    end = data.nlp.entities[`${x}`][0]['end']
                    enTrain3 = {start:start, end : end, body:data.nlp.entities[`${x}`][0]['body'].toString()}
                    $('#en3').show("fast");
                    document.getElementById("entity3").innerHTML = data.nlp.entities[`${x}`][0]['body'].toString()
                    document.getElementById("ent3").value = x.split(":")[0]
                  } else if (enTrain4 == null ){
                    start = data.nlp.entities[`${x}`][0]['start']
                    end = data.nlp.entities[`${x}`][0]['end']
                    enTrain4 = {start:start, end : end, body:data.nlp.entities[`${x}`][0]['body'].toString()}
                    $('#en4').show("fast");
                    document.getElementById("entity4").innerHTML = data.nlp.entities[`${x}`][0]['body'].toString()
                    document.getElementById("ent4").value = x.split(":")[0]
                  }
                }
                  for (x in data.nlp.traits) {
                    if (document.getElementById("fTrait").checked == false){
                     $("#fTrait").replaceWith(`<input type="checkbox" checked class="custom-control-input" onchange="trainWTrait('1')" id="fTrait">`)
                      await trainWTrait('1')
                      document.getElementById("tr1").value = x
                      await trainWTrait('c1')
                      document.getElementById("trV1").value = data.nlp.traits[`${x}`][0]['value']
                    } else if (document.getElementById("sTrait").checked == false){
                      $("#sTrait").replaceWith(`<input type="checkbox" checked class="custom-control-input" onchange="trainWTrait('2')" id="sTrait">`)
                     await trainWTrait('2')
                      document.getElementById("tr2").value = x
                      await trainWTrait('c2')
                      document.getElementById("trV2").value = data.nlp.traits[`${x}`][0]['value']
                    }
                  }
                } else {
                  utt = document.getElementById("utterance_name").value;
                  await ai_tab('add_utterance');
                  document.getElementById("utterance_name").value = utt;
                  document.getElementById("testUtt").innerHTML = "Try Again"
                }
                })
                .catch((error) => {
                  testUtt()    
               });



        }
        function closeMe(wh){
          current = ""
          if (window.getSelection) {window.getSelection().removeAllRanges();}
          if (wh === "1"){
            $('#en1').hide("fast");
            enTrain1 = null;
            document.getElementById("warning_four").innerHTML = ""
          } else if (wh === "2"){
            $('#en2').hide("fast");
            enTrain2 = null;
            document.getElementById("warning_four").innerHTML = ""
          } else if (wh === "3"){
            $('#en3').hide("fast");
            enTrain3 = null;
            document.getElementById("warning_four").innerHTML = ""
          } else if (wh === "4"){
            $('#en4').hide("fast");
            enTrain4 = null;
            document.getElementById("warning_four").innerHTML = ""
          }
        }

        function getSelectedText() { 
                    var selectedText = ''; 
                    if (window.getSelection) { 
                        selectedText = window.getSelection(); 
                    } 
                    else if (document.getSelection) { 
                        selectedText = document.getSelection(); 
                    } 
                    else if (document.selection) { 
                        selectedText =  
                        document.selection.createRange().text; 
                    } else return; 
                    // To write the selected text into the textarea 
                    return selectedText;
                } 


                async function trainWTrait(nu) { 
                  if (nu === "1"){
                    if (document.getElementById("fTrait").checked == true){
                      $('#mTrait2').show('slow');
                      mainT1 =`
                      <divT1>
                  <div class="alert alert-info" role="alert" id = "t1" style="display:full">
                  <p style = "color:sky-blue; font-size: 120%;"><b>Trait</b></p>
                <select id = "tr1" onchange = "trainWTrait('c1');"class="form-control form-control-sm">`
              if (myTraits.traits.length === 0){
                mainT1 += `<option checked value= "nothing" > --- Please add traits first! --- </option>`
              } else {
                for (i = 0 ; i < myTraits.traits.length ; i ++) {
                  mainT1 += `
                  <option value="${myTraits.traits[i].name}">${myTraits.traits[i].name}</option>`
                }
                n = await trait_data(`${myTraits.traits[0].name}`)
                if ( n.trait.values.length > 0){
                  mainT1 += `
                  </select>
                  <p style = "color:sky-blue; font-size: 120%;"><b>Value</b></p>
                  <divTV1>
                  <select id = "trV1" class="form-control form-control-sm">`
                  for ( l = 0 ; l < n.trait.values.length ; l++){
                    mainT1 += `<option value="${n.trait.values[l].value}">${n.trait.values[l].value}</option>`
                  }
                } else {
                  mainT1 += `
                  </select>
                  <p style = "color:sky-blue; font-size: 120%;"><b>Value</b></p>
                  <divTV1>
                  <select id = "trV1" class="form-control form-control-sm">
                  <option checked value= "nothing" > Please add values! </option>`
                }
              }
              mainT1 +=`</select></divTV1></div></divT1>`
                      $('divT1').replaceWith(mainT1);
                    } else {
                      if (document.getElementById("sTrait").checked == true){
                        $('#sTrait').replaceWith(`<input type="checkbox" class="custom-control-input" onchange="trainWTrait('2');" id="sTrait">`);
                        $('divT2').replaceWith("<divT2></divT2>");
                      }
                      $('#mTrait2').hide('slow');
                      $('divT1').replaceWith("<divT1></divT1>");
                    }
                  } else if (nu === "2"){
                    if (document.getElementById("sTrait").checked == true){
                      mainT2 =`
                      <divT2>
                  <div class="alert alert-info" role="alert" id = "t2" style="display:full">
                  <p style = "color:sky-blue; font-size: 120%;"><b>Trait</b></p>
                <select id = "tr2" onchange = "trainWTrait('c2');"class="form-control form-control-sm">`
              if (myTraits.traits.length === 0){
                mainT2 += `<option checked value= "nothing" > --- Please add traits first! --- </option>`
              } else {
                for (i = 0 ; i < myTraits.traits.length ; i ++) {
                  mainT2 += `
                  <option value="${myTraits.traits[i].name}">${myTraits.traits[i].name}</option>`
                }
                n = await trait_data(`${myTraits.traits[0].name}`)
                if ( n.trait.values.length > 0){
                  mainT2 += `
                  </select>
                  <p style = "color:sky-blue; font-size: 120%;"><b>Value</b></p>
                  <divTV2>
                  <select id = "trV2" class="form-control form-control-sm">`
                    for ( l = 0 ; l < n.trait.values.length ; l++){
                    mainT2 += `<option value="${n.trait.values[l].value}">${n.trait.values[l].value}</option>`
                  }
                } else {
                  mainT2 += `
                  </select>
                  <p style = "color:sky-blue; font-size: 120%;"><b>Value</b></p>
                  <divTV2>
                  <select id = "trV2" class="form-control form-control-sm">
                  <option checked value= "nothing" > Please add values! </option>`
                }
              }
              mainT2 +=`</select></divTV2></div></divT2>`
                      $('divT2').replaceWith(mainT2);
                    
                    } else {
                      $('divT2').replaceWith("<divT2></divT2>");
                    }
                  } else{
                    if (nu === "c1"){
                      n = await trait_data(`${document.getElementById("tr1").value}`)
                if ( n.trait.values.length > 0){
                  opt1 = ` <divTV1>
                  <select id = "trV1" class="form-control form-control-sm">`
                    for ( l = 0 ; l < n.trait.values.length ; l++){
                      opt1 += `<option value="${n.trait.values[l].value}">${n.trait.values[l].value}</option>`
                    }
                    opt1 += `</select></divTV1>`
                } else {
                  opt1 = `<divTV1>
                  <select id = "trV1" class="form-control form-control-sm">
                  <option checked value= "nothing" > Please add values! </option>
                </select></divTV1>`
                }
                $('divTV1').replaceWith(opt1);
                    }  else {
                      n = await trait_data(`${document.getElementById("tr2").value}`)
                if ( n.trait.values.length > 0){
                  opt2 = ` <divTV2>
                  <select id = "trV2" class="form-control form-control-sm">`
                    for ( l = 0 ; l < n.trait.values.length ; l++){
                      opt2 += `<option value="${n.trait.values[l].value}">${n.trait.values[l].value}</option>`
                  }
                  opt2 += `</select></divTV2>`
                } else {
                  opt2 = `<divTV2>
                  <select id = "trV1" class="form-control form-control-sm">
                  <option checked value= "nothing" > Please add values! </option>
                </select></divTV2>`
                }
                $('divTV2').replaceWith(opt2);

                    }

              
                  }
                } 
