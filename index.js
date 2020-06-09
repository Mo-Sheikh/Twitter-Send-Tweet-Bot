const axios = require("axios");
const OAuth = require("oauth");
const motivation = require("./tweets.json");

const fs = require("fs");

// if (process.env.USER && process.env.USER === "MohamedS") {
//   let envResult = (resolve, reject) => {
//     fs.readFile("../../Documents/config.json", "utf8", (err, data) => {
//       if (err) {
//         console.log(err);
//         reject(err);
//       }
//       resolve(data);
//       process.env = JSON.parse(data);
//     });
//   };
//   return new Promise(envResult);
// }
console.log(process.env.ConsumerKey);

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
    { status: "HELLO from script" },
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
