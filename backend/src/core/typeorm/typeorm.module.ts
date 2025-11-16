import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';

@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        return AppDataSource.initialize();
      },
    },
  ],
  exports: [DataSource],
})
export class TypeORMModule {}
