async function dataFetch(){
  $('#dash').show(); 
  document.getElementById("dash").innerHTML = "Dashboard";
  $('#loader').show(); 
  $('divDelete').replaceWith(`<divDelete></divDelete>`);
  $('divMain2').replaceWith(`<divMain2></divMain2>`);
  await fetch('/dashboard_data')
  .then(response => response.json())
  .then(data => {
    if(data.pages === "full"){
      mainP = `<divMain><div class="container-fluid" style = "width:95%">`;
      for (i = 1 ; i < data.pages_id.length ; i++) {
        if (data.pages_state[i].S !== "deleted") {
          mainP += `<div class="alert alert-info" role="alert"><div class="table-responsive" id="tbl"><table class="table table-hover"><thead><h5>Page Name: <b>${data.pages_name[i].S}</b></h5></thead><tbody>`;      
          if (data.pages_state[i].S === "inactive") {
            mainP += `<tr><th scope="row">App Type</th><td style='font-weight:600'>${data.app_type[i].S}</td></tr><tr><th scope="row">App Status</th><td style='color:red; font-weight:600'>Page is not connected.</td></tr><tr><th scope="row">App Language</th><td style='font-weight:600'>${data.pages_language[i].S}</td></tr><tr><a class='btn btn-sm btn-success' style="margin-top:8px; margin-bottom:8px;" onclick="connect('${data.pages_name[i].S}_${data.pages_id[i].S}')">Connect</a></tr></tbody></table></div></div>`
          } else {
            if (data.app_type[i].S === "api"){
              appType = "API App"
            } else if (data.app_type[i].S === "hosted"){
              appType = "Hosted App"
            }
            mainP += `<tr><th scope="row">App Type</th><td style='font-weight:600'>${appType}</td></tr><tr><th scope="row">App Status</th><td style='color:green; font-weight:600'>Page is connected.<br>Wit App is running.</td><tr><th scope="row">Page Status</th>`
            isImapct = data.pages_state[i].S.split("_")[1];
            if (isImapct === "false"){
              mainP += `<td style='color:green; font-weight:600'>Not subject to the new EU changes!</td>`
            } else {
              mainP += `<td style='color:red; font-weight:600'>Subject to the new EU changes.</td>`
            }
            mainP += `<tr><th scope="row">App Language</th><td style='font-weight:600'>${data.pages_language[i].S}</td></tr><tr><a class='btn btn-sm btn-primary' style="margin-top:5px; margin-right:5px; margin-bottom:8px;" href="https://m.me/${data.pages_id[i].S}"target='_blank'>Messenger</a><a class='btn btn-sm btn-primary' style="margin-top:5px; margin-bottom:8px; color:white;" href="/page_setting?type=${data.app_type[i].S}&id=${data.pages_id[i].S}&name=${data.pages_name[i].S}">Settings</a></td></th></tr></tbody></table></div></div>`
          }
        }
      }  
      mainP += `</div></divMain>`;
      $('divMain').replaceWith(mainP);  
    } else {
      //$('#addDiv2').show(); 
    }
    document.getElementById("welcome_msg").innerHTML = `Welcome <b>${data.user_name}</b> ${data.msg}`;
    $('#addDiv').show();     
    $('#removeDiv').show(); 
    $('#loader').hide(); 
  })
  .catch((error) => {
    window.location.reload(); 
  });
}

function fb_login(){
  FB.login(function(response) {    
    if (response.authResponse) {
      document.getElementById("welcome_msg").innerHTML = ``;
      $('divMain').replaceWith("<divMain></divMain>");
      $('#addDiv').hide();
      $('#addDiv2').hide();  
      $('#removeDiv').hide();
      $('#loader').show();
      fetch(`/updated_data?token=${response.authResponse.accessToken}`)
      .then(response => response.json())
      .then(data => {
        dataFetch();
      })
      .catch((error) => {
        fb_login()
      });  
    }  
  }, {
        scope: 'pages_show_list,pages_messaging,pages_read_engagement,pages_manage_metadata'
  });
}

function fb_login2(){
  FB.login(function(response) {    
    if (response.authResponse) {
      document.getElementById("welcome_msg").innerHTML = ``;
      $('divMain').replaceWith("<divMain></divMain>");
      $('#addDiv').hide();
      $('#addDiv2').hide();  
      $('#removeDiv').hide();
      $('#loader').show();
      fetch(`/updated_data?token=${response.authResponse.accessToken}`)
      .then(response => response.json())
      .then(data => {
        dataFetch();
      })
      .catch((error) => {
        fb_login2();
      });  
    }  
  }, {
        scope: 'business_management,pages_show_list,pages_messaging,pages_read_engagement,pages_manage_metadata,pages_read_user_content'
  });
}

