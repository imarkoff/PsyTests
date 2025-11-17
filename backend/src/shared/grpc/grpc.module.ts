import { Module } from '@nestjs/common';
import { GrpcFetcher } from './application/grpc-fetcher/grpc-fetcher.abstract';
import { GrpcFetcherImpl } from './application/grpc-fetcher/grpc-fetcher.impl';

@Module({
  providers: [
    {
      provide: GrpcFetcher,
      useClass: GrpcFetcherImpl,
    },
  ],
  exports: [GrpcFetcher],
})
export class GrpcModule {}
