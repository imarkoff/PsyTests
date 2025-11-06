import { NotFoundException } from '@nestjs/common';

export class PsyTestImageNotFoundException extends NotFoundException {
  constructor(testId: string, imagePath: string) {
    super(
      `Image '${imagePath}' for psychological test with ID '${testId}' not found.`,
    );
  }
}
