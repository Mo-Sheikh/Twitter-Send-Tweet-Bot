const OAuth = require("oauth");
const motivation = require("./tweets.json");
const fs = require("fs");

async function exportHandler() {
  async function initialise() {
    if (process.env.USER && process.env.USER === "MohamedS") {
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
    }
  }
  async function sendTweet() {
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
        { status: "HELLO from script1" },
        (e, data, response) => {
          if (response) {
          }
          if (data) {
            console.log("SENT");
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
  sendTweet();
}

exportHandler();
