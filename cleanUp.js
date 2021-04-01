const recycle = require("./reusedTweets.json")
const fs = require("fs");
let obj = []

for (let x of recycle ){
    let a = x.tweet;
    if(!x.tweet.toLowerCase().includes("#100DaysOfCode")){
        a = a + " #100DaysOfCode"
    }
    if(!x.tweet.toLowerCase().includes("#100DaysOfCode")){
        a = a + " #CodeNewbie"
    }
    if(a.length < 280){
        obj.push({"tweet": a})
    }

        
}

try {
    fs.writeFile('cleanedUp.json', JSON.stringify(obj), function (err) {
      if (err) return console.log(err);
      console.log('wrote file');
    });

  } catch (error) {
      console.log("error")
      console.log(error)

  }
