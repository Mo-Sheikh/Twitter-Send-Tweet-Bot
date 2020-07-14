const tweet = require("./reuse.json")
const fs = require("fs")
const OAuth = require("oauth");



handler = async (event) => {
    console.log("event is ", event);
    var item;
    var index;
    var type;
    var quoteNo;
    async function initialise() {
      console.log("INITIALISING");
      if (!process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        let result = (resolve, reject) => {
          fs.readFile("../../Documents/config.json", "utf8", (err, data) => {
            if (err) {
              console.log(err);
              reject(err);
            }
            process.env = JSON.parse(data);
            resolve(JSON.parse(data));
          });
        };
        return new Promise(result);
      } else {

      }
    }  
    async function sendTweet(type) {
      console.log("SENDING TWEET");
      const oauth = new OAuth.OAuth(
        "https://api.twitter.com/oauth/request_token",
        "https://api.twitter.com/oauth/access_token",
        process.env.ConsumerKey,
        process.env.ConsumerSecret,
        "1.0A",
        null,
        "HMAC-SHA1"
      );
      let result = (resolve, reject) => {
        oauth.post(
          `https://api.twitter.com/1.1/statuses/update.json`,
          process.env.AccessToken,
          process.env.TokenSecret,
          { status:  tweet[1].tweet},
          (e, data, response) => {
            if (response) {
            }
            if (data) {
              console.log("SENT ");
              resolve(data);
            }
            if (e) {
              console.log(e);
              reject(e);
            }
          }
        );
      };
      return new Promise(result);
    }  
    await initialise();
    await sendTweet(type);
    const response = {
      statusCode: 200,
      body: JSON.stringify("Hello from Lambda!"),
    };
    return response;
  };
  
handler({"type":"hello"})
  