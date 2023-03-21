import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async userSignup(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signupUser(authCredentialsDto);
  }
}