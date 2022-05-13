///////////////////////////////////////////////////////////////////////
//////////////////////// Libraries & Functions ////////////////////////
///////////////////////////////////////////////////////////////////////
// Node.js Libraries
const express = require('express'),
bodyParser = require('body-parser'),
path = require("path"),
session = require('express-session'),
CryptoJS = require("crypto-js"),
fs = require("fs"),
rp = require('request-promise'),
multer  = require('multer'),
https  = require('https'),
mysql = require('mysql'),
axios = require('axios'),
/// Facebook API Fuctions ///
longToken = require("./local_modules/fbapi/long_token"),
pageInfo = require("./local_modules/fbapi/page_info"),
deleteClient = require("./local_modules/fbapi/delete_client"),
getUserData = require("./local_modules/fbapi/get_user_data"),
getClientImage = require("./local_modules/fbapi/get_client_image"),
readPageFeed = require("./local_modules/fbapi/read_page_feed"),
getImpact = require("./local_modules/fbapi/get_impact"),
getPagePicture = require('./local_modules/fbapi/get_page_picture'),
handleFeed = require('./local_modules/fbapi/handle_feed'),
/// DynamoDB Functions ///
createClientsTable = require("./local_modules/database/create_clients_table"),
createPagesTable = require('./local_modules/database/create_pages_table'),
getPages = require('./local_modules/database/get_page'),
updateComments = require('./local_modules/database/update_comments'),
resetUtterances = require('./local_modules/database/reset_utterances'),
getClients = require('./local_modules/database/get_clients'),
putPage = require('./local_modules/database/put_page'),
putClient = require('./local_modules/database/put_client'),
updatePage = require('./local_modules/database/update_page'),
updateClient = require('./local_modules/database/update_client'),
updateCurrentPage = require('./local_modules/database/update_current_page'),
updatePageResponses = require('./local_modules/database/update_page_responses'),
updateSecondaryResponse = require('./local_modules/database/update_secondary_response'),
updatePageState = require('./local_modules/database/update_page_state'),
updatePageIntent = require('./local_modules/database/update_page_intent'),
deleteResponse = require('./local_modules/database/delete_response'),
deleteClientPage = require('./local_modules/database/delete_client_page'),
deleteClientData = require('./local_modules/database/delete_client'),
deletePageData = require('./local_modules/database/delete_page'),
deleteIntentData = require('./local_modules/database/delete_intent'),
updatePageUtterances = require('./local_modules/database/update_page_utterances'),
/// Wit.ai Functions ///
exportApp = require ("./local_modules/wit/export_app"),
getApp = require("./local_modules/wit/get_app"),
postApp = require('./local_modules/wit/post_app'),
postIntent = require('./local_modules/wit/post_intent'),
postUtterances = require("./local_modules/wit/post_utterances"),
postTrait = require("./local_modules/wit/post_traits"),
postEntity = require("./local_modules/wit/post_entities"),
getUtterances = require("./local_modules/wit/get_utterances"),
getIntents = require("./local_modules/wit/get_intents"),
getEntities = require("./local_modules/wit/get_entities"),
getTraits = require("./local_modules/wit/get_traits"),
deleteUtterance = require("./local_modules/wit/delete_utterance"),
deleteIntent = require("./local_modules/wit/delete_intent"),
deleteApp = require("./local_modules/wit/delete_app"),
importApp = require ("./local_modules/wit/import"),
deleteEntity = require('./local_modules/wit/delete_entity'),
getEntity = require('./local_modules/wit/get_entity'),
deleteTrait = require('./local_modules/wit/delete_trait'),
getTrait = require('./local_modules/wit/get_trait'),
witResolve = require('./local_modules/wit/resolve'),
/// Messenger Functions ///
pageSubscribe = require("./local_modules/messenger/page_subscribe"),
passThread = require("./local_modules/messenger/pass_thread"),
whiteList = require("./local_modules/messenger/white_list"),
postGetStarted = require('./local_modules/messenger/post_get_started'),
getGetStarted = require('./local_modules/messenger/get_get_started'),
postPersistentMenu = require('./local_modules/messenger/post_persistent_menu'),
getPersistentMenu = require('./local_modules/messenger/get_persistent_menu'),
getGreeting = require('./local_modules/messenger/get_greeting'),
setGreeting = require('./local_modules/messenger/set_greeting'),
getAdmins = require('./local_modules/messenger/get_admins'),
getPersonas = require('./local_modules/messenger/get_personas'),
postPersonas = require('./local_modules/messenger/post_persona'),
getWhitelisted = require('./local_modules/messenger/get_whitelisted'),
deletePersonas = require('./local_modules/messenger/delete_personas'),
deletePersistentMenu = require('./local_modules/messenger/delete_persistent_menu'),
deleteGetStarted = require('./local_modules/messenger/delete_get_started'),
deleteGreeting = require('./local_modules/messenger/delete_greeting'),
callSendAPI = require("./local_modules/messenger/callSendAPI"),
firstMessages = require("./local_modules/messenger/first_handle_messages"),
firstPostbacks = require("./local_modules/messenger/first_handle_postbacks");
const mSetup = require("./local_modules/messenger/m_setup");
//////////////////////// External //////////////////////////
const price= require("./local_modules/external/price");
const price2= require("./local_modules/external/price2");
const send_msg = require("./local_modules/external/send_msg");
const send_img = require("./local_modules/external/send_img");
const save_img = require("./local_modules/external/save_img");
const fearIndex = require("./local_modules/external/fear_index");

//////////////////////////////////////////////////////////////
//////////////////////// The Main App ////////////////////////
//////////////////////////////////////////////////////////////
// Creating the App object in express. // Using bodyparser for JSON posts.
app = express(); app.use(bodyParser.json());
// Setting Views & Public Files folders. 
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// Using EJS engine to render pages.
app.set("view engine", "ejs");
// Using .env file
require('dotenv').config();
// // Setup the Messenger App callback URL.
mSetup();
// // Create database Tables.
createPagesTable();
createClientsTable();

// Using Express Session for login and cookie.
app.set('trust proxy', 1)
app.use(session({
  secret: `${process.env.KEY}`,
  name: 'botai',
	resave: true,
  saveUninitialized: true,
  cookie : {
    httpOnly: true,
    sameSite: 'Lax',
    secure: true,
    maxAge: 999990000,
    signed: true
  }
}));

// Multer for file upload.
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files/');
  },
  filename: function (req, file, cb) {
    req.session.witApp = `${req.session.userID}_${file.originalname}`;
    cb(null,  `${req.session.userID}_${file.originalname}`);
  }
})
var upload = multer({
  storage: storage
}).array("file", 1);


