  // Global variables
  var pageData, myIntents, myTraits, myUtterances, utterance_data, files, refreshIntervalId, current, pageFeed, psMenu_data, get_started_data,
  enTrain1 = null, enTrain2 = null, enTrain3 = null, enTrain4 = null, whitelisted_data = null, greeting_data = null;
  // Start function on document load
  $(document).ready(function(){         
    fetch(`/page_data?page_id=${document.getElementById("page_h_id").value}`)
    .then(response => response.json())
    .then(data => {
      pageData = data.page_data.Item;
      document.getElementById("page_name").innerHTML = pageData.page_name.S;
      document.getElementById("received_count").innerHTML = pageData.received_list.L.length -1;
      document.getElementById("comments").innerHTML = pageData.comments_count.N;
      document.getElementById("sent_count").innerHTML = pageData.sent_list.L.length -1;
      mainP = `<divMain><h2>Hosted App settings</h2><hr><div class="row">`;
      
      mainP += `<div class="form-group col-md-12"><div class="alert alert-success" role="alert"><h4 class="alert-heading"><b>${pageData.page_name.S}</b> is running!</h4><p>If you don't receive messages in Botai, please make sure <b>${pageData.page_name.S}</b> doesn't have a primary Messenger receiver in the page settings. The "How it works?" section below is a quick walk-through to start with Botai.</p></div></div></div>`
      mainP +=`<h3>How it works?</h3><hr><h4>Messaging:</h4><p>In the "Messaging", you can find the respoonses, logs, and comments. In the "Responses" tab, you can find more information about the current responses and create new responses. When you create new response you can choose if you want to use it with intents or postback payloads. We ask for backup text message to replace failing attachments and templates messages. For every message Botai receive or send, you can find the information and the status in the (Sent Messages / Received Messages) tabs. When your page receive a comment on new or old posts, you will find the information in the "Page Comments" tab. For each comment, you can send one message as a private reply in Messenger. You may choose to manually reply or ignore each comment or choose to auto reply to all comments. If you choose to auto reply to all comments, you can use a default response or use the Wit app to understand the comment and reply with the response for this intent.</p><hr><h4>Facebook Page:</h4><p>You can adjust most of the Messenger profile for <b>${pageData.page_name.S}</b> here in Botai dashboard. In the "Facebook Page" tab, you can adjust Greeting Message, Get Started Button, Persistent Menu, whitelisted domains, and Personas. Also, you can create and upload the picture of new personas to use with your responses.</p><hr><h4>Natural Language</h4><p>Botai integrates Wit.ai into this experience. You can create or use built-in intents, entities and traits from the "Natural Language" tab. Then, you can add utterances and train the App to identify the user input with some examples. Also, you can upload old App using the upload tool, or change to use an App from your account. When your page received comments or text, Botai will use the Wit app to understand the user messages and comments then reply if applicable.</p><hr></divMain>`
        
      $('#load22').hide();
      $('divMain').replaceWith(mainP);
      $('divPic').replaceWith(`<divPic><img class="img-responsive img-rounded" src="/image?id=${document.getElementById("page_h_id").value}" alt="Page picture"></divPic>`);
      $('.sidebar-wrapper').show();
      $(".page-wrapper").addClass("toggled");
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    })
    .catch((error) => {
      window.location.reload(); 
    });
  });
  function docSample(){
    window.open(`/host_docs`, '_blank');
  }