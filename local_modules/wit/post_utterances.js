/// Function to post New Utterances ///
const rp = require('request-promise');
module.exports = async (text, key, intent, entity, trait) => {
    var state;

    if (entity === "botai__setUP"){
        try{
            var options = {
            method: 'POST',
            uri: `https://api.wit.ai/utterances?v=20200513`,
            headers: {
                Authorization: `Bearer ${key}`
            },
            body: `[{"text": "${text}","intent":"${intent}", "entities":[],"traits":[] }]`,
            };
        state = await JSON.parse(await rp(options));
        }
        catch (e){
            console.log(e)
            return;
        }
        console.log(state)
        return state;
    } else {
        if (intent === "out_of_scope"){
            try{
                var options = {
                method: 'POST',
                uri: `https://api.wit.ai/utterances?v=20200513`,
                headers: {
                    Authorization: `Bearer ${key}`
                },
                body: `[{"text": "${text}", "entities":[${entity}],"traits":[${trait}]}]`,
                };
            state = await JSON.parse(await rp(options));
            }
            catch (e){
                return;
            }
            return state;
        } else {
            try{
                var options = {
                method: 'POST',
                uri: `https://api.wit.ai/utterances?v=20200513`,
                headers: {
                    Authorization: `Bearer ${key}`
                },
                body: `[{"text": "${text}","intent":"${intent}","entities":[${entity}],"traits":[${trait}]}]`,
                };
            state = await JSON.parse(await rp(options));
            }
            catch (e){
                return;
            }
            return state;
        }

    }
};

