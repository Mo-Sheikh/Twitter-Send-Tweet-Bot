const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

fs.createReadStream("/Users/sheikm01/Documents/tips.csv")
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', (row) => {
     console.log(row)
     console.log("BANG")
  })

  .on('end', () => {
      // handle end of CSV
  })