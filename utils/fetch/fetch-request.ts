import { FetchResponse } from './fetch-response.interface';
import { FetchError } from './fetch-error';

export interface ReqOptions {
  isFile: boolean;
}

export class FetchRequest {
  readonly baseUrl: string;
  readonly queryParams: Record<string, string | number | undefined>;
  readonly path: string;

  constructor(config: {
    queryParams: Record<string, string | number | undefined>;
    baseUrl: string;
    path: string;
  }) {
    this.baseUrl = config.baseUrl.endsWith('/')
      ? config.baseUrl.substring(0, config.baseUrl.length) // remove "/" from the end
      : config.baseUrl;
    this.queryParams = config.queryParams;
    if (config.path.endsWith('/')) {
      config.path = config.path.substring(0, config.path.length);
    }
    if (config.path.startsWith('/')) {
      config.path = config.path.substring(1);
    }
    this.path = config.path;
  }

  get url(): string {
    const qParams = Object.entries(this.queryParams)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    return (
      this.baseUrl +
      (this.path ? `/${this.path}` : '') +
      (qParams ? `?${qParams}` : '')
    );
  }

  get<ResBody = unknown>(
    reqInit?: RequestInit,
    reqOptions?: ReqOptions,
  ): Promise<FetchResponse<ResBody>> {
    return this.handleRequest<ResBody>(
      this.request('GET', reqInit, reqOptions),
    ).catch(this.handleError);
  }

  post<ResBody = unknown>(
    reqInit?: RequestInit,
    reqOptions?: ReqOptions,
  ): Promise<FetchResponse<ResBody>> {
    return this.handleRequest<ResBody>(
      this.request('POST', reqInit, reqOptions),
    ).catch(this.handleError);
  }

  put<ResBody = unknown>(
    reqInit?: RequestInit,
    reqOptions?: ReqOptions,
  ): Promise<FetchResponse<ResBody>> {
    return this.handleRequest<ResBody>(
      this.request('PUT', reqInit, reqOptions),
    ).catch(this.handleError);
  }

  patch<ResBody = unknown>(
    reqInit?: RequestInit,
    reqOptions?: ReqOptions,
  ): Promise<FetchResponse<ResBody>> {
    return this.handleRequest<ResBody>(
      this.request('PATCH', reqInit, reqOptions),
    ).catch(this.handleError);
  }

  delete<ResBody = unknown>(
    reqInit?: RequestInit,
    reqOptions?: ReqOptions,
  ): Promise<FetchResponse<ResBody>> {
    return this.handleRequest<ResBody>(
      this.request('DELETE', reqInit, reqOptions),
    ).catch(this.handleError);
  }

  private async handleRequest<ResBody>(request: Promise<Response>) {
    const res = await request;
    if (res.ok) {
      return this.parseResponse<ResBody>(res);
    }
    const message = await res.text().catch(() => undefined);
    throw new FetchError(res.status, res.statusText, message);
  }

  private request(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    reqInit?: RequestInit,
    reqOptions?: ReqOptions,
  ): Promise<Response> {
    if (!reqInit) {
      reqInit = {};
    }
    reqInit.method = method;
    reqInit.cache = reqInit.cache || 'no-cache';
    reqInit.mode = reqInit.mode || 'cors';
    reqInit.headers = reqInit.headers
      ? {
        'Content-Type': 'application/json',
        ...reqInit.headers,
      }
      : { 'Content-Type': 'application/json' };
    if (reqOptions?.isFile) {
      delete reqInit.headers!['Content-Type' as keyof HeadersInit];
    }

    return fetch(this.url, reqInit);
  }

  private async parseResponse<ResBody>(
    response: Response,
  ): Promise<FetchResponse<ResBody>> {
    const parsedRes: FetchResponse<ResBody> = {
      status: response.status,
      statusText: response.statusText,
      message: (await response.text()) || response.statusText,
    };
    try {
      parsedRes.body = JSON.parse(parsedRes.message) as ResBody;
    } catch {
      // skip this error
    }

    return parsedRes;
  }

  private handleError(error: unknown): never {
    if (error instanceof FetchError) {
      throw error;
    }
    throw new FetchError(503, 'Service Temporarily Unavailable');
  }
}
