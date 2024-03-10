const express = require("express");
const cluster = require("cluster");
const os = require("os");

cluster.schedulingPolicy = cluster.SCHED_RR;

const app = express();
const PORT = 3000;

function delay(duration) {
  const startTime = new Date().valueOf();

  while (Date.now() - startTime < duration) {
    // event loop is blocked
  }
}

app.get("/", (req, res) => {
  return res.send(`Normal Request: ${process.pid}`);
});

app.get("/timer", (req, res) => {
  delay(9000);
  return res.send(`Timer Request - Blah!! Blah!! Blah!! ${process.pid}`);
});

console.log("Running server.js ....");
if (cluster.isMaster) {
  // main master process
  console.log("Running master process...");
  const NUM_WORKERS = os.cpus().length;
  console.log("Total workers: " + NUM_WORKERS);
  for (let i = 0; i < NUM_WORKERS; i++) cluster.fork();
} else {
  // subsequent forked processes
  console.log("Running worker process...");
  app.listen(PORT, () => console.log(`Server is serving at ${PORT}`));
}
