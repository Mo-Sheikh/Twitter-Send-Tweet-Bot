const OAuth = require("oauth");
const motivation = require("./tweets.json");
const AWS = require("aws-sdk");
const fs = require("fs");
const { resolve } = require("path");

exports.handler = async (event) => {
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

  async function getQuoteNo() {
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
          quoteNo = data.Items[0].value.N;
          console.log("RETRIEVED QUOTE NO:", quoteNo);
          resolve(quoteNo);
        }
      });
    };
    return new Promise(result);
  }

  async function sendTweet() {
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
        { status: motivation[quoteNo].tweet },
        (e, data, response) => {
          if (response) {
          }
          if (data) {
            console.log("SENT ", motivation[quoteNo].tweet);
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
  async function populateDB() {
    let newQuoteNo = parseInt(quoteNo) + 1;
    var params = {
      Item: {
        live: { S: "QuoteNo" },
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
  await initialise();
  await getQuoteNo();
  await sendTweet();
  await populateDB();
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};
