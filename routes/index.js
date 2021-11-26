var express = require("express");
const fetch = require("node-fetch");
const converter = require("json-2-csv")
const fs = require("fs")
var router = express.Router();

let data = [];

/* A = Pulling data from the URL with async/await */

router.get("/", async function (req, res, next) {
  let response = await fetch(
    "https://gbfs.divvybikes.com/gbfs/en/station_information.json"
  );
  data = await response.json();
  res.json({ status: "success", data: data });
});


/* B = 1 remove, 2 replace, 3 capacity < 12* ----  use = url/remove */


router.get("/remove", async function (req, res, next) {
  let response = await fetch(
    "https://gbfs.divvybikes.com/gbfs/en/station_information.json"
  );
  data = await response.json();
  for (let i of data.data.stations) {
    delete i.rental_methods;
    delete i.rental_uris;
    i.legacyID = i.legacy_id
    i.stationID = i.station_id
    i.externalID = i.external_id
    delete i.legacy_id
    delete i.station_id
    delete i.external_id
  }
  let filteredCapacity = data.data.stations.filter(item => item.capacity < 12);

  converter.json2csv(filteredCapacity, (err, csv) => {
    if (err) {
      throw err;
    }
    filteredCapacity = csv
    fs.writeFileSync('data.csv', filteredCapacity)
  });

  res.send({ result: filteredCapacity, status: "SUCCESS" });

});


module.exports = router;
