import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { responseFunction } from 'src/utils.ts/response-function';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const alreadyExists = await this.findOneByEmail(createUserDto.email);

    if (alreadyExists.data) {
      return responseFunction(400, 'User already exists');
    }

    const newUserData = this.userRepository.create(createUserDto);
    const newUser = await this.userRepository.save(newUserData);

    return responseFunction(201, 'User created successfully', newUser);
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    if (!user) {
      return responseFunction(404, 'Not found');
    }

    return responseFunction(200, 'Success', result);
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return responseFunction(404, 'Not found', null);
    }

    return responseFunction(200, 'Success', user);
  }
}
