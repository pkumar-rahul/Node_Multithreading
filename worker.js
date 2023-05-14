const { parentPort } = require("worker_threads");

let counter = 0;
for (let i = 0; i < 20_000_000_000; i++) {
  counter++;
}

//Send message to main thread
parentPort.postMessage(counter);

// Use of Worker Threads
// Image resizing
// Video compression
// File encryption and other cryptography
// Sorting and searching large amounts of data
// Complex mathematical operations