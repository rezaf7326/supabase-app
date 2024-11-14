import { FetchRequest } from './fetch-request';

export class FetchRequestFactory {
  private _queryParams?: Record<string, string | number | undefined>;
  private _baseUrl?: string;
  private _path?: string;

  path(path: string): FetchRequestFactory {
    this._path = path;
    return this;
  }

  query(
    queryParams: Record<string, string | number | undefined>,
  ): FetchRequestFactory {
    this._queryParams = this._queryParams
      ? { ...this._queryParams, ...queryParams }
      : queryParams;
    return this;
  }

  baseUrl(baseUrl: string): FetchRequestFactory {
    this._baseUrl = baseUrl;
    return this;
  }

  create(): FetchRequest {
    // if (!this._baseUrl) {
    //   throw new Error(`Missing baseUrl`);
    // }
    return new FetchRequest({
      baseUrl: this._baseUrl || 'https://rpb-api.pixelmilldigital.com/rpb/v1',
      queryParams: this._queryParams || {},
      path: this._path || '',
    });
  }
}
