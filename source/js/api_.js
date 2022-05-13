var pageData, myEntities, myIntents, myTraits, myUtterances, utterance_data, files, refreshIntervalId, psMenu_data, get_started_data, current, pageFeed,
enTrain1 = null, enTrain2 = null, enTrain3 = null, enTrain4 = null, whitelisted_data = null, greeting_data = null;
$(document).ready(function(){
  fetch(`/page_data?page_id=${document.getElementById("page_h_id").value}`)
  .then(response => response.json())
  .then(data => {
    pageData = data.page_data.Item;
    document.getElementById("page_name").innerHTML = pageData.page_name.S;
    document.getElementById("total_count").innerHTML = (parseInt(pageData.comments_count.N) + pageData.sent_list.L.length + pageData.received_list.L.length) -2;
    document.getElementById("comments").innerHTML = pageData.comments_count.N;
    document.getElementById("received_count").innerHTML = pageData.received_list.L.length -1;
    document.getElementById("sent_count").innerHTML = pageData.sent_list.L.length -1;
    mainP = `<divMain><h2>API App settings</h2><hr><div class="row">`;
    if (pageData.post_link.S === "" || !pageData.post_link.S.includes("http")){
      mainP += `<div class="form-group col-md-12"><div class="alert alert-danger" role="alert"><h4 class="alert-heading">Callback url is missing!</h4><p>You didn't add a valid URL. Please go to (Webhook => Post URL & Secret) to add one. We use this URL to send the Page Messaging Events to your webhook. The Secret is used to reply back to these events.</p></div></div></div>`
    } else {
      if (pageData.post_secret.S === ""){
        mainP += `<div class="form-group col-md-12"><div class="alert alert-warning" role="alert"><h4 class="alert-heading">Secret is missing!</h4><p>We have the callback url, but we dont have the secret for the reply API. You need ths secret to send replies to users. Please go to (Webhook => Post URL & Secret) to create one.</p></div></div></div>`
      } else {
        mainP += `<div class="form-group col-md-12"><div class="alert alert-success" role="alert"><h4 class="alert-heading">URL & Secret Received!</h4><p>We have the callback url, and the secret for the reply API. Now, you should be able to receive events and reply back to users using the reply API.</p></div></div></div>`
      }
    }
    mainP +=`<h3>How it works?</h3><hr><h4>POST URL and Secret:</h4><p>To start using the API version of Botai, you need to have a webhook with endpoint that accepts <b>POST</b> requests. When your Facebook page <b>${pageData.page_name.S}</b> receive Messaging events or new comments on posts, Botai will send the details of these events to this endpoint. You can reply back with responses or ignore the event. If you reply back, you may add <b>Persona ID</b> and <b>Secondary Responses</b>. Botai use the secondary responses to replace any of the main responses if it failed for any reason. You can find a sample endpoint code in the Documentation tab. To add the url and secret go to POST URL and Secret in the "webhook" tab.</p><hr><h4>Facebook Page:</h4><p>You can adjust most of the Messenger profile for <b>${pageData.page_name.S}</b> here in Botai dashboard. In the "Facebook Page" tab, you can adjust Greeting Message, Get Started Button,  Persistent Menu, whitelisted domains, and Personas. Also, you can create and upload the picture of new personas to use with your responses.</p><hr><h4>Natural Language</h4><p>Botai integrates Wit.ai into this experience. You can create or use built-in intents, entities and traits from the "Natural Language" tab. Then, you can add utterances and train the App to identify the user input with some examples. Also, you can upload old App using the upload tool, or change to use an App from your account. When your page received comments or text, Botai will include the NLP results in the POST request.</p><hr></divMain>`
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
  window.open(`/api_docs#code`, '_blank');
}