var refresh_time = 0
/////////////////////////////////////////////////////////
//////////////////  External Webhook  ///////////////////
/////////////////////////////////////////////////////////
app.post('/webbHooKy22', async function (request, response)  {
  response.sendStatus(200)
  if (request.body && request.body.message && request.body.message.text && request.body.message.text.includes('/') && request.body.message.text.length < 20){
    console.log(request.body.message.chat.id)
    console.log(request.body.message.from.first_name, request.body.message.text)
    let data = await witResolve(encodeURIComponent(request.body.message.text),'OGYC6INGADPQREDJSBIPVJMQKBWAHLMU')
    if (data.intents[0] && data.intents[0].name === "crypto_question"){
      for (let prop in data.entities) {
          if (data.entities[`${prop}`][0].value === "ALL"){
            await send_msg(request.body.message.chat.id,request.body.message.from.first_name,`عملات القناه\n\n/BTC\n/XRP\n/SXP\n/NEO\n/LUNA\n/TRX\n/EOS\n/BTT\n/XLM\n/ADA\n/ETH\n/PUNDIX\n/MATIC\n/LTC\n/STRAX\n/XEM\n/TLM\n/SOL\n/XEC\n/LAMB\n/GRT\n/SHIB\n/BLOK\n/Burency\n/KDA\n/XPR\n/DOT\n/TRB\n/XTZ\n/DENT\n/HOT\n/ONT\n/CHZ\n/FTM\n/SAND\n/ENS\n/MANA\n/TLOS\n/GLMR\n/AVAX\n------------------------------------\n١- قراءة تفاصيل كل عملة في الرسائل المثبتة منها محددة باهداف ومنها 10%من راس المال ومنها نحدد مبلغ معين\n ٢- عملات قطة العشا الموجودة في منصة gate والتي تبدأ ب خمسة -ستة-سبعة اصفار نحط فيها مبلا مبلغ بسيط من 10-30 دولار وننساها\n------------------------------------\nبالتوفيق للجميع🌹\n`)
            } else {
            let arr = ["AVAX","GLMR","MANA","TLOS","ENS","SAND","DOT","SOL","BTC","ETH","LUNA","XRP","LTC","ADA","MATIC","FTM","SXP","NEO","TRX","EOS","BTT","XLM","PUNDIX","STRAX","XEM","TLM","XEC","LAMB","GRT","SHIB","BLOK","BUY","KDA","XPR","TRB","XTZ","DENT","HOT","ONT","CHZ"]
            if (arr.includes(data.entities[`${prop}`][0].value)){
              let coin_data = await price(data.entities[`${prop}`][0].value)
              let coin_data2 = await price2(data.entities[`${prop}`][0].value)
              console.log(coin_data)
              let cPrice
              if (coin_data.data[`${data.entities[`${prop}`][0].value}`]){
                cPrice = coin_data.data[`${data.entities[`${prop}`][0].value}`]
              } else {
                cPrice = coin_data2.data[`${data.entities[`${prop}`][0].value}`].quote.USD.price
              }
              if (data.entities[`${prop}`][0].value === "SHIB" || data.entities[`${prop}`][0].value === "BTT"){
                cPrice = parseFloat(cPrice).toFixed(7)
              } else {
                cPrice = parseFloat(cPrice).toFixed(4)
              }
              await send_msg(request.body.message.chat.id,request.body.message.from.first_name,`- الرمز :${coin_data2.data[`${data.entities[`${prop}`][0].value}`].symbol}\n- الاسم :${coin_data2.data[`${data.entities[`${prop}`][0].value}`].name}\n- السعر الحالي (USD) :$${cPrice}\n- حجم التداول في ال 24 ساعه السابقه (USD) :$${coin_data2.data[`${data.entities[`${prop}`][0].value}`].quote.USD.volume_24h.toFixed(3)}\n- فرق السعر 24 ساعه (%) :${coin_data2.data[`${data.entities[`${prop}`][0].value}`].quote.USD.percent_change_24h.toFixed(3)}%\n- الماركت كاب (USD) :$${coin_data2.data[`${data.entities[`${prop}`][0].value}`].quote.USD.market_cap.toFixed(3)}\n`)
            } else if (data.entities[`${prop}`][0].value === "fear_index"){
              let fear_index = await fearIndex()
              let uTime = fear_index.data[0].time_until_update
              console.log(uTime, refresh_time)
              if (uTime > refresh_time){
                await save_img()
                await sleep(800)
              }
              refresh_time = uTime
              let next_update
              if (uTime > 3600){
                let hours = Math.floor((uTime/60)/60)
                let minutes = Math.floor((uTime-(hours*60*60))/60)
                next_update = `${hours} ساعه , ${minutes} دقيقه`
              } else if (uTime > 60){
                let minutes = Math.floor(uTime/60)
                let seconds = uTime - (minutes * 60)
                next_update = `${minutes} دقيقه , ${seconds} ثانيه`
              } else {
                next_update = `${uTime} ثانيه`
              }
              await send_msg(request.body.message.chat.id,request.body.message.from.first_name,`-  القيمه الحاليه : ${fear_index.data[0].value}\n- التصنيف : ${fear_index.data[0].value_classification}\n- التحديث القادم : ${next_update}\n`)
              await send_img(request.body.message.chat.id)
            } else {
              await send_msg(request.body.message.chat.id,request.body.message.from.first_name,`"${data.entities[`${prop}`][0].value}" ليست مدرجه ضمن عملات القناه \n`)
            }
          }
      }
    }
  }
})

const httpsAgent = new https.Agent({ keepAlive: true });

setInterval(async function() {
  if (httpsAgent.totalSocketCount > 0){
  } else {
    await sleep(5000)
    connect()
  }
}, 24000);

setTimeout(function(){
  connect()
}, 8000)

function connect(){
  const options = {
      host: 'api.twitter.com',
      port: 443,
      // path:'/2/tweets/search/stream/rules',
      path: '/2/tweets/search/stream?tweet.fields=created_at&expansions=author_id&user.fields=created_at',
      method: 'GET',
      agent: httpsAgent,
      headers: {
        'Connection':'keep-alive',
        'Authorization': `Bearer ${process.env.TW_TOKEN}`,
      }
  }
  const req = https.request(options, function (res) {
      console.log(`statusCode: ${res.statusCode}`)
      res.on('data', async function (d) {
        if (d.length > 10 && JSON.parse(d)){
          let data = JSON.parse(d)
          console.log(data)
          if (data && data.includes){
            console.log(data)
            let new_str = "";
            if (data.matching_rules[0].id === "1486783210549878800"){
              new_str += "Link: https://twitter.com/Crypto911Crypto\n\n"
            } else if (data.matching_rules[0].id === "1486783210549878803"){
              new_str += "Link: https://twitter.com/terra_money\n\n"
            } else if (data.matching_rules[0].id === "1486783210549878802"){
              new_str += "Link: https://twitter.com/Polkadot\n\n"
            }  else if (data.matching_rules[0].id === "1486783210549878801"){
              new_str += "Link: https://twitter.com/Wol2030\n\n"
            }  else if (data.matching_rules[0].id === "1486783210549878799"){
              new_str += "Link:  https://twitter.com/whale_alert\n\n"
            }
            if (data.data.text.includes('@')){
              for(let i = 0 ; i < data.data.text.length ; i++){
                if (data.data.text[i] === "@"){
                  link = ""
                  i++
                  while (data.data.text[i] !== " "){
                    link += data.data.text[i]
                    i++
                  }
                  i--
                  new_str += `(${link})`
                } else {
                        new_str += data.data.text[i]
                }
              }
              data.data.text = new_str;
            } else {
              new_str += data.data.text
              data.data.text = new_str;
            }
            send_msg('-1001717163864',"", `<u><b>${data.includes.users[0].name}</b></u> Just Twitted:\n${data.data.text}\n`)
            // -1001717163864
            // 1392230311
          }
        }
      })
  })
  req.on('error', async function (error) {
      console.error(error)
      await sleep(12000)
      connect()
  })
  req.end()
}

