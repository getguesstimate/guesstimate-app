import * as engine from "gEngine/engine";

import { GuesstimateRecorder } from "lib/recorder";

import Modal from "react-modal";
import * as elev from "servers/elev/index";
import * as sentry from "servers/sentry/index";

if (typeof window !== "undefined") {
  window.workers = new Array(2)
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

  window.workers = window.workers.map((worker) => {
    worker.queue = [];
    worker.launch = (data) => {
      worker.postMessage(JSON.stringify(data));
    };
    worker.onmessage = (event) => {
      // Remove worker from queue
      const { data, callback } = worker.queue.shift();
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
  sentry.initialize();

  //This just exists to help people get their api tokens
  window.get_profile = engine.me.localStorage.get;
};

init();
