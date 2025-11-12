import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';
import { Type as TransformType } from 'class-transformer';
import { PaginationParamsDto } from './pagination-params.dto';

/**
 * Creates a paginated list DTO for the specified item DTO type.
 * @remarks Used in Swagger documentation to represent paginated responses.
 * @param ItemDto - The DTO class representing the type of items in the paginated list.
 * @returns A new DTO class extending PaginatedListDto with the specified item type.
 * @example
 * ```ts
 *  const PaginatedUserDto = createPaginatedListDto(UserDto);
 *  @ApiOkResponse({ type: PaginatedUserDto })
 * ```
 */
export function createPaginatedListDto<TDto extends object>(
  ItemDto: new () => TDto,
) {
  @ApiExtraModels(ItemDto)
  class PaginatedGeneratedDto extends PaginatedListDto<TDto> {
    @ApiProperty({
      isArray: true,
      description: 'The list of items for the current page.',
      type: ItemDto,
    })
    @TransformType(() => ItemDto)
    items: TDto[];
  }

  Object.defineProperty(PaginatedGeneratedDto, 'name', {
    value: `${PaginatedListDto.name}<${ItemDto.name}>`,
  });

  return PaginatedGeneratedDto;
}

class PaginatedListDto<TDto extends object> extends PaginationParamsDto<TDto> {
  @ApiProperty({ description: 'The total number of items across all pages.' })
  totalCount: number;

  @ApiProperty({ description: 'The total number of pages available.' })
  totalPages: number;

  @ApiProperty({
    description: 'Indicates if there is a next page available.',
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Indicates if there is a previous page available.',
  })
  hasPreviousPage: boolean;
}
