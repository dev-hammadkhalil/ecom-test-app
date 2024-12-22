import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { responseFunction } from 'src/utils.ts/response-function';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(payload.email);

    if (!user?.data) {
      return responseFunction(401, 'Unauthorized');
    }

    const isValidPassword = await bcrypt.compare(
      payload.password,
      user?.data?.password,
    );

    if (!isValidPassword) {
      return responseFunction(401, 'Unauthorized');
    }

    const token = this.jwtService.sign({
      email: user.data.email,
      sub: user.data.id,
      role: user.data.role,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user?.data;
    userData.token = token;

    return responseFunction(200, 'Success', userData);
  }
}
