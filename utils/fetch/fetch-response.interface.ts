export interface FetchResponse<Body> {
  status: number;
  statusText: string;
  message: string;
  body?: Body;
}
