// console.log("fdfdf")
// var str = 'hfdhfs @3ds dsa sd@ Fdsfds@ds @ dfsd'
// var new_str = "";

// for(var i = 0 ; i < str.length ; i++){
//     if (str[i] === "@"){
//         console.log(str[i])
//         link = ""
//         i++
//         while (str[i] !== " "){
//             link += str[i]
//             i++
//         }
//         i--
//         console.log(`https://twitter.com/${link}`)
//         new_str += `https://twitter.com/${link}`
//     } else {
//         new_str += str[i]
//     }
// }

// console.log(str)
// console.log(new_str)



// var tt = "fdFDSdf sdvd"
// console.log(tt.toLowerCase())


// 91d34573-6fdb-4ab4-ba06-314f15b18b91


const https = require('https')
var coin = "NEO"
const options = {
    host: 'pro-api.coinmarketcap.com',
    port: 443,
    // path:'/2/tweets/search/stream/rules',
    path: `/v1/cryptocurrency/quotes/latest?symbol=${coin}`,
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        "X-CMC_PRO_API_KEY": "91d34573-6fdb-4ab4-ba06-314f15b18b91"
    },
}
const req = https.request(options, function (res) {
    console.log(`statusCode: ${res.statusCode}`)
    let data = '';
    res.on('data', d => {
        data += d;
    });
    res.on('end', () => {
        console.log(JSON.parse(data))
        console.log(JSON.parse(data).data[`${coin}`].quote)
    });
})
req.on('error', async function (error) {
    console.error(error)
    connect()
})
req.end()