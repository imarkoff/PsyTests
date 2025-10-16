import { Global, Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.interface';
import { FileStorageServiceImpl } from './file-storage.service';

@Global()
@Module({
  providers: [
    {
      provide: FileStorageService,
      useClass: FileStorageServiceImpl,
    },
  ],
  exports: [FileStorageServiceImpl],
})
export class FileStorageModule {}