function connect(name){
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.getElementById("welcome_msg").innerHTML = ``;
  $('#addDiv').hide(); 
  $('#addDiv2').hide(); 
  $('#dash').hide(); 
  $('#removeDiv').hide();
  $('divMain').replaceWith(`<divMain></divMain>`);
  $('divMain2').replaceWith(`<divMain2>
    <div class ="formStyle" style="margin-top:-50px;">
    <div class="container-fluid px-1 py-5 mx-auto">
        <div class="row d-flex justify-content-center">
            <div class="col-xl-9 col-lg-10 col-md-11">
                <div class="card rounded-0 b-0">
                    <div class="card-header">
                        <div class="row d-flex justify-content-between">
                            <div class="">
                                <h5 class="yellow-text" id = "wMsg">Let's set up your powerful Chatbot for</h5>
                                <h6>Select a Bot type, language, and let's go.</h6>
                            </div>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-sm-end justify-content-start px-5">
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-sm-end justify-content-start px-5">
                        <div class="count text-center">
                            <p class="mb-sm-0 pb-sm-0"><strong><span id="cnt">50</span>%</strong> <span class="yellow-text">Completed</span></p>
                        </div>
                    </div>
                    <div class="card-body2 show pt-0"  id = "startP" style="display:none;">
                        <h4 class="heading mb-4 pb-1 -22">What Bot type do you need for this page?</h4>
                        <div class="radio-group row justify-content-center">
                            <div class="card-block radio selected" data-value="hosted" style = "margin-right:15px; margin-left:15px;">
                                <div class="row justify-content-center">
                                    <div class="fa fa-check"></div>
                                </div>
                                <div class="row justify-content-center d-flex">
                                    <div class="pic"> <img src="/host.png" class="pic-0"> </div>
                                    <h5 class="mb-4">Hosted chatbot</h5>
                                </div>
                            </div>
                            <div class="card-block radio" data-value="api" style = "margin-right:15px; margin-left:15px;">
                                <div class="row justify-content-center">
                                    <div class="fa fa-circle"></div>
                                </div>
                                <div class="row justify-content-center d-flex">
                                    <div class="pic"> <img src="/api.png" class="pic-0"> </div>
                                    <h5 class="mb-4">API chatbot</h5>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <b><p id = "description">Here, you will save the responses in our database, and we will auto reply to the events.</p></b>
                        </div>
                        <input type="text" id="bot_opt" name="bot_opt" required="required" value="hosted" style="display:none">
                        <h4 class="heading mb-4 pb-1">What is the primary language for this App?</h4>
                        <div style = "width: 250px;">  
                            <select name="type-info" id ="lang_opt" class="form-control">
                                <option>English</option>
                                <option disabled>Frensh</option>
                                <option disabled>Spanish</option>
                                <option disabled>Russian</option>
                                <option disabled>Arabic</option>
                                <option disabled>Chineese</option>
                                <option disabled>Japaneese</option>
                            </select>   
                        </div>
                        <div class="row justify-content-center"> <button class="btn btn-primary next mx-2" id="next1">Let's Go</button> </div>
                    </div>
                    <div class="card-body2 pt-0">
                        <h4 class="heading mb-4 pb-1" id = "pro_stat">In progress.</h4>
                        <div class="row justify-content-start px-3" id = "pro_remove">
                            <p>Please wait, we are connecting your page ...</p>
                            <br>
                            <br>
                    </div>
                    <br>
                    <div class="row justify-content-center" style="margin-bottom:50px;"><divLoading></divLoading></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
  </divMain2>`);
  $('#wMsg').append(` <b>${name.split("_")[0]}!<b>`);  
  $('#startP').show();
  document.getElementById("bot_opt").value = "hosted"            
  var current_fs, next_fs;
  var steps = $(".card-body2").length;
  var current = 1;
  setProgressBar(current);
  $(".next").click(function(){
  str1 = "next1";
  if(!str1.localeCompare($(this).attr('id'))) {
  val1 = true;
  var loadStyle = `<divLoading><div class="spinner-grow text-primary" style="width: 4rem; height: 4rem;" role="status"></div></divLoading>`
  $('divLoading').replaceWith(loadStyle);
  finalFetch(name);
  async function finalFetch(name){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
      var data = {lang:`${document.getElementById("lang_opt").value}`,
          bot_type:`${document.getElementById("bot_opt").value}`
      };
      await fetch(`/last?page_id=${name.split("_")[1]}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
          $('#pro_stat').replaceWith(`<h4 class="heading mb-4 pb-1" id = "pro_stat">Process completed successfully!</h4>`);  
          $('#pro_remove').hide();  
          fMsg=`<center><h6>Your page is now connected. ✅<br><br><b>Test the App using the following link: <a href="https://m.me/${name.split("_")[1]}" target="_blank">https://m.me/${name.split("_")[1]}</a></b><br><br><b>For more controls, go to the <a onclick="dataFetch();" style="cursor: pointer;"><u>Dashboard</u></a> and click on the page <a href="/page_setting?type=${document.getElementById("bot_opt").value}&id=${name.split("_")[1]}&name=${name.split("_")[0]}">settings</a></b></h6></center>`
          $('divLoading').replaceWith(fMsg);
      })
      .catch((error) => {
        finalFetch(name)
      });
    }
  }
  else {
  val1 = false;
  }

  if(!str1.localeCompare($(this).attr('id'))) {
  current_fs = $(this).parent().parent();
  next_fs = $(this).parent().parent().next();
  $(current_fs).removeClass("show");
  $(next_fs).addClass("show");
  current_fs.animate({}, {
  step: function() {
  current_fs.css({
  'display': 'none',
  'position': 'relative'
  });
  next_fs.css({
  'display': 'block'
  });
  }
  });
  setProgressBar(++current);
  var c = document.getElementById('cnt').textContent;
  document.getElementById('cnt').textContent = Number(c) + 50;
  }
  });

  function setProgressBar(curStep){
  var percent = parseFloat(100 / steps) * curStep;
  percent = percent.toFixed();
  $(".progress-bar").css("width",percent+"%");
  }
  $('.radio-group .radio').click(function(){
  $('.selected .fa').removeClass('fa-check');
  $('.selected .fa').addClass('fa-circle');
  $('.radio').removeClass('selected');
  $(this).addClass('selected');
  $('.selected .fa').removeClass('fa-circle');
  $('.selected .fa').addClass('fa-check');
  var val = $(this).attr('data-value');
  $(this).parent().find('input').val(val);
  document.getElementById("bot_opt").value = val;
  if (val === "hosted"){
      document.getElementById("description").innerHTML =  "Here, you will save the responses in our database, and we will auto reply to the events.";
  } else if (val === "api"){
      document.getElementById("description").innerHTML =  "Here, we will send the events to your webhook, and your webhook will send us the reply.";
  }
  });
}

