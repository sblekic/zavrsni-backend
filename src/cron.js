// render server besplatnog plana se ugasi svakih 15 min. Cron jobom ga budim svakih 12 min

import { CronJob } from "cron";
const https = require("https");

const backendUrl = "https://showstarter-api.onrender.com/events";
const job = new CronJob("*/12 * * * *", function () {
  console.log("Cackam server da ostane budan");

  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("server poked");
      } else {
        console.error(
          `nisam uspio restartirati server, status code je: ${res.statusCode}`
        );
      }
    })
    .on("error", (err) => {
      console.error("Greska tokom resetiranja: ", err.message);
    });
});

// import { CronJob } from "cron";
// var job = new CronJob(
//   "*/1 * * * *",
//   function () {
//     console.log("You will see this message every second");
//   },
//   null,
//   false,
//   "America/Los_Angeles"
// );

export default job;
