import { ServiceError, status } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export abstract class GrpcFetcher {
  abstract fetch<TResponse, TSuccessResponse, TErrorResponse>(
    props: GrpcFetcherWithSuccessProps<
      TResponse,
      TSuccessResponse,
      TErrorResponse
    >,
  ): Promise<TSuccessResponse | TErrorResponse>;

  abstract fetch<TResponse, TErrorResponse>(
    props: GrpcFetcherProps<TResponse, TErrorResponse>,
  ): Promise<TResponse | TErrorResponse>;
}

export interface GrpcFetcherProps<TResponse, TErrorResponse> {
  request: Observable<TResponse>;
  onFailure?: ErrorHandler<TErrorResponse>;
}

export interface GrpcFetcherWithSuccessProps<
  TResponse,
  TSuccessResponse,
  TErrorResponse,
> extends GrpcFetcherProps<TResponse, TErrorResponse> {
  onSuccess: (response: TResponse) => TSuccessResponse;
}

export type ErrorHandler<TOut> = Partial<{
  [S in Exclude<status, status.OK>]: (error: ServiceError) => TOut;
}>;
