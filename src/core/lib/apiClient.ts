import { z } from "zod";
import { API_BASE_URL, API_REVALIDATE_SECONDS } from "@/core/config/constants";

/**
 * Callers care about 404 specifically: the API answers "no matches" with a 404
 * rather than an empty list, so a fruitless search is a normal outcome.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly requestUrl: string,
  ) {
    super(`Request to ${requestUrl} failed with status ${status}`);
    this.name = "ApiError";
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

export class ApiContractError extends Error {
  constructor(
    readonly requestUrl: string,
    readonly issues: readonly string[],
  ) {
    super(`Unexpected response shape from ${requestUrl}: ${issues.join("; ")}`);
    this.name = "ApiContractError";
  }
}

export function paginatedResponseSchema<TItem extends z.ZodType>(
  itemSchema: TItem,
) {
  return z.object({
    info: z.object({
      count: z.number(),
      pages: z.number(),
      next: z.string().nullable(),
      prev: z.string().nullable(),
    }),
    results: z.array(itemSchema),
  });
}

/**
 * Batch endpoints answer with a bare object, not a one-element array, when asked
 * for a single id. Encoding it here makes the quirk part of the declared
 * contract instead of a step every caller has to remember.
 */
export function collectionResponseSchema<TItem extends z.ZodType>(
  itemSchema: TItem,
) {
  return z
    .union([z.array(itemSchema), itemSchema])
    .transform((payload) => (Array.isArray(payload) ? payload : [payload]));
}

type QueryParamValue = string | number | undefined | null;

interface ApiRequestOptions<TSchema extends z.ZodType> {
  schema: TSchema;
  searchParams?: Record<string, QueryParamValue>;
  signal?: AbortSignal;
}

function buildRequestUrl(
  path: string,
  searchParams: Record<string, QueryParamValue> | undefined,
): string {
  const url = new URL(`${API_BASE_URL}${path}`);

  for (const [name, value] of Object.entries(searchParams ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(name, String(value));
  }

  return url.toString();
}

export async function apiRequest<TSchema extends z.ZodType>(
  path: string,
  { schema, searchParams, signal }: ApiRequestOptions<TSchema>,
): Promise<z.infer<TSchema>> {
  const requestUrl = buildRequestUrl(path, searchParams);

  const response = await fetch(requestUrl, {
    signal,
    next: { revalidate: API_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new ApiError(response.status, requestUrl);
  }

  const parsed = schema.safeParse(await response.json());

  if (!parsed.success) {
    throw new ApiContractError(
      requestUrl,
      parsed.error.issues.map(
        (issue) => `${issue.path.join(".") || "response"}: ${issue.message}`,
      ),
    );
  }

  return parsed.data;
}
