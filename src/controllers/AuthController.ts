import {
  Controller,
  Param,
  Body,
  Post,
  BodyParam,
  BadRequestError,
} from 'routing-controllers';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

@Controller()
export class AuthController {
  @Post('/register')
  async register(
    @BodyParam('nickname') nickname: string,
    @BodyParam('password') password: string,
  ) {
    const existUser = await getRepository(User).findOne({ nickname: nickname });
    if (existUser) throw new BadRequestError('User already exists!');
    const user = await getRepository(User).save(
      new User({ nickname, password }),
    );
  }

  @Post('/login')
  login() {
    return 'token';
  }
}
