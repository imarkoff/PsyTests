import { PsyTest } from '../../domain/entities/psy-test.entity';
import { PsyTestDto } from '../../presentation/dtos/psy-test.dto';
import { PsyTestWithDetails } from '../../domain/entities/psy-test-with-details.entity';
import { PsyTestWithDetailsDto } from '../../presentation/dtos/psy-test-with-details.dto';

export class PsyTestMapper {
  static toDto(entity: PsyTest): PsyTestDto {
    const dto = new PsyTestDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.type = entity.type;
    return dto;
  }

  static withDetailsToDto(entity: PsyTestWithDetails): PsyTestWithDetailsDto {
    const dto = new PsyTestWithDetailsDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.type = entity.type;
    Object.assign(dto, entity);
    return dto;
  }
}
