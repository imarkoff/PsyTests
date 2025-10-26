import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { User } from '../../users/domain/entities/user.entity';
import { UserFromAuth } from '../../core/decorators/user-from-auth.decorator';
import { UserMapper } from '../../users/application/mappers/user.mapper';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@UserFromAuth() user: User) {
    return UserMapper.toDto(user);
  }
}
