import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
  }

  async signupUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = this.userRepository.create({ username, password });
    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
