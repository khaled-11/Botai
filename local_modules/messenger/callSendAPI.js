//// Function to send responses to the user using the Graph API ////
const rp = require('request-promise'),
fs = require('fs');

module.exports = async (sender_psid, response, action, fileData, token, persona_id, feedID) => {
    // Decalre some variables, and get the page access token.
    var request_body;
    var state;
    // Check response type and create the request body.
    if (feedID){
        if (!persona_id){
            request_body = {
                "recipient": {
                "comment_id": feedID
                },
                "message": response
            }
        } else {
            request_body = {
                "recipient": {
                "comment_id": feedID
                },
                "message": response,
                "persona_id":persona_id
            }
        }
    } 
    else if (!persona_id){
        if(!action){
            if (sender_psid){
                request_body = {
                "recipient": {
                "id": sender_psid
                },
                "message": response
                }
            }
        } 
        else {
            request_body = {
            "recipient": {
            "id": sender_psid
            },
            "sender_action":action
            }
        } 
    } else {
        request_body = {
            "recipient": {
                "id": sender_psid
                },
            "message": response,
            "persona_id":persona_id
            }
    }


    // Try the request after setting up the request_body.
    try{
        // If it is a regular Response or action.
        if(!fileData){
            var options = {
                method: 'POST',
                uri: `https://graph.facebook.com/v9.0/me/messages?access_token=${token}`,
                body: request_body,
                json: true
            };
            state = await rp(options);
        }
        // If the response is File attachment from the local server. 
        else{
            var fileReaderStream = fs.createReadStream(fileData)
                // If it is mp3 file
                if (fileData.includes("mp3")){
                formData = {
                    recipient: JSON.stringify({
                    id: sender_psid
                }),
                message: JSON.stringify({
                    attachment: {
                    type: 'audio',
                payload: {
                is_reusable: false
                }}
                }),
                filedata: fileReaderStream
                }
            // If it is another file format
            } else {
            formData = {
            recipient: JSON.stringify({
            id: sender_psid
            }),
            message: JSON.stringify({
                attachment: {
                type: 'file',
            payload: {
            is_reusable: false
            }}
            }),
            filedata: fileReaderStream
            }}
            var options = {
                method: 'POST',
                uri: `https://graph.facebook.com/v9.0/me/messages?access_token=${token}`,
                formData: formData,
                json: true
            };
            state = await rp(options);
        }
    }
    catch (e){
        console.log(e.message)
        return e.message;
    }
    return state;
}