// React Sample
// Connect to MySQL database
const pool = mysql.createPool({
  connectionLimit: 80,
  host:'database-1.cfuiol0s5ewa.us-east-1.rds.amazonaws.com',
  user:'admin',
  password:"123.spekkle",
  database:'house'
})
// Function to get all the contacts from the database
function get_contact(res){
  var query = pool.query(`select * from phonebook;`);
  let result = []
  query
  .on('error', function(err) {
      res.send({data:"error",detail:err})
  })
  .on('result', async function(row) {
      result[result.length] = row
  })
  .on('end', async function() {
      res.send({data:result})
  });
}

// Endpoint to read the contacts
app.get('/read_contacts', function(req, res){
  get_contact(res)
})

// The main app page
app.get('/phonebook', function(req, res){
  res.sendFile(path.join(__dirname, "public" , 'pb', "index.html"));
})

// Endpoint to add contact
app.post('/add_contact', function(req, res){
  req.on('data', chunk => {
      let data = JSON.parse(chunk).data
      var query = pool.query(`insert into phonebook (first_name,last_name,phone,email,detail) values("${data.first_name}","${data.last_name}","${data.phone}","${data.email}","${data.detail}");`);
      query
      .on('error', function(err) {
          res.send({data:"error",detail:err})
      })
      .on('end', async function() {
          get_contact(res,"del")
      });
  })
})

// Endpoint to delete contact
app.post('/delete_contact', function(req, res){
  req.on('data', chunk => {
      let toDelete = {}
      toDelete = JSON.parse(chunk).data
      if (toDelete && toDelete.id){
          var query = pool.query(`delete from phonebook where id = "${toDelete.id}";`);
          query
          .on('error', function(err) {
              res.send({data:"error",detail:err})
          })
          .on('end', async function() {
              get_contact(res,"del")
          });
      } else {
          res.send({data:"error"})
      }
  })
})

// Endpoint to update contact
app.post('/edit_contact', function(req, res){
  req.on('data', chunk => {
      let toEdit = {}
      toEdit = JSON.parse(chunk).data
      if (toEdit && toEdit.id){
          var query = pool.query(`update phonebook SET first_name = "${toEdit.first_name}", last_name = "${toEdit.last_name}", phone = "${toEdit.phone}", email = "${toEdit.email}", detail = "${toEdit.detail}" where id = "${toEdit.id}";`);
          query
          .on('error', function(err) {
              res.send({data:"error",detail:err})
          })
          .on('end', async function() {
              get_contact(res,"del")
          });
      } else {
          res.send({error:"error"})
      }
  })
})

/////////////////////////////////////////////////////////////////
///////////////////////// Serving Files /////////////////////////
/////////////////////////////////////////////////////////////////
// The page profile picture.
app.get(`/image`, async function(request, response) {
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){  
    if (!fs.existsSync(`./files/img/${request.query.id}`)){
      data = await getPages(`${request.query.id}`);
      var bytes  = CryptoJS.AES.decrypt(data.Item.page_access_token.S, process.env.KEY);
      var token = bytes.toString(CryptoJS.enc.Utf8); 
      await getPagePicture(request.query.id, token)
      await sleep(800)
      response.sendFile(path.resolve(`files/img/${request.query.id}`));
    } else {
      response.sendFile(path.resolve(`files/img/${request.query.id}`));
    }
  } else {
    response.redirect("/");
  }
});

// The JavaScript source.
app.get(`/js_main`, async function(request, response) {
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    type = request.query.policy;
    response.sendFile(path.resolve(`source/js/${type}.js`));
  } else {
    response.redirect("/");
  }
});

app.get(`/api_docs`, async function(request, response) {
  response.render("api_docs",{logged:"nav-link"});
});
app.get(`/host_docs`, async function(request, response) {
  response.render("host_docs",{logged:"nav-link"});
});
app.get(`/get_started`, async function(request, response) {
  response.render("get_started",{logged:"nav-link"});
});

/////////////////////////////////////////////////////////////////
///////////////////////// The Web Pages /////////////////////////
/////////////////////////////////////////////////////////////////
// The home page.
app.get(`/terms`, async function(request, response) {
  if (request.session.userID){
    response.render("terms",{logged:"nav-link", type:""});
  } else {
    // If the user is not logged in!
    response.render("terms",{logged:"nav-link disabled", type:""});
  }
});

// The home page.
app.get(`/policy`, async function(request, response) {
  if (request.session.userID){
    // If the user is logged in, get the data.
    response.render("policy",{logged:"nav-link", type:""});
  } else {
    // If the user is not logged in!
    response.render("policy",{logged:"nav-link disabled", type:""});
  }
});

// The home page.
app.get(`/`, async function(request, response) {
  response.render("index");
});

// User status for menu customization
app.post(`/user_state`, async function (request, response){
  if (request.session.userID){
      // If the user is logged in.
      response.send({status:"logged_in"});
    } else {
      // If the user is not logged in!
      response.send({status:"logged_out"});
    }
  }
)



// The Dashboard page.
app.get(`/dashboard`, async function(request, response) {
  if (request.session.userID){
    response.render("dashboard",{logged:"nav-link"});
  // If the request isn't normal!
  } else {
    response.redirect("/");
  }
});

// Logout from the App
app.get(`/logout`, async function(request, response) {
  if (request.session.userID){
    request.session.destroy();
    response.render("logout",{logged:"nav-link disabled"});
  } else {
    response.redirect("/");
  }
});

// The settings page for the API Bot.
app.get(`/settings_api`, async function(request, response) {
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    response.render("settings_api",{logged:"nav-link", page_id:request.query.pID});
  } else {
      response.redirect("/dashboard");
  }
});

// The settings page for the Hosted Bot.
app.get(`/settings_hosted`, async function(request, response) {
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    response.render("settings_hosted",{logged:"nav-link", page_id:request.query.pID});
  } else {
      response.redirect("/dashboard");
  }
});

