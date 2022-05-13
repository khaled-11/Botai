async function FacebookTab(link) {
  $(".page-wrapper").removeClass("toggled");
  $(".sidebar-dropdown").removeClass("active");
  $(".sidebar-submenu").slideUp(200);
  $(".sidebar-dropdown").parent().removeClass("active");
  if (link === "get_started") {
    document.title = "Botai | Get Started Button"
    $('divMain').replaceWith("<divMain></divMain>");
    $('#load22').show();
    tok = {
        token: `${pageData.page_access_token.S}`
    }
    var mainP = `<divMain><h2>Get Started Button</h2><hr><div class="row"><div class="form-group col-md-12">`
    if (get_started_data) {
        if (get_started_data.data[0]) {
            mainP += `<p>This is the current Get Started status. You can delete the button, but this will delete the Persistent Menu if you have any!</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-danger" onclick="deleteGetStarted()">Delete Get Started</a></div><hr></div><div class="container-fluid" style = "width:100%"><div><div class="alert alert-dark" role="alert"><div class="table-responsive" id="tbl"><table class="table table-hover"><thead><div class="d-flex justify-content-center" style="margin-bottom:10px; margin-top:10px;"><h5>The Get Started button is <b style = "color:green">Active</b></h5></div></thead><tbody><tr><th scope="row">Payload</th><td>${get_started_data.data[0].get_started.payload}</td></tr></tbody></table></div></div></div>`
        } else {
            mainP += `<p>You don't have an active Get Started button. You can create one using the button below. You need Get Started button to create persistent menu.</p><hr><div class="d-flex justify-content-center"><button type="button" class="btn btn-primary" id = "createGetStarted" onclick="createGetStarted()">Create Get Started</button></div><hr></div>`
        }
    } 
    else {
      await fetch(`/get_started`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tok)
      })
      .then(response => response.json())
      .then(data => {
          if (data.state) {
              get_started_data = data.state;
              if (data.state.data[0]) {
                  mainP += `<p>This is the current Get Started status. You can delete this feature using the button below.<br>If you delete this feature, it will delete the Persistent Menu if you have any!</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-danger" onclick="deleteGetStarted()">Delete Get Started</a></div><hr></div><div class="container-fluid" style = "width:100%"><div><div class="alert alert-dark" role="alert"><div class="table-responsive" id="tbl"><table class="table table-hover"><thead><div class="d-flex justify-content-center" style="margin-bottom:10px; margin-top:10px;"><h5>The Get Started button is <b style = "color:green">Active</b></h5></div></thead><tbody><tr><th scope="row">Payload</th><td>${data.state.data[0].get_started.payload}</td></tr></tbody></table></div></div></div>`
              } else {
                  mainP += `<p>You don't have an active Get Started button. You can create one using the button below. You need Get Started button to create persistent menu.</p><hr><div class="d-flex justify-content-center"><button type="button" class="btn btn-primary" id = "createGetStarted" onclick="createGetStarted()">Create Get Started</button></div><hr></div>`
              }
          } else {
              mainP += `<div class="d-flex justify-content-center"><p><b style= "color:red; text-align:center;">This endpoint has limits, please visit back after few minutes.<b></p></div><hr></div>`
          }
      })
      .catch(error => {
          FacebookTab("get_started")
      });
    }
    mainP += `</div></div></divMain>`
    $('#load22').hide();
  }
  else if (link === "persistentMenu") {
      document.title = "Botai | Persistent Menu"
      $('divMain').replaceWith("<divMain></divMain>");
      $('#load22').show();
      if (psMenu_data) {
          mainP = `<divMain><h2>Persistent Menu</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the Persistent Menu Items for this page. You can delete item, delete the menu, or add new items using the buttons below.</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-success" onclick="FacebookTab('add_menu_item')">Add Item</a>`;
          if (psMenu_data[0]) {
              mainP += `<a class="btn btn-sm btn-danger" style = "margin-left:15px" onclick="deleteMenu()">Delete Menu</a></div><hr></div><div class="container-fluid" style = "width:100%"><div class="table-responsive" id="tbl"><table class="table table-hover table-md" ><thead><tr><th >Item:</th><td></td></tr></thead><tbody>`
              for (k = 0; k < psMenu_data.length; k++) {
                  mainP += `<tr><td><b>${psMenu_data[k].title}</b><br>`
                  if (psMenu_data[k].type === "web_url") {
                      mainP += `url:<b style="color:#000080; background-color: #d2f8d2; padding:0.5px;"> ${psMenu_data[k].url}</b>`
                  } else {
                      mainP += `payload:<b style="color:#000080; background-color: #d2f8d2; padding:0.5px;"> ${psMenu_data[k].payload}</b>`
                  }
                  mainP += `</td><td align="center"><button type="button" class="btn btn-danger btn-md" onclick="deleteMenuItem('${psMenu_data[k].title}');">Delete</button></td></tr>`
              }
              mainP += `</table></div></div></div></divMain>`
          } else {
              mainP += `</div><hr></div></div></divMain>`
          }
      } else {
          tok = {
              token: `${pageData.page_access_token.S}`
          }
          await fetch(`/get_persistent_menu`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(tok)
              })
              .then(response => response.json())
              .then(data => {
                  if (data.state) {
                      if (data.state.data[0]) {
                          psMenu_data = data.state.data[0].persistent_menu[0].call_to_actions;
                      } else {
                          psMenu_data = [];
                      }
                      mainP = `<divMain><h2>Persistent Menu</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the Persistent Menu Items for this page. You can delete item, delete the menu, or add new items using the buttons below.</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-success" onclick="FacebookTab('add_menu_item')">Add Item</a>`;
                      if (psMenu_data[0]) {
                          mainP += `
          <a class="btn btn-sm btn-danger" style = "margin-left:15px" onclick="deleteMenu()">Delete Menu</a>
                  </div>
                  <hr>
                  </div>
                  <div class="container-fluid" style = "width:100%">
                  <div class="table-responsive" id="tbl">
                  <table class="table table-hover table-md" >
                  <thead><tr><th >Item:</th><td></td>
                  </tr></thead><tbody>
          `
                          for (k = 0; k < psMenu_data.length; k++) {
                              mainP += `<tr>
                <td><b>${psMenu_data[k].title}</b>
                  <br>`
                              if (psMenu_data[k].type === "web_url") {
                                  mainP += `url:<b style="color:#000080; background-color: #d2f8d2; padding:0.5px;"> ${data.state.data[0].persistent_menu[0].call_to_actions[k].url}</b>`
                              } else {
                                  mainP += `payload:<b style="color:#000080; background-color: #d2f8d2; padding:0.5px;"> ${data.state.data[0].persistent_menu[0].call_to_actions[k].payload}</b>`
                              }
                              mainP += `</td>
                    <td align="center">             
                <button type="button" class="btn btn-danger btn-md" onclick="deleteMenuItem('${data.state.data[0].persistent_menu[0].call_to_actions[k].title}');">
                Delete
                </button>
              </td></tr>
              `
                          }
                          mainP += `
        </table></div></div>
            </div>
          </divMain>
          `
                      } else {
                          mainP += `
                  </div>
                  <hr>
                  </div>
                  </div>
                  </divMain>
          `
                      }
                  } else {
                      mainP = `
          <divMain>  
          <h2>Persistent Menu</h2>
          <hr>
          <div class="row">
            <div class="form-group col-md-12">
              <hr>
              <div class="d-flex justify-content-center">
                <p><b style= "color:red; text-align:center;">This endpoint has limits, please visit back after few minutes.<b></p>
              </div>
              <hr>
              </div>
              <div class="container-fluid" style = "width:100%">
              <div class="table-responsive" id="tbl">
        `;
                  }

              })
              .catch(error => {
                  FacebookTab("persistentMenu")
              });
          mainP += `
            </div>
            </div></div>
            </divMain>
          `
      }

      $('#load22').hide();
  } else if (link === "whitelist") {
      document.title = "Botai | Whitelisted Domains"
      $('divMain').replaceWith("<divMain></divMain>");
      $('#load22').show();
      if (whitelisted_data) {
          mainP = `
      <divMain>  
      <h2>Whitelisted Domains</h2>
      <hr>
      <div class="row">
        <div class="form-group col-md-12">
          <p>These are the whitelisted domains for this page. You can delete or add new domains using the buttons below.</p>
          <hr>
          <div class="d-flex justify-content-center">
          <a class="btn btn-sm btn-success" onclick="FacebookTab('add_whitelisted')">Add Domain</a>
          </div>
          <hr>
          </div>
          <div class="container-fluid" style = "width:100%">
          <div class="table-responsive" id="tbl">
           <table class="table table-hover table-md" >
          <thead><tr><th >Domain:</th><td></td>
          </tr></thead><tbody>
    `;
          for (k = 0; k < whitelisted_data.length; k++) {
              mainP += `
        <tr>
          <td><b>${whitelisted_data[k]}</b></td>
              <td align="center">             
          <button type="button" class="btn btn-danger btn-md" onclick="deleteDomain('${whitelisted_data[k]}');">
          Delete
          </button>
        </td>`
          }
      } else {
          tok = {
              token: `${pageData.page_access_token.S}`
          }

          await fetch(`/get_whitelisted`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(tok)
              })
              .then(response => response.json())
              .then(data => {

                if (data.state) { 
                  if (data.state.data[0] && data.state.data[0].whitelisted_domains){
                    whitelisted_data = data.state.data[0].whitelisted_domains;
                  } else {
                    whitelisted_data = []
                  }
                      mainP = `
      <divMain>  
      <h2>Whitelisted Domains</h2>
      <hr>
      <div class="row">
        <div class="form-group col-md-12">
          <p>These are the whitelisted domains for this page. You can delete or add new domains using the buttons below.</p>
          <hr>
          <div class="d-flex justify-content-center">
          <a class="btn btn-sm btn-success" onclick="FacebookTab('add_whitelisted')">Add Domain</a>
          </div>
          <hr>
          </div>
          <div class="container-fluid" style = "width:100%">
          <div class="table-responsive" id="tbl">
           <table class="table table-hover table-md" >
          <thead><tr><th >Domain:</th><td></td>
          </tr></thead><tbody>
    `;


                      for (k = 0; k < data.state.data[0].whitelisted_domains.length; k++) {
                          mainP += `
        <tr>
          <td><b>${data.state.data[0].whitelisted_domains[k]}</b></td>
              <td align="center">             
          <button type="button" class="btn btn-danger btn-md" onclick="deleteDomain('${data.state.data[0].whitelisted_domains[k]}');">
          Delete
          </button>
        </td>`
                      }
                  } else {
                      mainP = `
      <divMain>  
      <h2>Whitelisted Domains</h2>
      <hr>
      <div class="row">
        <div class="form-group col-md-12">
          <hr>
          <div class="d-flex justify-content-center">
            <p><b style= "color:red; text-align:center;">This endpoint has limits, please visit back after few minutes.<b></p>
          </div>
          <hr>
          </div>
          <div class="container-fluid" style = "width:100%">
          <div class="table-responsive" id="tbl">
           <table class="table table-hover table-md" ><tbody>
    `;
                  }
              })
              .catch(error => {
                  FacebookTab("whitelist")
              });
      }
      mainP += `
        </tbody>
        </div>
        </div></div>
        </divMain>
      `
      $('#load22').hide();
  } else if (link === "personas") {
      document.title = "Botai | Page Personas"
      $('divMain').replaceWith("<divMain></divMain>");
      $('#load22').show();
      tok = {
          token: `${pageData.page_access_token.S}`
      }
      await fetch(`/get_personas`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(tok)
          })
          .then(response => response.json())
          .then(data => {
              if (data.state) {
                  mainP = `<divMain>
            <h2>Page Personas</h2><hr>
            <div class="row">
              <div class="form-group col-md-12">
                <p>These are the personas for the current page. You can delete or add new personas using the buttons below.</p>
                <hr>
            <div class="d-flex justify-content-center">
          <a class="btn btn-sm btn-success" style="color:white" onclick="FacebookTab('add_persona')">Add Persona</a>
          </div><hr></div></div>
          <div class="row row-cols-1 row-cols-sm-3">`

                  for (i = 0; i < data.state.data.length; i++) {

                      mainP += `        
<div class="col-sm" style="margin-bottom: 15px;">
<div class="card">
<div class="card-body">
<div class="row justify-content-center">
  <img class="img-responsive img-rounded" style = "width:120px; height:120px; border-radius: 5px;" src="${data.state.data[i].profile_picture_url}" alt="Persona picture">
</div>
  <hr>
  <div class="row justify-content-center">
  <h5 class="card-title">${data.state.data[i].name}</h5>
  </div>
  <div class="row justify-content-center">
  <p class="card-text">ID : ${data.state.data[i].id}</p>
  </div>
  <br>
  <div class="row justify-content-center">
    <button type="button" style="margin-bottom:-10px" class="btn btn-danger btn-md" onclick="deletePersonas('${data.state.data[i].id}');">
    Delete</button>
  </div>
</div>
</div>
</div>
`
                  }
                  mainP += `

        </div></div>
        </divMain>
      `
              } else {


                  mainP = `<divMain>
            <h2>Page Personas</h2><hr>
            <div class="row">
              <div class="form-group col-md-12">
                <p>These are the personas for the current page. You can delete or add new personas using the buttons below.</p>
                <hr>
                </div>
              </div>
      <div class="d-flex justify-content-center">
<p><b style= "color:red; text-align:center;">This endpoint has limits, please visit back after few minutes.<b></p>
</div><hr></divMain>`
              }
              $('#load22').hide();
          })
          .catch(error => {
              FacebookTab("personas")
          });
  } else if (link === "greeting") {
      document.title = "Botai | Greeting Message"
      $('divMain').replaceWith("<divMain></divMain>");
      $('#load22').show();
      tok = {
          token: `${pageData.page_access_token.S}`
      }
      var mainP = `
          <divMain>
              <h2>Greeting Message</h2>
            <hr>`
      if (greeting_data) {
          if (greeting_data !== "") {
              mainP += `
            <div class="row">
              <div class="form-group col-md-12">
                <p>This is the current default greeting message. To update the message, edit the message and click update. Add {{user_first_name}} to display the user first name in the greeting message.</p>
                Default Locale: <input type="text" id = "greeting_message" value="${greeting_data}">
                <button type="button" class="btn btn-primary" style="margin-right:5px;" id = "updateGreeting" onclick="updateGreeting()">
            Update Message
          </button>
          <button type="button" class="btn btn-danger" id = "deleteGreeting" onclick="deleteGreeting()">
            Delete Message
          </button>
              `
          } else {
              // No Message
              mainP += `
<p>You don't have a greeting message. To create one, enter the message and click the button below. Add {{user_first_name}} to display the user first name in the greeting message.</p>
<hr>
Default Locale: <input type="text" id = "greeting_message" value="">
<button class="btn btn-primary btn-md" id="addGreeting" onclick="updateGreeting()">Add Greeting</button>
`
          }
      } else {
          await fetch(`/greeting`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(tok)
              })
              .then(response => response.json())
              .then(data => {
                  if (data.state) {
                      if (data.state.data[0] && data.state.data[0].greeting[0]) {
                          greeting_data = `${data.state.data[0].greeting[0].text}`;
                          mainP += `
            <div class="row">
              <div class="form-group col-md-12">
                <p>This is the current default greeting message. To update the message, edit the message and click update. Add {{user_first_name}} to display the user first name in the greeting message.</p>
                Default Locale: <input type="text" id = "greeting_message" value="${data.state.data[0].greeting[0].text}">
                <button type="button" class="btn btn-primary" style="margin-right:5px;" id = "updateGreeting" onclick="updateGreeting()">
            Update Message
          </button>
          <button type="button" class="btn btn-danger" id = "deleteGreeting" onclick="deleteGreeting()">
            Delete Message
          </button>
              `
                      } else {
                          greeting_data = ""
                          // No Message
                          mainP += `
<p>You don't have a greeting message. To create one, enter the message and click the button below. Add {{user_first_name}} to display the user first name in the greeting message.</p>
<hr>
Default Locale: <input type="text" id = "greeting_message" value="">
<button class="btn btn-primary btn-md" id="addGreeting" onclick="updateGreeting()">Add Greeting</button>
`
                      }
                  } else {
                      // Limits API
                      mainP += `<div class="d-flex justify-content-center">
<p><b style= "color:red; text-align:center;">This endpoint has limits, please visit back after few minutes.<b></p>
</div>
<hr>`
                  }
              })
              .catch(error => {
                  FacebookTab("greeting")
              });
      }

      mainP += `

        </div></div>
        </divMain>
      `
      $('#load22').hide();

  } else if (link === "add_persona") {
      document.title = "Botai | Add Persona"
      var mainP = `
          <divMain>
          <button class="btn btn-info btn-sm" type="button" onclick = "FacebookTab('personas')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button>
              <h2>Add Persona</h2>
            <hr>
            <div class="row">
              <div class="form-group col-md-12">
                <p>To add a new persona, please enter the name, and link below:</p>
                </div>
          `

      mainP += `
      </div><div>
        Persona Name: <input type="text" id = "persona_name" value="">
        Profile Image Link: <input type="text" id = "persona_link" value="">
        <button class="btn btn-primary btn-md" style="margin-top:15px;" id = "addPersona" onclick="addPersona()">Add Persona</button>
        <p id = "updateStatePersona" style="margin-top:10px"></p>
        </div>
        </divMain>
      `
  } else if (link === "add_menu_item") {
      document.title = "Botai | Add Menu Item"
      var mainP = `
          <divMain>
          <button class="btn btn-info btn-sm" type="button" onclick = "FacebookTab('persistentMenu')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button>
              <h2>Add Menu Item</h2>
            <hr>
            <div class="row">
              <div class="form-group col-md-12">
                <p>To add a new item, please select the type and complete the details below:</p>
                </div>
          `

      mainP += `
      </div><div>

        <select id = "menu_item" class="form-control form-control-sm">
        <option checked value= "url" > Web URL </option>
        <option checked value= "postback" > Postback </option>
        </select>
        
        Title: <input type="text" id = "item_title" value="">
        payload / url: <input type="text" id = "item_value" value="">
        <button class="btn btn-primary btn-md" style="margin-top:15px;" id = "addItem" onclick="addItem()">Add Item</button>
        <p id = "updateStateItem" style="margin-top:10px"></p>
        </div>
        </divMain>
      `
  } else if (link === "add_whitelisted") {
      document.title = "Botai | Whitelist Domain"
      var mainP = `
          <divMain>
          <button class="btn btn-info btn-sm" type="button" onclick = "FacebookTab('whitelist')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button>
              <h2>Whitelist Domain</h2>
            <hr>
            <div class="row">
              <div class="form-group col-md-12">
                <p>To whitelist domain, please enter the link below:</p>
                </div>
          `

      mainP += `
      </div><div>
        Link: <input type="url" id = "domain_url" value="">
        <button class="btn btn-primary btn-md" style="margin-top:15px;" id = "addDomain" onclick="addDomain()">Add Domain</button>
        <p id = "updateStateDomain" style="margin-top:10px"></p>
        </div>
        </divMain>
      `
  }

  $('divMain').replaceWith(mainP);


}