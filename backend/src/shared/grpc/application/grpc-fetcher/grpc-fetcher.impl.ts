import { firstValueFrom } from 'rxjs';
import {
  ErrorHandler,
  GrpcFetcher,
  GrpcFetcherWithSuccessProps,
} from './grpc-fetcher.abstract';
import { Injectable } from '@nestjs/common';
import { ServiceError, status } from '@grpc/grpc-js';

@Injectable()
export class GrpcFetcherImpl implements GrpcFetcher {
  async fetch<TResponse, TSuccessResponse, TErrorResponse>({
    request,
    onSuccess,
    onFailure,
  }: GrpcFetcherWithSuccessProps<
    TResponse,
    TSuccessResponse,
    TErrorResponse
  >): Promise<TResponse | TSuccessResponse | TErrorResponse> {
    try {
      const response = await firstValueFrom(request);

      if (onSuccess) {
        return onSuccess(response);
      }

      return response;
    } catch (error) {
      return this.parseError<TErrorResponse>(error, onFailure);
    }
  }

  private parseError<TErrorResponse>(
    error: unknown,
    onFailure?: ErrorHandler<TErrorResponse>,
  ): TErrorResponse {
    if (!(error instanceof Error)) {
      throw error;
    }

    const rpcError = error as ServiceError;

    if (!onFailure) {
      throw error;
    }

    const handler = onFailure[rpcError.code as Exclude<status, status.OK>];

    if (typeof handler === 'function') {
      return handler(rpcError);
    }

    throw error;
  }
}
