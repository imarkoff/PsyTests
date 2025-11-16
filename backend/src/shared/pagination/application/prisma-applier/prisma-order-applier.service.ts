import { SortedField } from '../../domain/types/pagination-params.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaOrderApplier {
  applyOrder<T extends object>(
    sortedFields: SortedField<T>[],
  ): Array<{ [key: string]: 'asc' | 'desc' }> {
    return sortedFields.map((field) => ({
      [field.field]: field.direction.toLowerCase() as 'asc' | 'desc',
    }));
  }
}