function deleteAccount(){
  document.getElementById("welcome_msg").innerHTML = ``;
  $('#addDiv').hide(); 
  $('#addDiv2').hide(); 
  document.getElementById("dash").innerHTML = "Delete Account"
  $('#removeDiv').hide();
  $('divMain').replaceWith(`<divMain></divMain>`);
  $('divDelete').replaceWith(`<divDelete><div class="container-fluid" style = "width:98%;"><br><div class="form-group col-md-12" style = "width:95%" id ="warn"><div class="alert alert-danger" role="warning"><h4 id ="deleteMsg" class="alert-heading">Are you sure you want to delete all your data and unsubscribe your pages?</h4></div></div><br><br><div class="row justify-content-center" id="controls"><a class="btn btn-md btn-danger" style = "margin-right: 20px;" onclick="confirmDelete()">Delete</a><a class="btn btn-md btn-secondary" onclick="dataFetch()">Cancel</a></div></div></divDelete>`);
}

async function confirmDelete(){
  $('#loader').show();
  $('#warn').hide();  
  $('#controls').hide();
  await fetch('/delete_data')
  .then(response => response.json())
  .then(data => {
    $('#loader').hide();
    document.getElementById("deleteMsg").innerHTML = "Account deleted!"
    $('#warn').show();  
    $('#sesType').addClass("nav-link disabled")
    $('#sesType2').addClass("nav-link disabled")
  })
  .catch((error) => {
    fetch('/delete_data')
    .then(response => response.json())
    .then(data => {
      $('#loader').hide();
      document.getElementById("deleteMsg").innerHTML = "Account deleted!"
      $('#warn').show();  
      $('#sesType').addClass("nav-link disabled")
      $('#sesType2').addClass("nav-link disabled")
    })
    .catch((error) => {
      confirmDelete();
    });
  });
  FB.getLoginStatus(function(response) {
    if (response && response.status === 'connected') {
      FB.Event.unsubscribe(response, function (res){
      })  
    }
  });
}