// Function for the private replies feed
function privateReplies(){
    $(".page-wrapper").removeClass("toggled");
    $(".sidebar-dropdown").removeClass("active");
    $(".sidebar-submenu").slideUp(200);
    $(".sidebar-dropdown").parent().removeClass("active");
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.title = "Botai | Page Comments Feed"
    mainP = `<divMain><h2>Page Comments Feed</h2><hr><div class="form-group col-md-12"><p>These are the comments on the current and new posts since you linked <b>${pageData.page_name.S}</b> to Botai. When your page received a new comment, we will send your webhook the comment details with the NLP analysis in a POST request. You can reply back to this request with <b>ONE MESSAGE</b>, and we will send this message to the user who added this comment. If a user deleted a comment, it won't be available for private reply and will be deleted from our database immediately.</p></div><hr><h2>Comments</h2><input class="form-control" id="myInput" type="text" placeholder="Search.."><div class="d-flex justify-content-center"><a class="btn btn-sm btn-info" onclick='refreshData2("feed")'>Refresh</a></div><hr><div id ="cards" class="row row-cols-1 row-cols-sm-2">`
    comments = pageData.comments.M
    for(o = 1 ; o < pageData.comments_list.L.length ; o++){
        if(comments[`${pageData.comments_list.L[o].S}`]){
            mainP += `<dr><div class="col-sm" style="margin-bottom: 15px;"><div class="card"><div class="card-body"><div class="row justify-content-center"><h5 class="card-title">${comments[`${pageData.comments_list.L[o].S}`].L[0].S}</h5></div><hr><p class="card-text">From: ${comments[`${pageData.comments_list.L[o].S}`].L[2].S}</p><p class="card-text">User ID: ${comments[`${pageData.comments_list.L[o].S}`].L[1].S}</p><p class="card-text">Comment ID: ${comments[`${pageData.comments_list.L[o].S}`].L[3].S}</p><p class="card-text">Post Link: <a href = "${comments[`${pageData.comments_list.L[o].S}`].L[4].S}">${comments[`${pageData.comments_list.L[o].S}`].L[4].S}</a></p><hr>`
            if (comments[`${pageData.comments_list.L[o].S}`].L[1].S !== pageData.pageID.S){
                if (comments[`${pageData.comments_list.L[o].S}`].L[5].S === "none"){
                    mainP += `<div class="row justify-content-center"><h5 class="card-title" style= "color:red; margin-top:10px;">Failed to reply!</h5></div></div></div></div></dr>`
                } 
                else if (comments[`${pageData.comments_list.L[o].S}`].L[5].S === "replied"){
                    mainP += `<div class="row justify-content-center"><h5 class="card-title" style= "color:green; margin-top:10px;">Replied successfully! ✔️</h5></div></div></div></div></dr>`
                }
            } else {
              mainP += `<div class="row justify-content-center"><h5 class="card-title" style= "color:red; margin-top:10px;">Can't reply to this user!</h5></div></div></div></div></dr>`
            }
        }
    }
    mainP +=`</div></div></divMain>`
    $('divMain').replaceWith(mainP);    
    $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#cards dr").filter(function(hh) {
          console.log($(this).toggle($(this).text().toLowerCase().indexOf(value)))
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    })
}      
// Function to refresh data
function refreshData(type){
    $('divMain').replaceWith('<divMain></divMain>');
    $('#load22').show();
    fetch(`/page_data?page_id=${document.getElementById("page_h_id").value}`)
    .then(response => response.json())
    .then(data => {
        pageData = data.page_data.Item;
        document.getElementById("page_name").innerHTML = pageData.page_name.S;
        document.getElementById("total_count").innerHTML = (parseInt(pageData.comments_count.N) + pageData.sent_list.L.length + pageData.received_list.L.length) -2;
        document.getElementById("comments").innerHTML = pageData.comments_count.N;
        document.getElementById("received_count").innerHTML = pageData.received_list.L.length -1;
        document.getElementById("sent_count").innerHTML = pageData.sent_list.L.length -1;
        $('#load22').hide();
        ai_tab(`${type}`) 
    })
    .catch((error) => {
        refreshData(type);
    });
}
// Function 2 to refresh data
function refreshData2(){
    $('divMain').replaceWith('<divMain></divMain>');
    $('#load22').show();
    fetch(`/page_data?page_id=${document.getElementById("page_h_id").value}`)
    .then(response => response.json())
    .then(data => {
        pageData = data.page_data.Item;
        document.getElementById("page_name").innerHTML = pageData.page_name.S;
        document.getElementById("total_count").innerHTML = (parseInt(pageData.comments_count.N) + pageData.sent_list.L.length + pageData.received_list.L.length) -2;
        document.getElementById("comments").innerHTML = pageData.comments_count.N;
        document.getElementById("received_count").innerHTML = pageData.received_list.L.length -1;
        document.getElementById("sent_count").innerHTML = pageData.sent_list.L.length -1;
        $('#load22').hide();
        privateReplies() 
    })
    .catch((error) => {
        refreshData2();
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
// Function for Messenger Link
function mLink(){
    window.open(`https://m.me/${pageData.pageID.S}`, '_blank');
}
// Function for Facebook page Link
function fbLink(){
    window.open(`https://facebook.com/${pageData.pageID.S}`, '_blank');
}
// Function to go back to main dashboard.
function allPages(){
    $('divMain').replaceWith("<divMain></divMain>");
    window.location.href ="/dashboard"
    $('#load22').show();
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
// Function to display/hide the token
function displayFun2() {
    var x = document.getElementById("app_token");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
// Function to update the post link and secret
async function updateFun(Val) {
    if (Val === "link"){
        check = true;
        try{
            new URL(document.getElementById("post_url").value)
        } catch (_){
            check = false;
            $('#updateState2').replaceWith(`<p id = "updateState2" style="color:red; margin-top:10px">Please enter a valid link!</p>`);
        }
        if (check == true){
            await fetch(`/post_update?page_id=${pageData.pageID.S}&data1=${document.getElementById("post_url").value}&data2=${pageData.post_secret.S}`)
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    pageData.post_link.S = document.getElementById("post_url").value;
                    ai_tab('postURL')
                    document.getElementById("updateState2").innerHTML = "<b>Link Updated!</b>"
                } 
                else {
                    $('#updateState2').replaceWith(`<p id = "updateState2" style="color:red; margin-top:10px">Oops, we can't verify this POST link! Please check for typo, the endpoint accept POST request, make sure the server is on, and try again.</p>`);
                }
            })
            .catch((error) => {
              updateFun(Val)
            });
        }
    } 
    else {
        if (document.getElementById("app_secret").value.length < 8){
            $('#updateState').replaceWith(`<p id = "updateState" style="color:red; margin-top:10px">Please create a longer secret for safety. (Min 8 characters)</p>`);
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
}
// Function to change and update the Wit App
async function changeApp() {
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
        changeApp();
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
            $('divExportMsg').replaceWith(`<divExportMsg><h6 style='color:red; margin-bottom:25px;'> <b>Something went wrong! Please try again in few minutes.</b> </h6></divExportMsg>`);
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
    mainP = `<divMain><button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('entities')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button><h2>Delete Entity <b>${entity.split("_+_")[0]}</b></h2><hr><div class="row"><div class="form-group col-md-12"><p>Are you sure that you want to delete <b>${entity.split("_+_")[0]}</b>? This will remove it from the associated utterances.<br>*Currently, you have <b>${entity.split("_+_")[1]}</b> utterances trained for this intent!</p><button type="button" class="btn btn-danger" style="margin-right:5px;" onclick="deleteEntity('${entity.split("_+_")[0]}')">Delete Intent</button><button type="button" class="btn btn-secondary" onclick="ai_tab('intent')">Cancel</button></div></div>`
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
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding`
    document.getElementById(`addEntity`).disabled = true 
      await fetch(`/add_entity?entity=${document.getElementById("entity_name").value}&key=${pageData.wit_key.S}&keyword=${document.getElementById("keyword").checked}&free_text=${document.getElementById("free_text").checked}`)
      .then(response => response.json())
      .then(data => {
        if (data.success){
          ai_tab('entities') 
        } else {
          document.getElementById("updateState5").innerHTML = "<b style='color:red'>This name either contain unsupported characters or it already exists. Please try a different name.</b>"
        }
      })
      .catch((error) => {
      fetch(`/add_entity?entity=${document.getElementById("entity_name").value}&key=${pageData.wit_key.S}&keyword=${document.getElementById("keyword").checked}&free_text=${document.getElementById("free_text").checked}`)
      .then(response => response.json())
      .then(data => {
        if (data.success){
          ai_tab('entities') 
        } else {
          document.getElementById("updateState5").innerHTML = "<b style='color:red'>This name either contain unsupported characters or it already exists. Please try a different name.</b>"
        }
      })
    });
  }


  async function builtEntity(name){
    document.getElementById(`add-${name.split("/")[1]}`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding`
    document.getElementById(`add-${name.split("/")[1]}`).disabled = true

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
      fetch(`/add_entity?entity=wit$${name.split("/")[1]}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        if (data.success){
          document.getElementById(`add-${name.split("/")[1]}`).innerHTML = `Added`
          document.getElementById(`confirm-${name.split("/")[1]}`).innerHTML = `Entity Added ✔️.`
        } else {
          document.getElementById(`add-${name.split("/")[1]}`).innerHTML = `Add`
          document.getElementById(`add-${name.split("/")[1]}`).disabled = false
          document.getElementById(`confirm-${name.split("/")[1]}`).style = `color:red`
          document.getElementById(`confirm-${name.split("/")[1]}`).innerHTML = `Try Again!`
        }
      })
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
            <p>Are you sure that you want to delete <b>${trait.split("_+_")[0]}</b>? This will remove it from the associated utterances.<br>*Currently, you have <b>${trait.split("_+_")[1]}</b> utterances trained for this intent!</p>
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
      fetch(`/delete_trait?trait=${trait}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        $('#load22').hide();
        ai_tab('traits') 
      })
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
            <p>Are you sure that you want to delete domain <b>${url}</b>? You will no longer be able to use this domain in attachments and template links!</p>
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
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting`
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

          });
  }








  
  async function deleteMenu2(){
    document.getElementById(`deleteMenu2`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting`
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
          });
  }


  async function deleteGetStarted2(){
    document.getElementById(`deleteGetStarted`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting`
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
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding`
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

  }





  async function deleteGreeting2(){
    document.getElementById(`deleteGreeting2`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting`
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
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting`
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
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting Persona`
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
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding`
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
      fetch(`/add_trait?trait=wit$${name.split("/")[1]}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        if (data.success){
          document.getElementById(`add-${name.split("/")[1]}`).innerHTML = `Added`
          document.getElementById(`confirm-${name.split("/")[1]}`).innerHTML = `Entity Added ✔️.`
        } else {
          document.getElementById(`add-${name.split("/")[1]}`).innerHTML = `Add`
          document.getElementById(`add-${name.split("/")[1]}`).disabled = false
          document.getElementById(`confirm-${name.split("/")[1]}`).style = `color:red`
          document.getElementById(`confirm-${name.split("/")[1]}`).innerHTML = `Try Again!`
        }
      })
    });
  }


  async function addIntent(){
    document.getElementById(`addIntent`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding`
    document.getElementById("addIntent").disabled = true;
      await fetch(`/add_intent?intent=${document.getElementById("intent_name").value}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        if (data.success){
          ai_tab('intent') 
        } else {
          document.getElementById(`addIntent`).innerHTML = `Add`
          document.getElementById("addIntent").disabled = false;
          document.getElementById("updateState4").innerHTML = "<b style='color:red'>This name either exists or have special characters!<br>Only use 2+ alphanumeric and underscore characters when naming your intent.<br>The intent name cannot start with a number.</b>"
        }
      })
      .catch((error) => {
        console.log(error)
        addIntent();
    });
  }


  async function addPersona(){
    document.getElementById(`addPersona`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding`
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

  }





  async function addItem(){
    document.getElementById(`addItem`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding`
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
  }













  async function addDomain(){
    document.getElementById(`addDomain`).innerHTML = ` 
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding`
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
      fetch(`/entity?name=${name}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        if (data.entity){
          ai_tab('entities') 
        } else {
          ai_tab('entities') 
        }
      })
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
      fetch(`/trait?name=${name}&key=${pageData.wit_key.S}`)
      .then(response => response.json())
      .then(data => {
        if (data.trait){
          data2 = data
        } else {
          ai_tab('traits') 
        }
      })
    });
    return data2
  }



  function back_feed(){
    mainP = `<divMain>
                      <h2>Page Content Feed</h2>
                    <div class="row">
                      <div class="form-group col-md-12">
                        <p>These are the recent post for this page.</p>
                        <hr>
                        </div>
                        </div>
                        <div class="row row-cols-1 row-cols-sm-2">
                  `


      for (i = 0 ; i < pageFeed.length ; i ++){

        var comment_ = 0;
        if (pageFeed[i].comments){
          comment_ = pageFeed[i].comments.data.length;
        }
        if (pageFeed[i].message){
          mainP += `        
          <div class="col-sm" style="margin-bottom: 15px;">
          <div class="card">
          <div class="card-body">
            <div class="row justify-content-center">
            <h5 class="card-title">${pageFeed[i].message}</h5>
            </div>
            <hr>
            <p class="card-text">From: ${pageFeed[i].from.name}</p>
            <p class="card-text">User ID: ${pageFeed[i].from.id}</p>
            <p class="card-text">Can Reply: ${pageFeed[i].can_reply_privately}</p>
            <p class="card-text">Feed ID: ${pageFeed[i].id}</p>
            <p class="card-text" onclick="comments('${i}')">Comments Count: <b><u>${comment_}</u></b></p>
            </div>
            </div>
            </div>
          `
        }
                
    }
              mainP +=`
                </div></div>
                </divMain>
              `
              $('divMain').replaceWith(mainP);
              document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

  }

  function comments(index){
    mainP = `<divMain>
                <button class="btn btn-info btn-sm" type="button" onclick = "back_feed()" style ="margin-bottom:15px;">
                        <span class="badge"><=</span>Back </button>
                      <h2>Page Content Feed</h2>
                    <div class="row">
                      <div class="form-group col-md-12">
                        <p>These are the comments for <b>${pageFeed[index].id}</b> post.</p>
                        <hr>
                        </div>
                        </div>
                        <div class="row row-cols-1 row-cols-sm-2">
                  `
      for (i = 0 ; i < pageFeed[index].comments.data.length ; i ++){

        if (pageFeed[index].comments.data[i].message){
          mainP += `        
          <div class="col-sm" style="margin-bottom: 15px;">
          <div class="card">
          <div class="card-body">
            <div class="row justify-content-center">
            <h5 class="card-title">${pageFeed[index].comments.data[i].message}</h5>
            </div>
            <hr>
            <p class="card-text">From: ${pageFeed[index].comments.data[i].from.name}</p>
            <p class="card-text">User ID: ${pageFeed[index].comments.data[i].from.id}</p>
            <p class="card-text">Can Reply: ${pageFeed[index].comments.data[i].can_reply_privately}</p>
            <p class="card-text">Feed ID: ${pageFeed[index].comments.data[i].id}</p>
            </div>
            </div>
            </div>
          `
        }     
    }
              mainP +=`

                </div></div>
                </divMain>
              `

              $('divMain').replaceWith(mainP);
              document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  }

  
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