////////////////////////////////////////////////////////////////////
///////////////////////// Check & redirect /////////////////////////
////////////////////////////////////////////////////////////////////
// Check point after the user login with Facebook.
app.get(`/check`, async function(request, response) {
  // If the user is already logged in on our platform, redirect to dashboard.
  if (request.session.userID){
    response.redirect('/dashboard');
  // If the user isn't logged in on our platform, and logged in with Facebook.
  } else if (request.headers.referer && request.query.token && request.headers.referer.includes(process.env.URL.substring(8))){
    // login the user on the platform.
    request.session.loggedin = true;
    // Get the user long token and save information in the session data.
    var tok = await longToken(request.query.token);
    userData = await getUserData(request.query.userID, tok.access_token)
    request.session.token = tok.access_token;
    request.session.userID = request.query.userID;
    request.session.email = userData.email;
    request.session.userName = userData.name;
    response.redirect('/dashboard');
  // If the request isn't normal!
  } else {
    response.redirect("/");
  }
});

// The page settings check & redirect
app.get(`/page_setting`, async function(request, response) {
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    request.session.currentID = request.query.id;
    if(request.query.type && request.query.type.includes("api")){
      response.redirect(`/settings_api?pID=${request.query.id}`);
    } else if(request.query.type && request.query.type.includes("hosted")){
      response.redirect(`/settings_hosted?pID=${request.query.id}`);
    }
  } else {
    response.redirect("/");
  }
});

