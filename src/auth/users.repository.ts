import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export interface UsersRepository extends Repository<User> {
  this: Repository<User>;

  createUser: any;
}

export const customUserRepositoryMethods: Pick<UsersRepository, 'createUser'> =
  {
    async createUser(
      this: Repository<User>,
      authCredentialsDto: AuthCredentialsDto,
    ) {
      const { username, password } = authCredentialsDto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await this.create({
        username,
        password: hashedPassword,
      });
      try {
        await this.save(user);
      } catch (e) {
        // duplicate username
        if (e.code === '23505') {
          throw new ConflictException('Username already exist');
        } else {
          throw new InternalServerErrorException();
        }
      }
    },
  };
