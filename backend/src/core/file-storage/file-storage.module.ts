import { Global, Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.interface';
import { FileStorageServiceImpl } from './file-storage.service';
import { FileStorageEntityValidator } from './validations/file-storage-entity-validator/file-storage-entity-validator.interface';
import { PathTraversalValidator } from './validations/path-traversal-validator/path-traversal-validator.interface';
import { FileStorageEntityValidatorImpl } from './validations/file-storage-entity-validator/file-storage-entity-validator.service';
import { PathTraversalValidatorImpl } from './validations/path-traversal-validator/path-traversal-validator.service';
import { FileSystemService } from './file-system/file-system.interface';
import { NodeFileSystemService } from './file-system/node-file-system.service';

@Global()
@Module({
  providers: [
    {
      provide: FileStorageService,
      useClass: FileStorageServiceImpl,
    },
    {
      provide: FileSystemService,
      useClass: NodeFileSystemService,
    },
    {
      provide: FileStorageEntityValidator,
      useClass: FileStorageEntityValidatorImpl,
    },
    {
      provide: PathTraversalValidator,
      useClass: PathTraversalValidatorImpl,
    },
  ],
  exports: [FileStorageService],
})
export class FileStorageModule {}