///////////////////////////////////////////////////////////////////////////
///////////////////////// Data sharing & excution /////////////////////////
///////////////////////////////////////////////////////////////////////////
// Dashboard user Data end point.
app.get(`/dashboard_data`, async function(request, response) {
  // If the user is logged in, run the function
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    data = await getClients(request.session.userID);
    if (data.Item && data.Item.pages_id){
      // If the user added some pages.
      var myBool = false;
      for (p = 1 ; p < data.Item.pages_id.L.length ; p++){
        if (data.Item.pages_id.L[p].S !== ""){
          myBool = true;
          p = data.Item.pages_id.L.length + 1;
        }
      }
      if (myBool == true){
        response.send({user_name: data.Item.user_name.S, pages:"full", msg:`your current pages are below:`, pages_name: data.Item.pages_name.L, pages_id: data.Item.pages_id.L, pages_language: data.Item.pages_language.L, pages_state: data.Item.pages_state.L, app_type: data.Item.app_type.L});
      } else {
        response.send({user_name: data.Item.user_name.S, pages:"none", msg:"you don't have any pages yet. You can add pages using the (Add / Remove Pages) button below."});
      }
      // update state if there was some issues.
      // If not, add the user to the database then redirect to dashboard.
    } else {
      await putClient(request.session.userID, request.session.userName, request.session.email);
      response.send({user_name:request.session.userName, pages:"none", msg:"you don't have any pages yet. You can add pages using the (Add / Remove Pages) button below."});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// The endpoint for the updated dashboard. // Updates the user data.
app.get(`/updated_data`, async function(request, response) {
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    // Update the token
    request.session.token = request.query.token;
    // Saving IDs to compare and adjust the data.
    var currentIDs = [];
    var newIDs = [];
    // Get the user data and save current page IDs
    currentPages = await getClients(request.session.userID);
    if (!currentPages.Item.update_state.S.includes("in progress")){
      await updateCurrentPage(request.session.userID, "update_state","updates in progress")
      for (p = 1 ; p < currentPages.Item.pages_id.L.length ; p++){
        if (currentPages.Item.pages_id.L[p].S !== ""){
          currentIDs[currentIDs.length] = currentPages.Item.pages_id.L[p].S;
        }
      }
      // Get the pages with current permissions from Facebook & update the long token.
      var tok2 = await longToken(request.session.token);
      request.session.token = tok2.access_token;
      var page_data = await pageInfo(request.session.userID, request.session.token);
      // Save the current count of pages to use for adding page index.    
      var n = currentPages.Item.pages_name.L.length;
      // Loop to add new pages after adjusting the permissions.
      for (i = 0 ; i < page_data.data.length ; i++){
        // If the page is new, update the client data and add new page data.
        if (!currentIDs.includes(page_data.data[i].id)) {
          var data = {page_id:page_data.data[i].id, page_name:page_data.data[i].name, page_category:page_data.data[i].category};
          await updateClient(request.session.userID, n, data);
          // Save IDs to create Wit App and to compare.
          newIDs[newIDs.length] = page_data.data[i].id;
          var encryptedToken = CryptoJS.AES.encrypt(page_data.data[i].access_token, process.env.KEY).toString();      
          var info = {page_index: n, page_name: page_data.data[i].name, page_id:page_data.data[i].id, page_access_token:encryptedToken};
          await putPage(info);
          n++;
        // If not New, add it in the new IDs to compare.
        } else {
          newIDs[newIDs.length] = page_data.data[i].id;
        }
      }

      // loop to delete Wit Apps and Page Data for removed pages.
      for ( o = 0 ; o < currentIDs.length ; o++){
        if (!newIDs.includes(currentIDs[o]) && currentIDs[o] !== ""){
          pageKeys = await getPages(currentIDs[o]);
          if (pageKeys.Item.wit_key.S !== ""){
            oldWitApp = await getApp(pageKeys.Item.app_id.S, pageKeys.Item.wit_key.S)
            if (oldWitApp.name === `${currentIDs[o]}`){
              await deleteApp(pageKeys.Item.app_id.S, pageKeys.Item.wit_key.S);
            }
          }
          await deleteClientPage(request.session.userID, pageKeys.Item.p_index.N)
          await deletePageData(currentIDs[o]);
        }
      }
      // end update restriction & send data.
      await updateCurrentPage(request.session.userID, "update_state","updates finished")
      response.send({success:"done"});
    } else {
      response.send({error:"not completed"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

///// End point to delete account and data.
app.get(`/delete_data`, async function(request, response) {
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    userID = request.session.userID;
    token = request.session.token;
    currentPages = await getClients(userID);
    if (!currentPages.Item.update_state.S.includes("in progress")){
      await updateCurrentPage(request.session.userID, "update_state","updates in progress")
      // Clear cookies, destroy user session and delete client data
      request.session.destroy();
      await deleteClient(userID, token);
      await deleteClientData(userID);
      // Delayed loop to delete Wit Apps and Pages Data.
      for (p = 1 ; p < currentPages.Item.pages_id.L.length ; p++){
        if(currentPages.Item.pages_state.L[p].S !== "deleted"){
        pageKeys = await getPages(currentPages.Item.pages_id.L[p].S);
        if (pageKeys.Item.wit_key.S !== ""){
          oldWitApp = await getApp(pageKeys.Item.app_id.S, pageKeys.Item.wit_key.S)
          if (oldWitApp.name === `${currentPages.Item.pages_id.L[p].S}`){
            await deleteApp(pageKeys.Item.app_id.S, pageKeys.Item.wit_key.S);
          }
        }
        await deletePageData(currentPages.Item.pages_id.L[p].S);
      }}
      response.send({process:"done", msg:"We deleted all your data and unsubscribed your pages!"});
    } else {
      response.send({nothing:"here"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Client Data end point.
app.get(`/client_data`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    data = await getClients(request.session.userID);
    if (data.Item){
        response.send({client_data: data});
  } else {
    response.send({nothing:"here"});
  }
} else {
  response.send({nothing:"here"});
}
});

// Page Data end point.
app.get(`/page_data`, async function(request, response) {
  // If the user is logged in, get the page data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
      client_data = await getClients(request.session.userID);
      data = await getPages(`${request.query.page_id}`);
      if (data.Item){
        response.send({page_data: data});
      } else {
        response.send({nothing:"here"});
      }
  } else {
    response.send({nothing:"here"});
  }
});

// Page Data end point.
app.post(`/add_response`, async function(request, response) {
  // If the user is logged in, get the page data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
     await updatePageResponses (`${request.query.page_id}`, `${request.query.response_name}`, `${request.query.assosiated_with}`, `${request.query.type}`, `${JSON.stringify(request.body)}`)
    if (request.body.secondaryResponse){      
      res1_b = {"persona_name":"Default", "response":request.body.secondaryResponse}
      await updateSecondaryResponse (`${request.query.page_id}`, "backup", `${request.query.assosiated_with}`, "backup", `${JSON.stringify(res1_b)}`)
    }
    data = await getPages (`${request.query.page_id}`)
    if (data){
      response.send({data:data})
    } else {
      response.send({bad:"one"})
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Page Data end point.
app.get(`/delete_response`, async function(request, response) {
  // If the user is logged in, get the page data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    state = await deleteResponse(`${request.query.page_id}`, `${request.query.response}`)
    data = await getPages (`${request.query.page_id}`)
    if (state){
      response.send({data:data})
    } else {
      response.send({bad:"one"})
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Page Data end point.
app.get(`/reply_comment`, async function(request, response) {
  // If the user is logged in, get the page data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    data = await getPages (`${request.query.page_id}`)
    var bytes  = CryptoJS.AES.decrypt(data.Item.page_access_token.S, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8); 
    res = data.Item.responses.M[`${request.query.reply}`].L[0].S;
    if (res.includes("{{user_first_name}}")){
      res = res.replace("{{user_first_name}}",data.Item.comments.M[`${request.query.comment_id}`].L[2].S)
    }
    res = JSON.parse(res)
    if (res.persona_id){
      persona_id = res.persona_id
    } else {
      persona_id = null
    }
    if (res.response[1]){
      responseSent = res.secondaryResponse[0].response;
    } else {
      responseSent = res.response[0].response;
    }
    st = await callSendAPI(null, responseSent, null, null, token, persona_id, request.query.comment_id);
    if (st.recipient_id){
      newData = {comment_id:request.query.comment_id,message:data.Item.comments.M[`${request.query.comment_id}`].L[0].S, from_id: data.Item.comments.M[`${request.query.comment_id}`].L[1].S, from_name:data.Item.comments.M[`${request.query.comment_id}`].L[2].S, post_id: data.Item.comments.M[`${request.query.comment_id}`].L[3].S, post_link:data.Item.comments.M[`${request.query.comment_id}`].L[5].S, reply_state:`replied_+_Manual_+_${data.Item.responses.M[`${request.query.reply}`].L[1].S}`}
      await updateComments (request.query.page_id, "add", newData)
      response.send({success:"good"});
    } else {
      if (res.secondaryResponse[0] && res.secondaryResponse[0].response){
        response = res.secondaryResponse[1].response;
        st2 = await callSendAPI(null, response, null, null, token, null, request.query.comment_id);
        if (st2.recipient_id){
          newData = {comment_id:request.query.comment_id,message:data.Item.comments.M[`${request.query.comment_id}`].L[0].S, from_id: data.Item.comments.M[`${request.query.comment_id}`].L[1].S, from_name:data.Item.comments.M[`${request.query.comment_id}`].L[2].S, post_id: data.Item.comments.M[`${request.query.comment_id}`].L[3].S, post_link:data.Item.comments.M[`${request.query.comment_id}`].L[5].S, reply_state:`replied_+_Manual_+_${data.Item.responses.M[`${request.query.reply}`].L[1].S} (Replaced)`}
          await updateComments (request.query.page_id, "add", newData)
          response.send({success:"good"});
        } else {
          response.send({fail:"bad"});
        }
      } else {
        response.send({fail:"bad"});
      }
    }
  } else {
    response.send({nothing:"here"});
  }
});

///// Post Request to add the App data and setup the App /////
app.post(`/last`, async function(request, response) {
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var clientData = await getClients(request.session.userID);
    if (!clientData.Item.update_state.S.includes("in progress")){
      await updateCurrentPage(request.session.userID, "update_state","updates in progress")  
      var data = await getPages(`${request.query.page_id}`);
      await updatePageState(request.session.userID, data.Item.p_index.N, request.body.lang, `${request.body.bot_type}`, `false`);
      var witKey = await postApp(`${request.query.page_id}`);
      if(witKey){
        await updatePage(`${request.query.page_id}`, "app_id", "wit_key", witKey.app_id, witKey.access_token, request.body.bot_type);
      } else {
        await updatePage(`${request.query.page_id}`, "errorthrow", "errorexist", "", "", request.body.bot_type);
      }
      var bytes  = CryptoJS.AES.decrypt(data.Item.page_access_token.S, process.env.KEY);
      var token = bytes.toString(CryptoJS.enc.Utf8); 
      var isImpact;
      var che = await getImpact(token)
      if (che.data[0]){
        isImpact = che.data[0].subject_to_new_eu_privacy_rules;
        if (isImpact == true){
          await updatePageState(request.session.userID, data.Item.p_index.N, request.body.lang, `${request.body.bot_type}`, `${isImpact}`);
        }
      }
      await pageSubscribe(`${request.query.page_id}`, token);
      res3 = {"persona_name":"Default", "response":[{"response":{
        "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic","elements": [
            {"title": "Product 1" , "subtitle":"Product Info","default_action": {"type": "web_url","url": "https://2eb8b3758710.ngrok.io","messenger_extensions": "false","webview_height_ratio": "full"},"buttons":[{"type":"web_url","url":"https://2eb8b3758710.ngrok.io","title":"Shop"},{"type":"web_url","url":"https://2eb8b3758710.ngrok.io","title":"Offers"}]},
            {"title": "Product 2" , "subtitle":"Product Info","default_action": {"type": "web_url","url": "https://2eb8b3758710.ngrok.io","messenger_extensions": "false","webview_height_ratio": "full"},"buttons":[{"type":"web_url","url":"https://2eb8b3758710.ngrok.io","title":"Shop"},{"type":"web_url","url":"https://2eb8b3758710.ngrok.io","title":"Offers"}]}
          ]
        }},
        "quick_replies":[{"content_type":"text","title":"Get Help","payload":"HELP"},{"content_type":"text","title":"Start Again","payload":"GET_STARTED"}]
      }}]}
      res2 = {"persona_name":"Default", "response":[{"response":{"text":"{{user_first_name}}, I am sorry, I cannot understand this!\nPlease try again or select from below:","quick_replies":[{"content_type":"text","title":"Get Help","payload":"HELP"},{"content_type":"text","title":"Start Again","payload":"GET_STARTED"}]}}]}
      res1 = {"persona_name":"Default", "response":[{"response":{"text":"{{user_first_name}}, welcome to our chatbot! This is default auto reply to comments."}}]}
      await updatePageResponses (`${request.query.page_id}`, "Default Response", "non_recognized", "", `${JSON.stringify(res3)}`, "Out of Scope Response", "out_of_scope",`${JSON.stringify(res2)}`, "Default Private Reply", "default_reply",`${JSON.stringify(res1)}`,`${isImpact}`)
      await updateCurrentPage(request.session.userID, "update_state","updates finished")
      response.send({client_data:clientData});
    } else {
      response.send({fail:"here"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Wit App info endpoint.
app.get(`/wit_app`, async function(request, response) {
  // If the user is logged in, get the page data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
      data = await getPages(`${request.query.page_id}`);
      witApp = await getApp(data.Item.app_id.S, data.Item.wit_key.S)
      if (witApp){
        response.send({wit_data: witApp});
      } else {
        response.send({nothing:"here"});
      }
  } else {
    response.send({nothing:"here"});
  }
});

// Wit App Utterances endpoint.
app.get(`/utterances`, async function(request, response) {
  // If the user is logged in, get the page data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    appUtterances = await getUtterances(request.query.key);
    if (data.Item){
      response.send({utterances: appUtterances});
    } else {
      response.send({nothing:"here"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Wit App intents endpoint.
app.get(`/intents`, async function(request, response) {
  // If the user is logged in, get the page data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    appIntents = await getIntents(request.query.key);
    appUtterances = await getUtterances(request.query.key);
    if (appIntents && appUtterances){
      response.send({intents: appIntents, utterances: appUtterances});
    } else {
      response.send({nothing:"here"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Wit App intents endpoint.
app.get(`/all`, async function(request, response) {
  // If the user is logged in, get the page data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    appIntents = await getIntents(request.query.key);
    appEntities = await getEntities(request.query.key);
    appUtterances = await getUtterances(request.query.key);
    appTraits = await getTraits(request.query.key);
    if (appIntents && appEntities && appUtterances){
      response.send({intents: appIntents, entities:appEntities, utterances: appUtterances, traits:appTraits});
    } else {
      response.send({nothing:"here"});
    }
  } else {
    response.send({nothing:"here"});
  }
});



// Wit App intents endpoint.
app.get(`/intent_entity`, async function(request, response) {
  // If the user is logged in, get the page data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    appIntents = await getIntents(request.query.key);
    appEntities = await getEntities(request.query.key);
    if (data.Item){
      response.send({intents: appIntents, entities:appEntities});
    } else {
      response.send({nothing:"here"});
    }
  } else {
    response.send({nothing:"here"});
  }
});


// Wit App entities endpoint.
app.get(`/entities`, async function(request, response) {
  // If the user is logged in, get the page data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    appEntities = await getEntities(request.query.key);
    appUtterances = await getUtterances(request.query.key);
    if (appEntities && appUtterances){
      response.send({entities: appEntities, utterances: appUtterances});
    } else {
      response.send({nothing:"here"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Wit App traits endpoint.
app.get(`/traits`, async function(request, response) {
  // If the user is logged in, get the page data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    appTraits = await getTraits(request.query.key);
    appUtterances = await getUtterances(request.query.key);
    if (appTraits && appUtterances){
      response.send({traits: appTraits, utterances: appUtterances});
    } else {
      response.send({nothing:"here"});
    } 
  } else {
    response.send({nothing:"here"});
  }
});

// Client Data end point.
app.get(`/post_update`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var check = true;
    try {
      body = {"test_msg":"This is a test request."}
      var options = {
        method: 'post',
        uri: `${request.query.data1}`,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      };
      await rp(options);
    } catch (e){
      check = false;
    }
    if (check == true){
      updatePage(request.query.page_id, "post_link", "post_secret", `${request.query.data1}`, `${request.query.data2}`)
      response.send({success:"done"});
    } else {
      response.send({failed:"not-valid"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Client Data end point.
app.get(`/update_wit`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    await resetUtterances (`${request.query.page_id}`)
    var newWitApp = await getApp(request.query.id2, request.query.token2)
    if (newWitApp && newWitApp.created_at){
      updatePage(`${request.query.page_id}`, "app_id", "wit_key", `${request.query.id2}`,`${request.query.token2}`);
      oldWitApp = await getApp(request.query.id1, request.query.token1)
      if (oldWitApp.name === `${request.query.page_id}`){
        await deleteApp(request.query.id1, request.query.token1);
      }
      response.send({success:"done"});
    } else {
      response.send({fail:"app not valid."});
    }
} else {
  response.send({nothing:"here"});
}
});

// Client Data end point.
app.post(`/import_app`, async function(request, response) {
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    await resetUtterances (`${request.query.page_id}`)
    upload(request, response, async function(err) {
      if (err) {
        response.send({failMsg:"Something went wrong during the file upload process. Please check the file and try again!"});
      } else {
        oldWitApp = await getApp(request.query.app_id, request.query.wit_key)
        if (oldWitApp.name === `${request.query.page_id}`){
          await deleteApp(request.query.app_id, request.query.wit_key);
        }
        witApp = await importApp(request.session.witApp, request.query.page_id);
        if (witApp && witApp.name) {
          await updatePage(`${request.query.page_id}`, "app_id", "wit_key", `${witApp.app_id}`,`${witApp.access_token}`);
          response.send({successMsg:"We deleted the old app and created a new app with the uploaded data.", app_id: witApp.app_id, app_token:witApp.access_token});
        } else {
          response.send({failMsg:"Something went wrong with the Wit server. Please try again shortly!"});
        }
      }
    });
  } else {
    response.send({nothing:"here"});
  }
});

// Client Data end point.
app.get(`/export_app`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    appLink = await exportApp(request.query.token)
    if (appLink && appLink.uri){
      response.send({sucess:"process success", url:appLink.uri});
    } else {
      response.send({fail:"no url"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Client Data end point.
app.get(`/delete_intent`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    await deleteIntent(request.query.intent, request.query.key)
      response.send({process:"done"});
  } else {
    response.send({nothing:"here"});
  }
});  

// Client Data end point.
app.get(`/add_intent`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    state = await postIntent(request.query.intent, request.query.key);
    if (state && state.id){
      response.send({success:"done"});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
});  

// Client Data end point.
app.get(`/delete_entity`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    ss = await deleteEntity(request.query.entity, request.query.key)
      response.send({process:"done"});
  } else {
    response.send({nothing:"here"});
  }
}); 

// Client Data end point.
app.get(`/add_entity`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var lookups = [];
    if(request.query.keyword){
      if (request.query.keyword === "true"){
        lookups[lookups.length] = '"keywords"';
      }
      if (request.query.free_text === "true"){
        lookups[lookups.length] = '"free-text"';
      }
      state = await postEntity(request.query.key, request.query.entity, lookups);

    } else {
      state = await postEntity(request.query.key, request.query.entity);
    }
    if (state && state.id){
      response.send({success:"done"});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
});  

// Client Data end point.
app.get(`/entity`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    state = await getEntity(request.query.name, request.query.key);
    if (state && state.name){
      response.send({entity:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
}); 

// Client Data end point.
app.get(`/delete_trait`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    await deleteTrait(request.query.trait, request.query.key)
      response.send({process:"done"});
  } else {
    response.send({nothing:"here"});
  }
});

// Client Data end point.
app.get(`/delete_utterance`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    await deleteUtterance(request.query.utterance, request.query.key)
    await updatePageUtterances(request.query.pageID, request.query.utterance, request.query.index, request.query.intent, "deleting")
    response.send({process:"done"});
  } else {
    response.send({nothing:"here"});
  }
});

// Client Data end point.
app.get(`/add_trait`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    if (request.query.values){
      values = request.query.values;
      values = values.split(/\s/).join('');
      values = values.split("/")
      newValues = []
      for (i = 0 ; i < values.length ; i++){
        newValues[i] = `"${values[i]}"`
      }
      state = await postTrait(request.query.key, request.query.trait, newValues);
    } else {
      state = await postTrait(request.query.key, request.query.trait, []);
    }
    if (state && state.id){
      response.send({success:"done"});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
});  

// Client Data end point.
app.get(`/trait`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    state = await getTrait(request.query.name, request.query.key);
    if (state && state.name){
      response.send({trait:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
}); 


// Client Data end point.
app.get(`/resolve`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    state = await witResolve(request.query.text, request.query.key);
    if (state && state.text){
      response.send({nlp:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
}); 

app.post(`/post_utterance`, async function(request, response) {
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var ent  = "";
    if (request.body.entities){
      for (i = 0 ; i < request.body.entities.length ; i ++){
        if (request.body.entities[i] && request.body.entities[i].entity !== "nothing"){
          if(request.body.entities[i].end == null){
            request.body.entities[i].end = request.body.entities[i].start + request.body.entities[i].body.length;
          }
          if (request.body.entities[i].entity.includes("$")){
            ent += `{"entity":"${request.body.entities[i].entity}:${request.body.entities[i].entity.split("$")[1]}", "start": ${request.body.entities[i].start}, "end":${request.body.entities[i].end}, "body":"${request.body.entities[i].body}", "entities":[]},`
          } else {
            ent += `{"entity":"${request.body.entities[i].entity}:${request.body.entities[i].entity}", "start": ${request.body.entities[i].start}, "end":${request.body.entities[i].end}, "body":"${request.body.entities[i].body}", "entities":[]},`
          }
        }
      }
    }
    var traits  = "";
    if (request.body.traits){
      for (p = 0 ; p < request.body.traits.length ; p++){
        traits += `{"trait":"${request.body.traits[p].trait}", "value":"${request.body.traits[p].value}"},`
      }
    }
    state = await postUtterances(request.body.text, request.body.key, request.body.intent, ent.toString(), traits);
    if (state.sent){
      await updatePageUtterances(request.body.pageID, request.body.text, request.body.index, request.body.intent, "creating")
      response.send({state:state});
    } else {
      response.send({error:"retry"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Client Data end point.
app.post(`/get_started`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    state = await getGetStarted(token);
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
}); 

// Client Data end point.
app.post(`/get_persistent_menu`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    state = await getPersistentMenu(token);
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Client Data end point.
app.post(`/persistent_menu`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    var all = request.body.current;
    if (request.body.title){
      if (request.body.type === "url"){
        all[all.length] = {"type": "web_url","title": `${request.body.title}`,"url": `${request.body.value}`}
      } else {
        all[all.length] = {"type": "postback","title": `${request.body.title}`,"payload": `${request.body.value}`}
      }
      state = await postPersistentMenu(token, null, all)
    } 
    else if (request.body.deleteItem){
      for ( p = 0 ; p < all.length ; p++){
        if (all[p].title === request.body.deleteItem){
          all.splice(p,1)
        }
      }
      state = await postPersistentMenu(token, null, all)
    }
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
}); 

// Client Data end point.
app.post(`/delete_menu`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    state = await deletePersistentMenu(token);
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
}); 

// Client Data end point.
app.post(`/delete_get_started`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
      state = await deleteGetStarted(token);
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
}); 


// Client Data end point.
app.post(`/post_get_started`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
      state = await postGetStarted(token);
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
}); 

// Client Data end point.
app.post(`/greeting`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    state = await getGreeting(token);
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Client Data end point.
app.post(`/set_greeting`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    state = await setGreeting(token,request.body.greeting);
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
}); 

// Client Data end point.
app.post(`/delete_greeting`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    state = await deleteGreeting(token);
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
}); 

// Client Data end point.
app.post(`/page_feed`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    state = await readPageFeed(request.body.page_id, token);
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
}); 


// Client Data end point.
app.post(`/get_admins`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    state = await getAdmins(request.body.page_id, token);
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
}); 


app.post(`/get_whitelisted`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    state = await getWhitelisted(token)
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
});


// Client Data end point.
app.post(`/whitelisted`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    current = request.body.current.split(",")
    if (request.body.url){
        all = current;
        all[all.length] = request.body.url
        state = await whiteList(token, all)
        if (state){
          response.send({state:all});
        } else {
          response.send({fail:"problem"});
        }
    } 
    else if (request.body.deleteURL){
      all = current;
      if ((all.indexOf(request.body.deleteURL) > -1)){
        all.splice(all.indexOf(request.body.deleteURL),1)
      }
      state = await whiteList(token, all)
      if (state){
        response.send({state:all});
      } else {
        response.send({fail:"problem"});
      }
    } 
  } else {
    response.send({nothing:"here"});
  }
}); 


// Client Data end point.
app.post(`/personas`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    if (request.body.persona_id){
      state = await deletePersonas(request.body.persona_id, token);
    } else if (request.body.link && request.body.name){
      state = await postPersonas(request.body.name, request.body.link, token);
    } else {
      state = null;
    }
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Client Data end point.
app.post(`/get_personas`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    var bytes  = CryptoJS.AES.decrypt(`${request.body.token}`, process.env.KEY);
    var token = bytes.toString(CryptoJS.enc.Utf8);
    state = await getPersonas(token);
    if (state){
      response.send({state:state});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// Client Data end point.
app.get(`/update_auto_reply`, async function(request, response) {
  // If the user is logged in, get his data.
  if (request.session.userID && request.headers.referer && request.headers.referer.includes(process.env.URL.substring(8))){
    state = await updatePage(`${request.query.page_id}`, "auto_reply", request.query.value);
    if (state && state.id){
      response.send({success:"done"});
    } else {
      response.send({fail:"problem"});
    }
  } else {
    response.send({nothing:"here"});
  }
});

// The end point is sample to demonstrate the process.
app.post(`/botai_end`, async function(request, response) {
  // Create responses to use later
  var elements = []
  elements[elements.length]={"title": "test 1" ,"image_url":"https://5b057038df3f.ngrok.io/s_3.jpg", "subtitle":"test", "default_action": {"type": "web_url","url": `https://botai.me`,"messenger_extensions": "true","webview_height_ratio": "full"},"buttons":[{"type":"web_url","url":"https://botai.me","title":"See More"}]}
  elements[elements.length]={"title": "Test 2" ,"image_url":"https://5b057038df3f.ngrok.io/s_3.jpg", "subtitle":"test", "default_action": {"type": "web_url","url": `https://botai.me`,"messenger_extensions": "true","webview_height_ratio": "full"},"buttons":[{"type":"web_url","url":"https://botai.me","title":"See More"}]}
  elements[elements.length]={"title": "test 3" ,"image_url":"https://5b057038df3f.ngrok.io/s_3.jpg", "subtitle":"test", "default_action": {"type": "web_url","url": `https://botai.me`,"messenger_extensions": "true","webview_height_ratio": "full"},"buttons":[{"type":"web_url","url":"https://botai.me","title":"See More"}]}
  // Template
  template = { 
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": elements
      }
    },
    "quick_replies":[{"content_type":"text","title":"Get Help","payload":"HELP"},{"content_type":"text","title":"Start Again","payload":"GET_STARTED"}]
  }
  // Attachment
  att = {
    "attachment":{
      "type":"image", 
      "payload":{
        "url":"https://5b057038df3f.ngrok.io/s_3.jpg", 
      }
    },
    "quick_replies":[{"content_type":"text","title":"Get Help","payload":"HELP"},{"content_type":"text","title":"Start Again","payload":"GET_STARTED"}]
  } 
  // Quick replies
  qr1 = {"text": "Welcome {{user_first_name}}, We are excited to meet you!", "quick_replies": [
    {
      "content_type":"text",
      "title":"Get Help",
      "payload":"HELP"
    }, {
      "content_type":"text",
      "title":"See Products",
      "payload":"PRODUCTS"
    }
  ]} 
  qr2 = {"text": "These are few options", "quick_replies": [
    {
      "content_type":"text",
      "title":"Customer Service Chat",
      "payload":"CS"
    }, {
      "content_type":"text",
      "title":"Phone Call",
      "payload":"CALL"
    }
  ]} 
  qr3 = {"text": "Welcome {{user_first_name}}, Thanks for your comment!", "quick_replies": [
    {
      "content_type":"text",
      "title":"Get Help",
      "payload":"HELP"
    }, {
      "content_type":"text",
      "title":"See Products",
      "payload":"PRODUCTS"
    }
  ]} 
  // Text
  text1 = {"text": "{{user_first_name}}, How can we help you?"} 
  text2 = {"text": "Ok, let's start again. How are you doing today?"} 
  text3 = {"text": "{{user_first_name}}, can you repeat this please?!"}
  text4 = {"text": "Backup Response"} 
  text5 = {"text": "Backup Response"}
  // Print the request body  
  console.log(request.body)
  // If it is Messenger message
  if (request.body.new_msg){
    // If it is text
    if (request.body.eventType === "message_text"){
      console.log(JSON.parse(request.body.nlp))
      if (JSON.parse(request.body.nlp).intents[0]){
        if (JSON.parse(request.body.nlp).intents[0].name === "help"){
          response.send({token: "asdasdas", response:{"persona_id":"1011315279345693","responses":[text3,qr2]}, secondaryResponse:["", ""]});
        } else {
          response.send({token: "asdasdas", response:{"persona_id":"1011315279345693","responses":[text2,att]}, secondaryResponse:["", text2]});
        }
      } else {
        response.send({token: "asdasdas", response:{"persona_id":"1011315279345693","responses":[text2,att]}, secondaryResponse:["", text1]});
      }
    } else if (request.body.eventType === "message_attachment"){
      console.log(JSON.parse(request.body.value))
      response.send({token: "asdasdas", response:{"persona_id":"none","responses":[template]}, secondaryResponse:[text1]});
    }
    // If it is postback
    else {
      console.log(request.body.value)
      if (request.body.value === "HELP"){
        response.send({token: "asdasdas", response:{"persona_id":"1011315279345693","responses":[att]}, secondaryResponse:[text4]});
      } else if (request.body.value === "GET_STARTED") {
        response.send({token: "asdasdas", response:{"persona_id":"1011315279345693","responses":[att]}, secondaryResponse:[text2]});
      } else {
        response.send({token: "asdasdas", response:{"persona_id":"1011315279345693","responses":[att]}, secondaryResponse:[text3]});
      }
    }
  } 
  // If it is comment
  else if (request.body.new_comment){
    console.log(JSON.parse(request.body.nlp))
    if (JSON.parse(request.body.nlp).intents[0]){
      if (JSON.parse(request.body.nlp).intents[0].name === "buy"){
        response.send({token: "asdasdas", response:{"persona_id":"1011315279345693","response":att}, secondaryResponse:text5});
      } else {
        response.send({token: "asdasdas", response:{"persona_id":"1011315279345693","response":template}, secondaryResponse:text5});
      }
    } else {
      response.send({token: "asdasdas", response:{"persona_id":"1011315279345693","response":qr2}, secondaryResponse:text5});
    }
  }
  // send 200 status
  else {
    response.sendStatus(200);
  }
});

///////////////////////////////////////////////////////
/// Webhook Endpoint For the Facebook Messenger App ///
///////////////////////////////////////////////////////
app.post('/webhook', (req, res) => {
  let body = req.body;
  if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
    // Gets the body of the webhook event
    if(entry.messaging){
      webhook_event = entry.messaging[0];
      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      let page_id = webhook_event.recipient.id;
      // Pass the event to handlePostBack function if Quick Reply or Postback.
      // Otherwise, pass the event to handleMessage function.
      if (webhook_event.message && !webhook_event.message.quick_reply) {
        if (!webhook_event.message.is_echo){
          firstMessages(sender_psid, page_id, webhook_event);  
        }
      } else if (webhook_event.postback || (webhook_event.message && webhook_event.message.quick_reply)) {
        firstPostbacks(sender_psid, page_id, webhook_event);
      }
    } else if(entry.standby){
      webhook_event = entry.standby[0];
      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      let page_id = webhook_event.recipient.id;
      // Pass the event to handlePostBack function if Quick Reply or Postback.
      // Otherwise, pass the event to handleMessage function.
      if (webhook_event.message && !webhook_event.message.quick_reply) {
        if (!webhook_event.message.is_echo){
          firstMessages(sender_psid, page_id, webhook_event);  
        }
      } else if (webhook_event.postback || (webhook_event.message && webhook_event.message.quick_reply)) {
        firstPostbacks(sender_psid, page_id, webhook_event);
      }
    } else if (entry.changes){
        handleFeed(entry.id, entry.changes)
    }
  });
  // Returns a '200 OK' response to all requests
  res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];      
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {   
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);  
    } else {
    // Responds with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);      
    }
  } else {
    res.redirect("/");
  }
});

// Wildcard to redirect all wrong routes
app.get('*', function(req, res){
  res.redirect("/");
});  

// Sleep Funtion to put the App to wait //
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// listen for webhook events //
app.listen(process.env.PORT || 3370, () => console.log('webhook is listening'));