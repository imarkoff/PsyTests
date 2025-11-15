import { DATA_SOURCE } from './typeorm.constants';
import { Provider } from '@nestjs/common';
import { AppDataSource } from './data-source';

export const typeormProvider: Provider = {
  provide: DATA_SOURCE,
  useFactory: async () => {
    return AppDataSource.initialize();
  },
};
