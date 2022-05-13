async function ai_tab(link){    
  $(".page-wrapper").removeClass("toggled");
  $(".sidebar-dropdown").removeClass("active");
  $(".sidebar-submenu").slideUp(200);
  $(".sidebar-dropdown").parent().removeClass("active");
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  // If the user select intents  
  if (link === "intent"){
    document.title = "Botai | App Intents"
    $('#load22').show(); 
    $('divMain').replaceWith("<divMain></divMain>");      
    await fetch(`/intents?key=${pageData.wit_key.S}`)
    .then(response => response.json())
    .then(data => {
      if (data.intents){
        myIntents = data;
        $('#load22').hide(); 
      } else {
        ai_tab('intent')
      }
    })
    .catch((error) => {
      ai_tab('intent')
    });
    mainP = `<divMain><h2>App Intents</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the intents we have for this App. When the Wit App identifies an intent in a message, your webhook will receive all the details and the intent name. Train the App with sample utterances to better identify each intent and combinations if any.</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-success" style="color:white" onclick="ai_tab('add_intent')">Add Intent</a></div></div><hr><div class="container-fluid" style = "width:100%"><div class="table-responsive" id="tbl"><table class="table table-hover table-md" ><thead><tr><th>Intent:</th><th>Utterances:</th></tr></thead><tbody>`;
    for (i = 0 ; i < myIntents.intents.length ; i ++) {
      mainP += `<tr><td><b>${myIntents.intents[i].name}</b></td>`;
      var count = 0;
      for( j = 0 ; j < myIntents.utterances.length ; j++){
        if(myIntents.utterances[j].intent){
          if (myIntents.utterances[j].intent.name === myIntents.intents[i].name){
            count ++;
          }
        }
      }
      if (count == 0){
        mainP +=`<td style="color:res"><b>none<b></td>`
      } else {
        mainP +=`<td style="color:green"><b>${count}<b></td>`
      }
      mainP +=`<td align="center"><button type="button" class="btn btn-danger" onclick="deleteIntent1('${myIntents.intents[i].name}_+_${count}')">Delete</button></td>`
    }
    mainP += `</tr></tbody></table></div></div></divMain>`
  }
  else if (link === "wit_app"){
    document.title = "Botai | Wit App"
    $('#load22').show(); 
    $('divMain').replaceWith("<divMain></divMain>");      
    var appData;
    await fetch(`/wit_app?page_id=${document.getElementById("page_h_id").value}`)
    .then(response => response.json())
    .then(data => {
      if (data.wit_data){
        appData = data;
        $('#load22').hide(); 
      } else {
        ai_tab('wit_app')
      }
    })
    .catch((error) => {
      ai_tab('wit_app')
    });
    if (appData.wit_data.lang === "true"){
      var type = "Private"
    } else {
      var type = "Public"
    }
    mainP = `<divMain><h2>Wit.ai App</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the information about the connected  Wit App. You can import App, or switch to use App from your Wit.ai account. If you switch to use App from your account, you will have access to the Wit.ai website console.</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-primary" onclick="ai_tab('import_app')" style = "color:white;"">Import App</a><a class="btn btn-sm btn-primary" onclick="ai_tab('export_app')" style = "margin-left:15px; color:white;">Export App</a><a class="btn btn-sm btn-info" onclick="ai_tab('change_app')" style = "margin-left:15px; color:white;">Change App</a></div><hr></div><div class="container-fluid" style = "width:100%"><div><div class="alert alert-dark" role="alert"><div class="table-responsive" id="tbl"><table class="table table-hover"><thead><div class="d-flex justify-content-center" style="margin-bottom:10px; margin-top:10px;"><h5>This is <b>${type}</b> App</h5></div></thead><tbody><tr><th scope="row">App language</th><td>${appData.wit_data.lang}</td></tr><tr><th scope="row">Last trained at</th><td>${appData.wit_data.created_at}</td></tr><tr><th scope="row">Will train at</th><td>${appData.wit_data.last_trained_at}</td></tr><tr><th scope="row">Training Status</th><td style="color:green">${appData.wit_data.training_status}</td></tr><tr><th scope="row">Created at</th><td>${appData.wit_data.created_at}</td></tr><tr><th scope="row">App name</th><td>${appData.wit_data.name}</td></tr><tr><th scope="row">App ID</th><td>${appData.wit_data.id}</td></tr></tbody></table></div></div></div></divMain>`;
  }    
  else if (link === "entities"){
    document.title = "Botai | App Entities"
    $('#load22').show(); 
    $('divMain').replaceWith("<divMain></divMain>");      
    await fetch(`/entities?key=${pageData.wit_key.S}`)
    .then(response => response.json())
    .then(data => {
      if (data.entities){
        myEntities = data;
        $('#load22').hide();
      } else {
        ai_tab('entities')
      }
    })
    .catch((error) => {
      ai_tab('entities')
    });
    mainP = `<divMain><h2>App Entities</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the entities we have for this App. You can add custom or built-in entities using the buttons below. If the Wit App identifies entities in a message, your webhook will receive the details. Train the App with sample utterances to better identify each entity and combinations if any.</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-success" style="color:white" onclick="ai_tab('add_entity')">Add Entity</a><a class="btn btn-sm btn-info" style="color:white; margin-left:15px;" onclick="ai_tab('built_entity')">Built-in Entities</a></div></div><hr><div class="container-fluid" style = "width:100%"><div class="table-responsive" id="tbl"><table class="table table-hover table-md" ><thead><tr><th>Entity:</th><th>Utterances:</th></tr></thead><tbody>`;
    for (i = 0 ; i < myEntities.entities.length ; i ++) {
      mainP += `<tr><td><b>${myEntities.entities[i].name}</b></td>`;
      var count = 0;
      for( j = 0 ; j < myEntities.utterances.length ; j++){
        for( n = 0 ; n < myEntities.utterances[j].entities.length ; n++){
          if(myEntities.utterances[j].entities[n]){
            if (myEntities.utterances[j].entities[n].name === myEntities.entities[i].name){
              count ++;
            }
          }
        }
      }        
      if (count == 0){
        mainP +=`<td style="color:res"><b>none<b></td>`
      } else {
        mainP +=`<td style="color:green"><b>${count}<b></td>`
      }
      if (!myEntities.entities[i].name.includes("$")){
        mainP +=`<td align="center"><button type="button" class="btn btn-danger" onclick="deleteEntity1('${myEntities.entities[i].name}_+_${count}')">Delete</button></td>` 
      } else {
        mainP +=`<td align="center"><button type="button" disabled class="btn btn-danger">Delete</button></td>`
      }
    }
    mainP += `</tr></tbody></table></div></div></divMain>`
  }        
  else if (link === "utterances"){
    document.title = "Botai | App Utterances"
    $('divMain').replaceWith("<divMain></divMain>");      
    $('#load22').show();
    await fetch(`/page_data?page_id=${document.getElementById("page_h_id").value}`)
    .then(response => response.json())
    .then(data => {
      if (data.page_data){
        pageData = data.page_data.Item;
      } else {
        ai_tab('utterances')
      }
    })
    .catch((error) => {
      ai_tab('utterances')
    });
    await fetch(`/all?key=${pageData.wit_key.S}`)
    .then(response => response.json())
    .then(data => {
      if(data.utterances){
        myUtterances = data;
        myIntents = data;
        myEntities = data;
        myTraits = data;
        $('#load22').hide(); 
      } else {
        ai_tab('utterances')     
      }
    })
    .catch((error) => {
      ai_tab('utterances')     
    });
    $(document).ready(function(){
      $('[data-toggle="popover"]').popover();  
    });
    mainP = `<divMain><h2>App Utterances</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the utterances for the current Wit App. Train the App with utterances to improve the model, and get better future analysis. Click "Add Utterance" to start the training and validation process.</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-success" onclick="ai_tab('add_utterance')">Add Utterance</a><a class="btn btn-sm btn-info" tabindex="0" data-toggle="popover" data-trigger="focus" title="Upload Utterances" data-content="You will be able to upload utterances from CSV or JSON files here. We will test the Model for each utterance and you can approve or adjust each utterance before we send it to train. This is currently in the work! please check back later." style = "margin-left:15px;">Upload Utterances</a></div><hr></div><div class="container-fluid" style = "width:100%"><div class="table-responsive" id="tbl"><input class="form-control" id="myInput" type="text" placeholder="Search.."><div class="d-flex justify-content-center"><a class="btn btn-sm btn-info" onclick='ai_tab("utterances")'>Refresh</a></div><hr><table class="table table-hover table-md" ><thead><tr><th >Utterance:</th><td></td></tr></thead><tbody>`;
    textArr = []
    for ( p = 0 ; p < myUtterances.utterances.length; p++){
      textArr[p] = myUtterances.utterances[p].text
    }
    for (k = 1 ; k < pageData.utterances_list.L.length ; k++){
      if(!textArr.includes(pageData.utterances_list.L[k].S) && pageData.utterances_list.L[k].S !== "" && pageData.utterances.M[`${pageData.utterances_list.L[k].S}`] && pageData.utterances.M[`${pageData.utterances_list.L[k].S}`].L[2].S !== "intial"){
        mainP += `<tr style="background-color:#d6f5d6"><td><span style = "color: rgb(44, 35, 97); font-size: 14px; font-weight: 700; letter-spacing: 1px; position: relative; animation: text 2s 50;" class="text1">${pageData.utterances_list.L[k].S}</span><br>Intent: <b style="color:#000080; background-color: #DBF3FA; padding:0.5px;">${pageData.utterances.M[`${pageData.utterances_list.L[k].S}`].L[1].S}</b/</td><td align="center"><button type="button" disabled class="btn btn-warning btn-md"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Training</button></td>`
      }
    }
    textArr2 = []
    for ( n = 1 ; n < pageData.utterances_list.L.length; n++){
      textArr2[n] = pageData.utterances_list.L[n].S
    }
    deleteArr = []
    for (o = 0 ; o < textArr.length ; o++){
      if(!textArr2.includes(textArr[o]) && pageData.utterances.M[`${textArr[o]}`]){
        deleteArr[deleteArr.length] = textArr[o]
        mainP += `<tr style="background-color:#ffecef"><td><span style = "color: red; font-size: 14px; font-weight: 700; letter-spacing: 1px; position: relative; animation: text 2s 50;" class="text1">${textArr[o]}</span></td><td align="center"><button type="button" disabled class="btn btn-danger btn-md" onclick="deleteUtterance1('${delName}')"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting</button></td>`;
      }
    } 
    for (i = 0 ; i < myUtterances.utterances.length ; i ++) {
      delName = myUtterances.utterances[i].text;
      for (k=0;k<myUtterances.utterances[i].text.split(" ").length; k++){
        if (myUtterances.utterances[i].text.split(" ")[k].length >18){
          myUtterances.utterances[i].text = `${myUtterances.utterances[i].text.substring(0,15)} ....`
        }}
        if (myUtterances.utterances[i].intent && myUtterances.utterances[i].intent.name.length >18){
          myUtterances.utterances[i].intent.name = `${myUtterances.utterances[i].intent.name.substring(0,15)} ...`
        }
        if (!myUtterances.utterances[i].text.includes("...")){
          if (myUtterances.utterances[i].entities.length > 3){
            for ( o = 0 ; o < 4; o ++){
              if (myUtterances.utterances[i].entities[0].start > myUtterances.utterances[i].entities[1].start){
                temp = myUtterances.utterances[i].entities[0];
                myUtterances.utterances[i].entities[0] = myUtterances.utterances[i].entities[1]
                myUtterances.utterances[i].entities[1] = temp
              }
              if (myUtterances.utterances[i].entities[1].start > myUtterances.utterances[i].entities[2].start){
                temp = myUtterances.utterances[i].entities[1];
                myUtterances.utterances[i].entities[1] = myUtterances.utterances[i].entities[2]
                myUtterances.utterances[i].entities[2] = temp
              }
              if (myUtterances.utterances[i].entities[2].start > myUtterances.utterances[i].entities[3].start){
                temp = myUtterances.utterances[i].entities[2];
                myUtterances.utterances[i].entities[2] = myUtterances.utterances[i].entities[3]
                myUtterances.utterances[i].entities[3] = temp
              }
            }
            myUtterances.utterances[i].text = `${myUtterances.utterances[i].text.substring(0,myUtterances.utterances[i].entities[0].start)}<b tabindex="0" data-toggle="popover" data-trigger="focus" title="Entity details for (${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].start,myUtterances.utterances[i].entities[0].end)})" data-content="(${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].start,myUtterances.utterances[i].entities[0].end)}) belongs to entity: (${myUtterances.utterances[i].entities[0].name}). \nFor information about this entity, please see Entities Tab." style = "color:Indigo; background-color:#ecf87f; padding:1px;">${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].start,myUtterances.utterances[i].entities[0].end)}</b>${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].end, myUtterances.utterances[i].entities[1].start)}<b tabindex="0" data-toggle="popover" data-trigger="focus" title="Entity details for (${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[1].start,myUtterances.utterances[i].entities[1].end)})" data-content="(${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[1].start,myUtterances.utterances[i].entities[1].end)}) belongs to entity: (${myUtterances.utterances[i].entities[1].name}). \nFor information about this entity, please see Entities Tab." style = "color:#013a20; background-color:#b1d8b7; padding:1px;">${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[1].start,myUtterances.utterances[i].entities[1].end)}</b>${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[1].end, myUtterances.utterances[i].entities[2].start)}<b tabindex="0" data-toggle="popover" data-trigger="focus" title="Entity details for (${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[2].start,myUtterances.utterances[i].entities[2].end)})" data-content="(${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[2].start,myUtterances.utterances[i].entities[2].end)}) belongs to entity: (${myUtterances.utterances[i].entities[2].name}). \nFor information about this entity, please see Entities Tab." style = "color:black; background-color:#d4d6cf; padding:1px;">${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[2].start,myUtterances.utterances[i].entities[2].end)}</b>${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[2].end, myUtterances.utterances[i].entities[3].start)}<b tabindex="0" data-toggle="popover" data-trigger="focus" title="Entity details for (${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[3].start,myUtterances.utterances[i].entities[3].end)})" data-content="(${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[3].start,myUtterances.utterances[i].entities[3].end)}) belongs to entity: (${myUtterances.utterances[i].entities[3].name}). \nFor information about this entity, please see Entities Tab." style = "color:#474241; background-color:#b5a4a3; padding:1px;">${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[3].start,myUtterances.utterances[i].entities[3].end)}</b>${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[3].end)}`
          }
          else if (myUtterances.utterances[i].entities[2]){
            if (myUtterances.utterances[i].entities[0].start > myUtterances.utterances[i].entities[2].start){
              temp = myUtterances.utterances[i].entities[0];
              myUtterances.utterances[i].entities[0] = myUtterances.utterances[i].entities[2]
              myUtterances.utterances[i].entities[2] = temp
            }
            if (myUtterances.utterances[i].entities[0].start > myUtterances.utterances[i].entities[1].start){
              temp = myUtterances.utterances[i].entities[0];
              myUtterances.utterances[i].entities[0] = myUtterances.utterances[i].entities[1]
              myUtterances.utterances[i].entities[1] = temp
            }
            myUtterances.utterances[i].text = `${myUtterances.utterances[i].text.substring(0,myUtterances.utterances[i].entities[0].start)}<b tabindex="0" data-toggle="popover" data-trigger="focus" title="Entity details for (${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].start,myUtterances.utterances[i].entities[0].end)})" data-content="(${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].start,myUtterances.utterances[i].entities[0].end)}) belongs to entity: (${myUtterances.utterances[i].entities[0].name}). \nFor information about this entity, please see Entities Tab." style = "color:Indigo; background-color:#ecf87f; padding:1px;">${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].start,myUtterances.utterances[i].entities[0].end)}</b>${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].end, myUtterances.utterances[i].entities[1].start)}<b tabindex="0" data-toggle="popover" data-trigger="focus" title="Entity details for (${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[1].start,myUtterances.utterances[i].entities[1].end)})" data-content="(${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[1].start,myUtterances.utterances[i].entities[1].end)}) belongs to entity: (${myUtterances.utterances[i].entities[1].name}). \nFor information about this entity, please see Entities Tab." style = "color:#013a20; background-color:#b1d8b7; padding:1px;">${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[1].start,myUtterances.utterances[i].entities[1].end)}</b>${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[1].end, myUtterances.utterances[i].entities[2].start)}<b tabindex="0" data-toggle="popover" data-trigger="focus" title="Entity details for (${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[2].start,myUtterances.utterances[i].entities[2].end)})" data-content="(${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[2].start,myUtterances.utterances[i].entities[2].end)}) belongs to entity: (${myUtterances.utterances[i].entities[2].name}). \nFor information about this entity, please see Entities Tab." style = "color:black; background-color:#d4d6cf; padding:1px;">${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[2].start,myUtterances.utterances[i].entities[2].end)}</b>${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[2].end)}`
          }
          else if (myUtterances.utterances[i].entities[1]){
            if (myUtterances.utterances[i].entities[0].start > myUtterances.utterances[i].entities[1].start){
              temp = myUtterances.utterances[i].entities[0];
              myUtterances.utterances[i].entities[0] = myUtterances.utterances[i].entities[1]
              myUtterances.utterances[i].entities[1] = temp
            }
            myUtterances.utterances[i].text = `${myUtterances.utterances[i].text.substring(0,myUtterances.utterances[i].entities[0].start)}<b tabindex="0" data-toggle="popover" data-trigger="focus" title="Entity details for (${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].start,myUtterances.utterances[i].entities[0].end)})" data-content="(${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].start,myUtterances.utterances[i].entities[0].end)}) belongs to entity: (${myUtterances.utterances[i].entities[0].name}). \nFor information about this entity, please see Entities Tab." style = "color:Indigo; background-color:#ecf87f; padding:1px;">${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].start,myUtterances.utterances[i].entities[0].end)}</b>${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].end, myUtterances.utterances[i].entities[1].start)}<b tabindex="0" data-toggle="popover" data-trigger="focus" title="Entity details for (${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[1].start,myUtterances.utterances[i].entities[1].end)})" data-content="(${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[1].start,myUtterances.utterances[i].entities[1].end)}) belongs to entity: (${myUtterances.utterances[i].entities[1].name}). \nFor information about this entity, please see Entities Tab." style = "color:#013a20; background-color:#b1d8b7; padding:1px;">${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[1].start,myUtterances.utterances[i].entities[1].end)}</b>${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[1].end)}`
          }
            else if (myUtterances.utterances[i].entities[0]){
            myUtterances.utterances[i].text = `${myUtterances.utterances[i].text.substring(0,myUtterances.utterances[i].entities[0].start)}<b tabindex="0" data-toggle="popover" data-trigger="focus" title="Entity details for (${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].start,myUtterances.utterances[i].entities[0].end)})" data-content="(${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].start,myUtterances.utterances[i].entities[0].end)}) belongs to entity: (${myUtterances.utterances[i].entities[0].name}). \nFor information about this entity, please see Entities Tab." style = "color:Indigo; background-color:#ecf87f; padding:1px;">${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].start,myUtterances.utterances[i].entities[0].end)}</b>${myUtterances.utterances[i].text.substring(myUtterances.utterances[i].entities[0].end)}`
          }
        }
      if (!deleteArr.includes(delName)){
        if (myUtterances.utterances[i].intent){
          if (myUtterances.utterances[i].traits[0]){
            traits = ""
            for ( rt = 0 ; rt < myUtterances.utterances[i].traits.length; rt++){
              traits += `${myUtterances.utterances[i].traits[rt].name}, `
            }
            traits = traits.substring(0,traits.length-2)
            mainP += `<tr><td><b>${myUtterances.utterances[i].text}</b/><br>Intent: <b style="color:#000080; background-color: #DBF3FA; padding:0.5px;">${myUtterances.utterances[i].intent.name}</b>.  Traits:<b> ${traits}</b>.</td><td align="center"><button type="button" class="btn btn-danger" onclick="deleteUtterance1('${delName}')">Delete</button></td>`
          } else {
            mainP += `<tr><td><b>${myUtterances.utterances[i].text}</b/><br>Intent: <b style="color:#000080; background-color: #DBF3FA; padding:0.5px;">${myUtterances.utterances[i].intent.name}</b></td><td align="center"><button type="button" class="btn btn-danger" onclick="deleteUtterance1('${delName}')">Delete</button></td>`
          }
        } else {
          if (myUtterances.utterances[i].traits[0]){
            traits = ""
            for ( rt = 0 ; rt < myUtterances.utterances[i].traits.length; rt++){
              traits += `${myUtterances.utterances[i].traits[rt].name}, `
            }
            traits = traits.substring(0,traits.length-2)
            mainP += `<tr><td><b>${myUtterances.utterances[i].text}</b/><br>Intent: <b>Out of Scope</b>.  Traits:<b> ${traits}</b>.</td><td align="center"><button type="button" class="btn btn-danger" onclick="deleteUtterance1('${delName}')">Delete</button></td>`
          } else {
            mainP += `<tr><td><b>${myUtterances.utterances[i].text}</b/><br>Intent: <b>Out of Scope</b/</td><td align="center"><button type="button" class="btn btn-danger" onclick="deleteUtterance1('${delName}')">Delete</button></td>`
          }
        }
      }
    }
    mainP += `</tr></tbody></table></div></div> </divMain>`
  }        
  else if (link === "traits"){
    document.title = "Botai | App Traits"
    $('#load22').show(); 
    $('divMain').replaceWith("<divMain></divMain>");      
    await fetch(`/traits?key=${pageData.wit_key.S}`)
    .then(response => response.json())
    .then(data => {
      if (data.traits){
        myTraits = data;
        $('#load22').hide(); 
      } else {
        ai_tab('traits')
      }
    })
    .catch((error) => {
      ai_tab('traits')
    });
    mainP = `<divMain><h2>App Traits</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the Traits we have for this App. You can add new or import built-in traits using the buttons below. Traits can be used to understand the user intent further, like sentiment analysis.</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-success" onclick="ai_tab('add_trait');">Add Trait</a><a class="btn btn-sm btn-info" onclick="ai_tab('built_traits');" style = "margin-left:15px;">Built-in Traits</a></div></div><hr><div class="container-fluid" style = "width:100%"><div class="table-responsive" id="tbl"><table class="table table-hover table-md" ><thead><tr><th>Trait:</th><th>Utterances:</th></tr></thead><tbody>`;
      for (i = 0 ; i < myTraits.traits.length ; i ++) {
        mainP += `<tr><td onclick="trait_data('${myTraits.traits[i].name}')"><b>${myTraits.traits[i].name}</b></td>`;
        var count = 0;
        for( j = 0 ; j < myTraits.utterances.length ; j++){
          for( n = 0 ; n < myTraits.utterances[j].traits.length ; n++){
            if(myTraits.utterances[j].traits[n]){
              if (myTraits.utterances[j].traits[n].name === myTraits.traits[i].name){
                count ++;
              }
            }
          }
        }
        if (count == 0){
          mainP +=`<td style="color:res"><b>none<b></td>`
        } else {
          mainP +=`<td style="color:green"><b>${count}<b></td>`
        }
        mainP +=`<td align="center"><button type="button" class="btn btn-danger" onclick="deleteTrait1('${myTraits.traits[i].name}_+_${count}')">Delete</button></td>`
      }
      mainP += `</tr></tbody></table></div></div></divMain>`
  } 
  else if (link === "postURL"){
    document.title = "Botai | POST URL & Secret"
    var mainP = `<divMain><h2>App POST URL & Secret</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the URL where we will send the POST events, and the secret you will need to include in the reply to these events.</p><p>When your page receive a message or a user clicks a button, we will use the POST URL below to send you the event with NLP details. You will use your webhook to reply to this event with the secret.</p></div>`
    if (pageData.post_link.S === "" || !pageData.post_link.S.includes("http")){
      mainP += `<div class="form-group col-md-12"><div class="alert alert-danger" role="alert"><h4 class="alert-heading">Callback url is missing!</h4><p>You didn't add a valid URL. Please add one and a secret below. We use this URL to send the Page Messaging Events to your webhook. The Secret is used to reply back to these events.</p></div></div></div>`
    } else {
      if (pageData.post_secret.S === ""){
        mainP += `<div class="form-group col-md-12"><div class="alert alert-warning" role="alert"><h4 class="alert-heading">Secret is missing!</h4><p>We have the callback url, but we dont have the secret for the reply API. You need ths secret to send replies to users. Please create one below.</p></div></div></div>`
      } else {
        mainP += `<div class="form-group col-md-12"><div class="alert alert-success" role="alert"><h4 class="alert-heading">URL & Secret Received!</h4><p>We have the callback url, and the secret for the reply API. Now, you should be able to receive events and reply back to users using the reply API.</p></div></div></div>`
      }
    }
    mainP +=`<div>POST URL: <input type="url" id = "post_url" value="${pageData.post_link.S}"><button class="btn btn-primary btn-sm" onclick="updateFun('link')">Update</button><p id = "updateState2" style="color:green; margin-top:10px"></p><hr>App Secret: <input type="password" minlength="8" id = "app_secret" value="${pageData.post_secret.S}"><button class="btn btn-secondary btn-sm" onclick="displayFun()">Show / Hide</button><button  style="margin-left:15px;" class="btn btn-primary btn-sm" onclick="updateFun('secret')">Update</button><br><p id = "updateState" style="color:green; margin-top:10px"></p></div></divMain>`
  } 
  else if (link === "change_app"){
    document.title = "Botai | Change Wit App"
    var mainP = `<divMain><button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('wit_app')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button><h2>Change Wit App</h2><hr><div class="row"><div class="form-group col-md-12"><p>To change the current Wit App and use an App from your account, please enter the details below and click "Change App".</p></div>`
    mainP +=`</div><div>App ID: <input type="text" id = "app_id" value="${pageData.app_id.S}">App Token: <input type="password" id = "app_token" value="XXX${pageData.wit_key.S.substring(5,12)}XXX"><button class="btn btn-primary btn-md" style="margin-right:15px;" id="changeButton" onclick="changeApp()">Change App</button><button class="btn btn-info btn-md" onclick="displayFun2()">Show / Hide</button><p id = "updateState3" style="margin-top:10px"></p></div></divMain>`
  }
  else if(link === "import_app"){
    document.title = "Botai | Import Wit App"
    var mainP = `<divMain><button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('wit_app')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button><h2>Import Wit App</h2><hr><div class="row"><div class="form-group col-md-12"><p>You can import Wit App by uploading the data file in .zip format below. When you upload a new Wit App, we will create a new App and delete the existing App if it was created by us. Please export and download a copy of your App before you proceed if you need the current data.</p>`
    mainP +=`<input class="form-control-file" type="file" id="fileUpload" /><divImportMsg></divImportMsg><div class="d-flex justify-content-center"><button class="btn btn-primary btn-md" disabled onclick="importApp()" id = "imButton">Import App</button></div></div></divMain>`
  }
  else if(link === "export_app"){
    document.title = "Botai | Export Wit App"
    var mainP = `<divMain><button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('wit_app')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button><h2>Export Wit App</h2><hr><div class="row"><div class="form-group col-md-12"><p>To export the current Wit app, please click the button below. You will get a link to download the current App data.</p>`
    mainP +=`<divExportMsg><div class="d-flex justify-content-center"><button class="btn btn-primary btn-md" style="margin-top:20px;" onclick="exportApp()" id = "exButton">Export App</button></div></divExporttMsg></div></divMain>`
  }
  else if(link === "add_intent"){
    document.title = "Botai | Add Intent"
    var mainP = `<divMain><button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('intent')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button><h2>Add Intent</h2><hr><div class="row"><div class="form-group col-md-12"><p>To add a new intent, please enter the name below:</p></div>`
    mainP +=`</div><div>Intent Name: <input type="text" id = "intent_name" value=""><button class="btn btn-primary btn-md" style="margin-top:15px;" id = "addIntent" onclick="addIntent()">Add Intent</button><p id = "updateState4" style="margin-top:10px"></p></div></divMain>`
  }
  else if(link === "add_entity"){
    document.title = "Botai | Add Entity"
    var mainP = `<divMain><button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('entities')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button><h2>Add Entity</h2><hr><div class="row"><div class="form-group col-md-12"><p>To add a new entity, please fill the data below:</p></div>`
    mainP +=`</div><div>Entity Name: <input type="text" id = "entity_name" value=""><div class="custom-control custom-switch"><input checked type="checkbox" class="custom-control-input" id="keyword"><label class="custom-control-label" for="keyword">Keywords Lookup: (An entity that belongs to a predefined list.)</label></div><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="free_text"><label class="custom-control-label" for="free_text">Free-text Lookup: (An entity that does not belong to a predefined list.)</label></div><button class="btn btn-primary btn-md" style="margin-top:15px;" id = "addEntity" onclick="addEntity()">Add Entity</button><p id = "updateState5" style="margin-top:10px"></p></div></divMain>`
  }
  else if(link === "built_entity"){
    document.title = "Botai | Built-in Entities"
    var mainP = `<divMain><button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('entities')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button><h2>Built-in Entities</h2><hr><div class="row"><div class="form-group col-md-12"><p>To add a built-in entity, please select from the available options below. <b>Built-in entities can't be deleted!</b></p><hr><div class="d-flex justify-content-center"><h6 style="color:green; text-align: center;"><b>These are the built-in entities available on the wit.ai website.</b></h6></div><hr></div>`
    mainP +=`
    <div class="row row-cols-1 row-cols-sm-3">
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/age_of_person</h5>
        <p class="card-text">Captures the age of a person, pet or object. <br><b>Ex:</b> My <b style="background-color: skyblue; color:blue">{five year old}</b> son.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-age_of_person" onclick="builtEntity('wit/age_of_person');">
        Add</button> <b style="color:green" id = confirm-age_of_person></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/agenda_entry</h5>
        <p class="card-text">Extrapolates typical agenda items from free text. <br><b>Ex:</b> I need to <b style="background-color: skyblue; color:blue">{go to dentist}</b></p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-agenda_entry" onclick="builtEntity('wit/agenda_entry');">
        Add</button> <b style="color:green" id = confirm-agenda_entry></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/amount_of_money</h5>
        <p class="card-text">Measures an amount of money. <br><b>Ex:</b> Book a <b style="background-color: skyblue; color:blue">{30 Euros}</b> train ticket</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-amount_of_money" onclick="builtEntity('wit/amount_of_money');">
        Add</button> <b style="color:green" id = confirm-amount_of_money></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/creative_work</h5>
        <p class="card-text">Captures and resolves creative work including movies, TV shows, music albums and tracks. <br><b>Ex:</b> I want to watch <b style="background-color: skyblue; color:blue">{back to the future}</b></p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-creative_work" onclick="builtEntity('wit/creative_work');">
        Add</button> <b style="color:green" id = confirm-creative_work></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/datetime</h5>
        <p class="card-text">Captures and resolves date and time, like tomorrow at 6pm. <br><b>Ex:</b> I was born <b style="background-color: skyblue; color:blue">{at 9:27pm on December 4th, 1990}</b>.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-datetime" onclick="builtEntity('wit/datetime');">
        Add</button> <b style="color:green" id = confirm-datetime></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/distance</h5>
        <p class="card-text">Captures a distance in miles or kilometers such as 5km, 5 miles and 12m. <br><b>Ex:</b> I ran for <b style="background-color: skyblue; color:blue">{5 miles}</b>.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-distance" onclick="builtEntity('wit/distance');">
        Add</button> <b style="color:green" id = confirm-distance></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/duration</h5>
        <p class="card-text">Captures a duration such as 30min, 2 hours or 15sec and normalizes the value in seconds. <br><b>Ex:</b> Start a timer for <b style="background-color: skyblue; color:blue">{45 seconds}</b>.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-duration" onclick="builtEntity('wit/duration');">
        Add</button> <b style="color:green" id = confirm-duration></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/email</h5>
        <p class="card-text">Captures an email but do not try to check the validity of the email. <br><b>Ex:</b> Contact me at <b style="background-color: skyblue; color:blue">{contact@wit.ai}</b></p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-email" onclick="builtEntity('wit/email');">
        Add</button> <b style="color:green" id = confirm-email></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/local_search_query</h5>
        <p class="card-text">Captures free text that's a query for a local search. <br><b>Ex: When </b><b style="background-color: skyblue; color:blue">{Philz Coffee}</b> open?</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-local_search_query" onclick="builtEntity('wit/local_search_query');">
        Add</button> <b style="color:green" id = confirm-local_search_query></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/location</h5>
        <p class="card-text">Captures free text that's a typical location, place or address. <br><b>Ex:</b> Find a house in <b style="background-color: skyblue; color:blue">{Palo Alto, CA}</b></p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-location" onclick="builtEntity('wit/location');">
        Add</button> <b style="color:green" id = confirm-location></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/math_expression</h5>
        <p class="card-text">Captures free text that's a mathematical, computable expression <br><b>Ex:</b> What is <b style="background-color: skyblue; color:blue">{4+6}</b>?</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-math_expression" onclick="builtEntity('wit/math_expression');">
        Add</button> <b style="color:green" id = confirm-math_expression></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/notable_person</h5>
        <p class="card-text">Captures and resolves names of notable people and public figures. <br><b>Ex:</b> Who is <b style="background-color: skyblue; color:blue">{Donald Glover}</b>?</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-notable_person" onclick="builtEntity('wit/notable_person');">
        Add</button> <b style="color:green" id = confirm-notable_person></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/number</h5>
        <p class="card-text">Extrapolates a number from free text. <br><b>Ex:</b> Book <b style="background-color: skyblue; color:blue">{10}</b> tickets.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-number" onclick="builtEntity('wit/number');">
        Add</button> <b style="color:green" id = confirm-number></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/ordinal</h5>
        <p class="card-text">Captures the measure of an ordinal number, such as first, second, third <br><b>Ex:</b> Read me the <b style="background-color: skyblue; color:blue">{first}</b> email.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-ordinal" onclick="builtEntity('wit/ordinal');">
        Add</button> <b style="color:green" id = confirm-ordinal></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/phone_number</h5>
        <p class="card-text">Captures phone numbers, but does not try to check the validity of the number. <br><b>Ex:</b> Book <b style="background-color: skyblue; color:blue">{10}</b> tickets.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-phone_number" onclick="builtEntity('wit/phone_number');">
        Add</button> <b style="color:green" id = confirm-phone_number></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/phrase_to_translate</h5>
        <p class="card-text">Captures free text that is a phrase the user wants to translate. <br><b>Ex:</b> How do you say <b style="background-color: skyblue; color:blue">{good evening}</b> in spanish?</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-phrase_to_translate" onclick="builtEntity('wit/phrase_to_translate');">
        Add</button> <b style="color:green" id = confirm-phrase_to_translate></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/quantity</h5>
        <p class="card-text">Captures the quantity of something; such as ingredients in recipes, or quantities of food for health tracking apps. <br><b>Ex:</b> How many grams in <b style="background-color: skyblue; color:blue">{two cups of flour}</b>?</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-quantity" onclick="builtEntity('wit/quantity');">
        Add</button> <b style="color:green" id = confirm-quantity></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/reminder</h5>
        <p class="card-text">Captures free text that's a typical reminder, such as buy some milk. <br><b>Ex:</b> Remind me to <b style="background-color: skyblue; color:blue">{buy some milk}</b>.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-reminder" onclick="builtEntity('wit/reminder');">
        Add</button> <b style="color:green" id = confirm-reminder></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/search_query</h5>
        <p class="card-text">Captures free text that's a generic search engine query. <br><b>Ex:</b> Search for <b style="background-color: skyblue; color:blue">{things to do in Seattle}</b>.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-search_query" onclick="builtEntity('wit/search_query');">
        Add</button> <b style="color:green" id = confirm-search_query></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/url</h5>
        <p class="card-text">Captures an URL, but does not try to check the validity of the URL. <br><b>Ex:</b> Go to <b style="background-color: skyblue; color:blue">{www.wit.ai}</b>.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-url" onclick="builtEntity('wit/url');">
        Add</button> <b style="color:green" id = confirm-url></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/volume</h5>
        <p class="card-text">Captures measures of volume like 250 ml, 3 gal. <br><b>Ex:</b> Fill up <b style="background-color: skyblue; color:blue">{250 ml}</b>.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-volume" onclick="builtEntity('wit/volume');">
          Add</button> <b style="color:green" id = confirm-volume></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/wikipedia_search_query</h5>
        <p class="card-text">Captures free text that's a typical query for Wikipedia. <br><b>Ex:</b> Search for <b style="background-color: skyblue; color:blue">{Frederick Douglass}</b> wikipedia.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-wikipedia_search_query" onclick="builtEntity('wit/wikipedia_search_query');">
        Add</button> <b style="color:green" id = confirm-wikipedia_search_query></b>
      </div>
    </div>
    </div>
    <div class="col-sm" style="margin-bottom: 15px;">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">wit/wolfram_search_query</h5>
        <p class="card-text">Captures free text that's a typical query for Wolfram Alpha. <br><b>Ex:</b> Look for the  <b style="background-color: skyblue; color:blue">{distance between the Earth and the Moon}</b>.</p>
        <button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-wolfram_search_query" onclick="builtEntity('wit/wolfram_search_query');">
        Add</button> <b style="color:green" id = confirm-wolfram_search_query></b>
      </div>
    </div>
    </div>
    </div></div>`
  }
  else if(link === "add_trait"){
    document.title = "Botai | Add Trait"
    var mainP = `<divMain><button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('traits')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button><h2>Add Trait</h2><hr><div class="row"><div class="form-group col-md-12"><p>To add a new trait, please fill the data below:</p></div>`
    mainP +=`</div><div>Trait Name: <input type="text" placeholder="Type the trait name." id = "trait_name" value="">Trait Values: <input type="text" placeholder="Type values separated by slash. EX: one/two/three" id = "trait_values" value=""><button class="btn btn-primary btn-md" style="margin-top:15px;" id = "addTrait" onclick="addTrait()">Add Trait</button><p id = "updateState6" style="margin-top:10px"></p></div></divMain>`
  }
  else if(link === "built_traits"){
    document.title = "Botai | Built-in Traits"
    var mainP = `<divMain><button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('traits')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button><h2>Built-in Traits</h2><hr><div class="row"><div class="form-group col-md-12"><p>To add a built-in trait, please select from the available options below.</p><hr><div class="d-flex justify-content-center"><h6 style="color:green"; text-align: center;><b>These are the built-in traits available on the wit.ai website.</b></h6></div><hr></div>`
    mainP +=`<div class="row row-cols-1 row-cols-sm-3"><div class="col-sm" style="margin-bottom: 15px;"><div class="card"><div class="card-body"><h5 class="card-title">wit/bye</h5><p class="card-text">A binary trait that captures goodbye intents. <br><b>Ex:</b><b style="background-color: skyblue; color:blue">{Bye}</b>!</p><button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-bye" onclick="builtTrait('wit/bye');">Add</button> <b style="color:green" id = confirm-bye></b></div></div></div><div class="col-sm" style="margin-bottom: 15px;"><div class="card"><div class="card-body"><h5 class="card-title">wit/greetings</h5><p class="card-text">A binary trait that captures greeting intents. <br><b>Ex:</b><b style="background-color: skyblue; color:blue">{Hello}</b>!</p><button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-greetings" onclick="builtTrait('wit/greetings');">Add</button> <b style="color:green" id = confirm-greetings></b></div></div></div><div class="col-sm" style="margin-bottom: 15px;"><div class="card"><div class="card-body"><h5 class="card-title">wit/on_off</h5><p class="card-text">A trait that deciphers the intent of toggling something (e.g. a device with 2 states), such as turning on the lights, turn the tv off or toggle the shades. <br><b>Ex:</b> Turn <b style="background-color: skyblue; color:blue">{on}</b> the light.</p><button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-on_off" onclick="builtTrait('wit/on_off');">Add</button> <b style="color:green" id = confirm-on_off></b></div></div></div><div class="col-sm" style="margin-bottom: 15px;"><div class="card"><div class="card-body"><h5 class="card-title">wit/sentiment</h5><p class="card-text">A trait that captures the sentiment in an utterance and returns positive, neutral or negative. <br><b>Ex:</b><b style="background-color: skyblue; color:blue">{Have an awesome day}</b>!</p><button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-sentiment" onclick="builtTrait('wit/sentiment');">Add</button> <b style="color:green" id = confirm-sentiment></b></div></div></div><div class="col-sm" style="margin-bottom: 15px;"><div class="card"><div class="card-body"><h5 class="card-title">wit/thanks</h5><p class="card-text">A binary trait that captures thankful intents, such as thank you. <br><b>Ex:</b><b style="background-color: skyblue; color:blue">{Thanks}</b>!</p><button type="button" class="btn btn-primary btn-md" style="margin-bottom:-10px" id = "add-thanks" onclick="builtTrait('wit/thanks');">Add</button> <b style="color:green" id = confirm-thanks></b></div></div></div></div></div>`
  }
  else if(link === "add_utterance"){
    document.title = "Botai | Add Utterance"
    var mainP = `<divMain><button class="btn btn-info btn-sm" type="button" onclick = "ai_tab('utterances')" style ="margin-bottom:15px;"><span class="fas fa-chevron-left" aria-hidden="true"></span> Back</button><h2>Add Utterance</h2><hr><div class="row"><div class="form-group col-md-12"><p>To add a new utterance, type the utterance text below. You can click "Test Wit App" to check and validate the current training, or manually enter the details without testing. To add entity, select the text and choose the entity name for this highlighted text. You can add up to <b>4</b> entities and <b>2</b> traits per utterance.</p><div class="row"><div class="col-sm-9"> Utterance Text: <input type="text" aria-describedby="utterance_name" id = "utterance_name" value=""></div><div class="col-sm-3 my-auto" > <button class="btn btn-info btn-md" id = "testUtt" onclick = "testUtt()">Test Wit App</button></div></div><div style="margin-top:20px;">Intent: <select id="intents" name="intents"><option checked value= "out_of_scope" > --- Out of Scope --- </option>`
    for (i = 0 ; i < myIntents.intents.length ; i ++) {
      mainP += `
        <option value="${myIntents.intents[i].name}">${myIntents.intents[i].name}</option>`
    }
    mainP += `</select></div></div></div><div class="row"><div class="col-sm-6"><div class="alert alert-success" role="alert" id = "en1" style="display:none"><button type="button" onclick = "closeMe('1')" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button><p style = "color:green; font-size: 120%;"><b id = "entity1"></b></p><select id = "ent1" class="form-control form-control-sm">`
    if (myEntities.entities.length === 0){
      mainP += `<option checked value= "nothing" > --- Please add entities first! --- </option>`
    } else {
      for (i = 0 ; i < myEntities.entities.length ; i ++) {
        mainP += `
        <option value="${myEntities.entities[i].name}">${myEntities.entities[i].name}</option>`
      }
    } 
    mainP +=`</select></div></div><div class="col-sm-6"><div class="alert alert-primary" role="alert" id = "en2" style="display:none"><button type="button" onclick = "closeMe('2')" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button><p style = "color:blue; font-size: 120%;"><b id = "entity2"></b></p><select id = "ent2" class="form-control form-control-sm">`
    if (myEntities.entities.length === 0){
      mainP += `<option checked value= "nothing" > --- Please add entities first! --- </option>`
    } else {
      for (i = 0 ; i < myEntities.entities.length ; i ++) {
        mainP += `
        <option value="${myEntities.entities[i].name}">${myEntities.entities[i].name}</option>`
      }
    }
    mainP +=`</select></div></div></div><div class="row"><div class="col-sm-6"><div class="alert alert-info" role="alert" id = "en3" style="display:none"><button type="button" onclick = "closeMe('3')" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button><p style = "color:sky-blue; font-size: 120%;"><b id = "entity3"></b></p><select id = "ent3" class="form-control form-control-sm">`
    if (myEntities.entities.length === 0){
      mainP += `<option checked value= "nothing" > --- Please add entities first! --- </option>`
    } else {
      for (i = 0 ; i < myEntities.entities.length ; i ++) {
        mainP += `
        <option value="${myEntities.entities[i].name}">${myEntities.entities[i].name}</option>`
      }
    }
    mainP +=`</select></div></div><div class="col-sm-6"><div class="alert alert-secondary" role="alert" id = "en4" style="display:none"><button type="button" onclick = "closeMe('4')" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button><p style = "color:gray; font-size: 120%;"><b id = "entity4"></b></p><select id = "ent4" class="form-control form-control-sm">`
    if (myEntities.entities.length === 0){
      mainP += `<option checked value= "nothing" > --- Please add entities first! --- </option>`
    } else {
      for (i = 0 ; i < myEntities.entities.length ; i ++) {
        mainP += `
        <option value="${myEntities.entities[i].name}">${myEntities.entities[i].name}</option>`
      }
    }
    mainP +=`</select></div></div></div><h5 id = "utterance_description"></h5><h5 id = "warning_four"></h5><div class="custom-control custom-switch" id="mTrait1"><input type="checkbox" class="custom-control-input" onchange="trainWTrait('1');" id="fTrait"><label class="custom-control-label" for="fTrait">Add Trait</label></div><div class="custom-control custom-switch" id="mTrait2" style="display:none; margin-top:8px; margin-bottom:15px;"><input type="checkbox" class="custom-control-input" onchange="trainWTrait('2');" id="sTrait"><label class="custom-control-label" for="sTrait">Second Trait</label></div></div><div class = "row"><div class="col-sm-6"><divT1></divT1></div><div class="col-sm-6"><divT2></divT2></div></div><button class="btn btn-primary btn-md" style="margin-top:15px;" id = "addUtterance" onclick = "addUtterance()" id="addUtterance">Add Utterance</button><p id = "updateState7" style="margin-top:10px"></p></div></divMain>`
  }
  else if (link === "sendEvents"){
    document.title = "Botai | Sent Events"
    mainP = `<divMain><h2>App Sent Events</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the event you sent as a reply to the POST events. Each event include the number of messages sent and the state for each.</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-info" onclick='refreshData("sendEvents")'>Refresh</a></div><hr><div class="container-fluid" style = "width:100%">`;
    for (i = 1 ; i < pageData.sent_list.L.length; i++){
      mainP += `<div class="alert alert-success" role="alert"><div class="table-responsive" id="tbl"><table class="table table-hover"><thead><h5><b>${pageData.sent_list.L[i].S} (${pageData.sent.M[pageData.sent_list.L[i].S].L[3].L[0].L[0].L[0].S})</b></h5></thead><tbody><tr><th scope="row">To user</th><td>${pageData.sent.M[pageData.sent_list.L[i].S].L[0].S}</td></tr><tr><th scope="row">Timestamp</th><td>${pageData.sent.M[pageData.sent_list.L[i].S].L[1].S}</td></tr><th scope="row">Trigger Event</th><td>${pageData.sent.M[pageData.sent_list.L[i].S].L[2].S}</td></tr> `
      pers = pageData.sent.M[pageData.sent_list.L[i].S].L[3].L[0].L[0].L[1].S;
      if (pers && pers !== "null"){
        mainP +=`
        <tr><th scope="row">Persona ID</th><td>${pageData.sent.M[pageData.sent_list.L[i].S].L[3].L[0].L[0].L[1].S}</td></tr>`
      } else {
        mainP +=`<tr><th scope="row">Persona ID</th><td>Default</td></tr>`
      }
      mainP += `<tr><th scope="row">Responses count</th><td>${pageData.sent.M[pageData.sent_list.L[i].S].L[3].L[0].L.length}</td></tr>`
      var y = 0;
      var t = ""
      for (k = 0 ; k < pageData.sent.M[pageData.sent_list.L[i].S].L[3].L[0].L.length ; k++){
        if (pageData.sent.M[pageData.sent_list.L[i].S].L[3].L[0].L[k].L[2].S !== "success"){
          if (pageData.sent.M[pageData.sent_list.L[i].S].L[3].L[0].L[k].L[2].S === "total_fail"){
            y++;
            t = "Primary and secondary failed."
          } else if (pageData.sent.M[pageData.sent_list.L[i].S].L[3].L[0].L[k].L[2].S === "replaced"){
            y++;
            t = "Response Replaced with secondary."
          } else {
            y++;
            t = "Failed and missing secondary response."
          }
        }
      }
      if (y == 0){
        mainP +=`<tr><th scope="row">Responses state</th><td style="color:green">All went through!</td></tr></tbody></table></div></div>`
      } else {
        mainP +=`<tr><th scope="row">Responses state</th><td style="color:red">${y} ${t}</td></tr></tbody></table></div></div>`
      }
    }
    mainP += `</div></div></divMain>`
  }
  else if (link === "receivedEvents"){
    document.title = "Botai | Received Events"
    mainP = `<divMain><h2>App Received Events</h2><hr><div class="row"><div class="form-group col-md-12"><p>These are the event we received from yur page and sent it in POST events. Each event include the type of the messages, the value, and the identified intent if it's a text.</p><hr><div class="d-flex justify-content-center"><a class="btn btn-sm btn-info" onclick='refreshData("receivedEvents")'>Refresh</a></div><hr><div class="container-fluid" style = "width:100%">`;
    for (i = 1 ; i < pageData.received_list.L.length; i++){
      mainP += `<div class="alert alert-success" role="alert"><div class="table-responsive" id="tbl"><table class="table table-hover"><thead><h5><b>${pageData.received_list.L[i].S} (${pageData.received.M[pageData.received_list.L[i].S].L[2].S.toUpperCase()})</b></h5></thead><tbody><tr><th scope="row">From user</th><td>${pageData.received.M[pageData.received_list.L[i].S].L[0].S}</td></tr><tr><th scope="row">Timestamp</th><td>${pageData.received.M[pageData.received_list.L[i].S].L[1].S}</td></tr><tr><th scope="row">Value</th><td>${pageData.received.M[pageData.received_list.L[i].S].L[3].S}</td></tr>`;
      if (pageData.received.M[pageData.received_list.L[i].S].L[4].S !== "undefined" && pageData.received.M[pageData.received_list.L[i].S].L[4].S !== ""){
        var myNLP = JSON.parse(pageData.received.M[pageData.received_list.L[i].S].L[4].S)
        if (myNLP.intents[0]){
          mainP +=`<tr><th scope="row">Intent</th><td>${myNLP.intents[0].name}</td></tr>`
        } else {
          mainP +=`<tr><th scope="row">Intent</th><td>Out of Scope</td></tr>`
        }
      }
      if (pageData.received.M[pageData.received_list.L[i].S].L[6].S !== "undefined" && pageData.received.M[pageData.received_list.L[i].S].L[6].S !== ""){
        mainP += `<tr><th scope="row">Reply Status</th><td>Replied with ${pageData.received.M[pageData.received_list.L[i].S].L[5].S}. (Reply : #${pageData.received.M[pageData.received_list.L[i].S].L[6].S})</td></tr></tbody></table></div></div>`
      } else {
        mainP += `<tr><th scope="row">Reply Status</th><td style="color:red">Failed to Reply</td></tr></tbody></table></div></div>`
      }
    }
    mainP += `</div></div></divMain>`
  }
  else {
    mainP = `<divMain><h2>In progress</h2><hr><div class="row"><div class="form-group col-md-12"><p>We are working on this right now!</p><hr></divMain>`;
  }
  if (link === "import_app"){
        $('divMain').replaceWith(mainP);  
        fileUpload();
  }  
  else if (link === "built_entity"){
    $('divMain').replaceWith(mainP);  
    for (i = 0 ; i < myEntities.entities.length ; i ++) {
      if (myEntities.entities[i].name.includes("$")){
        myEntities.entities[i].name = myEntities.entities[i].name.split("$")[1]
      }
      if (document.getElementById(`add-${myEntities.entities[i].name}`)){
        document.getElementById(`add-${myEntities.entities[i].name}`).disabled = true;
        document.getElementById(`add-${myEntities.entities[i].name}`).innerHTML = "Exist";
      }
    }
  } 
  else if (link === "built_traits"){
    $('divMain').replaceWith(mainP);  
    for (i = 0 ; i < myTraits.traits.length ; i ++) {
      if (myTraits.traits[i].name.includes("$")){
        myTraits.traits[i].name = myTraits.traits[i].name.split("$")[1]
      }
      if (document.getElementById(`add-${myTraits.traits[i].name}`)){
        document.getElementById(`add-${myTraits.traits[i].name}`).disabled = true;
        document.getElementById(`add-${myTraits.traits[i].name}`).innerHTML = "Exist";
      }
    }
  }
  else if (link === "utterances"){
    $('divMain').replaceWith(mainP);      
    $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#tbl tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  }
  else if (link === "add_utterance"){
    current = "";
    enTrain1 = null; enTrain2 = null; enTrain3 = null; enTrain4 = null
    var uttSelected;
    $('divMain').replaceWith(mainP); 
    document.getElementById("utterance_name").focus();
    $( "#utterance_name" ).select (function(da) {
      uttSelected = document.getElementById("utterance_name").value.substring(da.currentTarget.selectionStart, da.currentTarget.selectionEnd)
    });
    refreshIntervalId = setInterval(function(){ 
      if (document.getElementById("utterance_name")){
      if (uttSelected && document.getElementById("utterance_name").value.includes(uttSelected) && uttSelected.toString() !== ""){
        if (enTrain1 == null) {
          start = document.getElementById("utterance_name").value.indexOf(uttSelected)
          end = start + uttSelected.length
          enTrain1 = {start:start, end : end, body:uttSelected.toString()}
          current = uttSelected.toString()
          $('#en1').show("fast");
          document.getElementById("entity1").innerHTML = uttSelected
          uttSelected = null;
        } else if (enTrain2 == null && current !== uttSelected.toString()){
          current = uttSelected.toString()
          start = document.getElementById("utterance_name").value.indexOf(uttSelected)
          end = start + uttSelected.length
          enTrain2 = {start:start, end : end, body:uttSelected.toString()}
          $('#en2').show("fast");
          document.getElementById("entity2").innerHTML = uttSelected
          uttSelected = null;
        } else if (enTrain3 == null && current !== uttSelected.toString()){
          current = uttSelected.toString()
          start = document.getElementById("utterance_name").value.indexOf(uttSelected)
          end = start + uttSelected.length
          enTrain3 = {start:start, end : end, body:uttSelected.toString()}
          $('#en3').show("fast");
          document.getElementById("entity3").innerHTML = uttSelected
          uttSelected = null;
        } else if (enTrain4 == null && current !== uttSelected.toString()){
          start = document.getElementById("utterance_name").value.indexOf(uttSelected)
          end = start + uttSelected.length
          enTrain4 = {start:start, end : end, body:uttSelected.toString()}
          current = uttSelected.toString()
          $('#en4').show("fast");
          document.getElementById("entity4").innerHTML = uttSelected
          uttSelected = null;
        } else if (enTrain1 != null && enTrain2 != null && enTrain3 != null && enTrain4 != null && current !== uttSelected.toString()){
          current = uttSelected.toString()
          document.getElementById("warning_four").innerHTML = "<b style = 'color:red'> Only 4</b>"
          uttSelected = null;
        }
      } else {
        uttSelected = getSelectedText();
      }
      if (!document.getElementById("utterance_name").value.includes(document.getElementById("entity1").innerHTML)){
        closeMe('1')
      }
      if (!document.getElementById("utterance_name").value.includes(document.getElementById("entity2").innerHTML)){
        closeMe('2')
      }
      if (!document.getElementById("utterance_name").value.includes(document.getElementById("entity3").innerHTML)){
        closeMe('3')
      }
      if (!document.getElementById("utterance_name").value.includes(document.getElementById("entity4").innerHTML)){
        closeMe('4')
      }}
     }, 300);
  }
  else {
    $('divMain').replaceWith(mainP);      
  }
}