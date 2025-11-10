import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description:
    'Additional information about the marks system of the psychological test. ' +
    'Includes details on how marks are assigned and any relevant criteria. ' +
    'Each psychological test may have its own unique marks system.',
})
export class MarksSystemDto {
  @ApiProperty({
    example:
      'The marks system for this test is based on a scale ' +
      'from 0 to 100 where higher scores indicate better performance. ' +
      'Scores are categorized as follows: 0-40 (Poor), 41-70 (Average), 71-100 (Excellent).',
  })
  marksSystem: string;

  @ApiProperty({
    example:
      'Please refer to the test manual for detailed scoring criteria ' +
      'and interpretation of results.',
  })
  additionalInfo: string;
}
