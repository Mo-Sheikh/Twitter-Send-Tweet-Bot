const axios = require("axios");
const OAuth = require("oauth");

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
    { status: "Sent from script" },
    (e, data, response) => {
      if (response) {
        console.log("SENT");
      }
      if (data) {
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
