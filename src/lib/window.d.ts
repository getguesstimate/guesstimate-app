import { GuesstimateRecorder } from "./recorder";

export {};

declare global {
  interface Window {
    recorder: GuesstimateRecorder;
    workers: any[];
    intercomSettings: {
      app_id: string;
    };
    Intercom: any;
    ChargeBee: any;
    get_profile: () => any;
    _elev: any;
  }
}
