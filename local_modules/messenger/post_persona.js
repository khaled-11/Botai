 // Function to add personas to the Messenger profile
 const rp = require('request-promise');
 module.exports = async (name, link,token) => {
   var results;
   try{
     var options = {
       method: 'POST',
       uri: `https://graph.facebook.com/v9.0/me/personas?access_token=${token}`,
       // In this App we will set only one persona for Demo purposes.
       body: {	"name": name,
       "profile_picture_url": link
       },
       json: true
   };
   results = await rp(options);
   }
   catch (e){
    return;
   }
   return results;  
 };
 