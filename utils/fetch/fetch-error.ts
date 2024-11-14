export class FetchError {
  readonly status: number;
  readonly statusText: string;
  readonly message: string;

  constructor(status: number, statusText: string, message?: string) {
    this.status = status;
    this.statusText = statusText;
    this.message = message || statusText;
  }
}
