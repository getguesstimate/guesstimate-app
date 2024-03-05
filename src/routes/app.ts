import Modal from "react-modal";
import { GuesstimateWorker } from "~/lib/window";
import * as elev from "~/server/elev/index";

if (typeof window !== "undefined") {
  const workers = new Array(2)
    .fill(null)
    .map(
      () =>
        new Worker(
          new URL(
            "../lib/guesstimator/samplers/simulator-worker/index",
            import.meta.url
          )
        )
    );

  window.workers = workers.map((worker: GuesstimateWorker) => {
    worker.queue = [];
    worker.launch = (data) => {
      worker.postMessage(JSON.stringify(data));
    };
    worker.onmessage = (event) => {
      // Remove worker from queue
      const task = worker.queue.shift();
      if (!task) {
        return;
      }
      const { data, callback } = task;
      // Call user callback
      callback(event);
      // Run next thing
      if (worker.queue.length > 0) {
        worker.launch(worker.queue[0].data);
      }
    };
    worker.push = (data, callback) => {
      // Add to queue
      worker.queue.push({ data, callback });
      if (worker.queue.length === 1) {
        // If nothing is running, start running.
        worker.launch(data);
      }
    };
    return worker;
  });
}

const init = () => {
  if (typeof window === "undefined") {
    return;
  }

  // might be a bad idea? https://github.com/reactjs/react-modal/issues/949
  Modal.setAppElement("#__next");

  elev.hide();
};

init();
