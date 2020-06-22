const fs = require("fs");
const file = require("./softwareTweets.json");

for (let x of file) {
  x.tweet = x.tweet + "#100DaysOfCode #coding";
}
console.log(file);
