export {};

declare global {
  interface Window {
    recorder: any;
    workers: any[];
    intercomSettings: {
      app_id: string;
    };
    Intercom: any;
    get_profile: () => any;
  }
}
