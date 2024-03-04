import Modal from "react-modal";
import { GuesstimateRecorder } from "~/lib/recorder";
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
  window.recorder = new GuesstimateRecorder();

  // might be a bad idea? https://github.com/reactjs/react-modal/issues/949
  Modal.setAppElement("#__next");

  window.intercomSettings = {
    app_id: "o0trb1v9",
  };

  // this is based on intercom-provided snippet (probably) but full of typescript hacks
  (function () {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === "function") {
      ic("reattach_activator");
      ic("update", w.intercomSettings);
    } else {
      var d = document;
      var i: any = function () {
        // eslint-disable-next-line prefer-rest-params
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      w.Intercom = i;
      const l = () => {
        var s = d.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.intercom.io/widget/o0trb1v9";
        var x: any = d.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(s, x);
      };
      if ((w as any).attachEvent) {
        (w as any).attachEvent("onload", l);
      } else {
        w.addEventListener("load", l, false);
      }
    }
  })();
  elev.hide();
  // sentry.initialize();
};

init();
