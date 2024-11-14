import { BadRequest, HttpError } from 'npm:http-errors';

export class RequestHelper {
  constructor(private req: Request) { }

  validateQueryParams(
    queryValidators: Record<string, (val: unknown) => boolean>,
  ): { params: Record<string, unknown>; error?: HttpError; } {
    const params: Record<string, unknown> = {};
    const { searchParams } = new URL(this.req.url);

    for (const [query, isValid] of Object.entries(queryValidators)) {
      if (!isValid(searchParams.get(query))) {
        return {
          params,
          error: new BadRequest(`request query param "${query}" is not valid`),
        };
      }
    }

    return { params };
  }
}
