export type GuesstimateWorker = Worker & {
  queue: { data: unknown; callback(e: MessageEvent): void }[];
  push(data: unknown, callback: (e: MessageEvent) => void): void;
  launch(data: unknown): void;
  onMessage(event: MessageEvent): void;
};

declare global {
  interface Window {
    workers: GuesstimateWorker[];
    ChargeBee: any;
    get_profile: () => any;
    _elev: any;
  }
}
