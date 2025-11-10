import { ApiSchema } from '@nestjs/swagger';
import { PsyTestDto } from './psy-test.dto';

@ApiSchema({
  description:
    'Includes all properties of PsyTest plus dynamic additional properties.',
  // @ts-expect-error 2353 - additionalProperties is valid here
  additionalProperties: true,
})
export class PsyTestWithDetailsDto extends PsyTestDto {
  [key: string]: any;
}
