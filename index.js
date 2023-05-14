const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const port = process.env.PORT || 3001;

app.get("/non-blocking/", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

//the I/O operations make use of Node.js hidden threads, which CPU-bound tasks do not.
app.get("/blocking", async (req, res) => {
  let counter = 0;
  for (let i = 0; i < 20_000_000_000; i++) {
    counter++;
  }
  res.status(200).send(`result is ${counter}`);
});

//*********With Promise ***********

//CPU Intensive Task
function calculateCount() {
  return new Promise((resolve, reject) => {
    let counter = 0;
    for (let i = 0; i < 20_000_000_000; i++) {
      counter++;
    }
    resolve(counter);
  });
}
//promises don’t make JavaScript code execute
// in parallel and cannot be used to make CPU-bound tasks non-blocking.
app.get("/blockingWithPromise", async (req, res) => {
  const counter = await calculateCount();
  res.status(200).send(`result is ${counter}`);
});

// *******With Worker Threads**********
app.get("/blockingWithWorker", async (req, res) => {
  const worker = new Worker("./worker.js");
  worker.on("message", (data) => {
    res.status(200).send(`result is ${data}`);
  });
  worker.on("error", (msg) => {
    res.status(404).send(`An error occurred: ${msg}`);
  });
});

// Server Listen

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// ****To have more worker threads work on the same task*************
