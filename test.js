const softwareMotivation = require("./softwareTweets.json");
const fs = require("fs");
const AWS = require("aws-sdk");

async function bigBoy() {
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

  //   async function getQuoteNo() {
  //     var params = {
  //       TableName: process.env.TableName,
  //     };
  //     let result = (resolve, reject) => {
  //       dynamodb.scan(params, function (err, data) {
  //         if (err) {
  //           console.log(err, err.stack);
  //           reject(err);
  //           return;
  //         } else {
  //           console.log(JSON.stringify(data));
  //           console.log("BANGER", data.Items[1].value.N);
  //           resolve("a");
  //         }
  //       });
  //     };
  //     return new Promise(result);
  //   }

  async function populateDB(item) {
    let newQuoteNo = 12;
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
  await initialise();
  await populateDB("softwareQuoteNo");
}

bigBoy();
