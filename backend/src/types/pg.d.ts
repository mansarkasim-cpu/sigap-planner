declare module 'pg' {
  export class Client {
    constructor(opts?: any);
    connect(): Promise<void>;
    query(q: any, params?: any): Promise<any>;
    on(event: string, cb: any): any;
    end(): Promise<void>;
  }
  export interface Notification {
    channel: string;
    payload: string | null;
  }
}
