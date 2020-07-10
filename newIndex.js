const OAuth = require("oauth");
const motivation = require("./tweets.json");
const softwareMotivation = require("./softwareTweets.json");
const AWS = require("aws-sdk");
const fs = require("fs");
const { timeStamp } = require("console");

handler = async (event) => {
  console.log("event is ", event);
  var item;
  var index;
  var type;
  var quoteNo;
  var dynamodb;
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
          dynamodb = new AWS.DynamoDB({
            apiVersion: "2012-08-10",
            accessKeyId: process.env.accessKeyId,
            secretAccessKey: process.env.secretAccessKey,
            region: process.env.region,
          });
          resolve(JSON.parse(data));
        });
      };
      return new Promise(result);
    } else {
      dynamodb = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: process.env.region,
      });
    }
  }
  async function getTweetType() {
    // if (event.type) {
    if (true) {
      index = 1;
      type = softwareMotivation;
      item = "softwareQuoteNo";
    } else {
      index = 0;
      type = motivation;
      item = "QuoteNo";
    }
  }
  async function getQuoteNo(index) {
    var params = {
      TableName: process.env.TableName,
    };
    let result = (resolve, reject) => {
      dynamodb.scan(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          reject(err);
          return;
        } else {
          quoteNo = data.Items[index].value.N;
          console.log("RETRIEVED QUOTE NO:", quoteNo);
          resolve(quoteNo);
        }
      });
    };
    return new Promise(result);
  }

  async function sendTweet(type) {
    console.log("QUOTe NO is ", quoteNo);
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
        { status: `Tip ${quoteNo.toString()} - ${type[quoteNo].tweet}` },
        (e, data, response) => {
          if (response) {
          }
          if (data) {
            console.log("SENT ", type[quoteNo].tweet);
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
  async function populateDB(item) {
    let newQuoteNo = parseInt(quoteNo) + 1;
    var params = {
      Item: {
        live: { S: item },
        value: { N: newQuoteNo.toString() },
      },
      TableName: "Twitter-Bot-Table",
    };
    let result = (resolve, reject) => {
      dynamodb.putItem(params, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        if (data) {
          resolve("Updated");
          console.log("JUST POPULATED QUOTE NO" + newQuoteNo);
        }
      });
    };
    return new Promise(result);
  }
  async function tester() {
    const oauth = new OAuth.OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      process.env.ConsumerKey,
      process.env.ConsumerSecret,
      "1.0A",
      null,
      "HMAC-SHA1"
    );

    return new Promise((resolve, reject) => {
      oauth.get(
        `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=wellpaidgeek&count=5000&include_rts=false&max_id=10&exclude_replies=1&tweet_mode=extended`,
        process.env.AccessToken,
        process.env.TokenSecret,

        (e, data, response) => {
          if (response) {
          }
          if (data) {
            let obj = [];
         
           let a =  JSON.parse(data).map(i=>{
                if(i.retweet_count > 50){
                    // console.log(`This got ${i.retweet_count} retweets`)
                    // console.log(i.full_text)
                    // console.log("-------------")
                    obj.push({"tweet": i.full_text})
                    console.log("this one got ", i.retweet_count)
                    return i
                }
            })
            console.log(obj)
            console.log("we have ", a.length)
            resolve(data);
          }
          if (e) {
            console.log(e);
            reject(e);
          }
        }
      );
    });
  }
  await initialise();
  // await getTweetType();
  // await getQuoteNo(index);
  // await sendTweet(type);
  // await populateDB(item);
  await tester();
  console.log("a");

  return 1;
};

handler({ type: "software" });

