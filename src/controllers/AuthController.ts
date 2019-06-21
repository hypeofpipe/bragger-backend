import {
  Controller,
  Post,
  BodyParam,
  BadRequestError,
} from 'routing-controllers';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

interface Result {
  success: boolean;
  message: string;
  token: string | undefined;
}
@Controller()
export class AuthController {
  @Post('/register')
  async register(
    @BodyParam('nickname') nickname: string,
    @BodyParam('password') password: string,
  ): Promise<Result> {
    const existUser: User | undefined = await getRepository(User).findOne({
      nickname,
    });
    if (existUser) throw new BadRequestError('User already exists!');
    const hashedPassword: string = await bcrypt.hash(password, 8);
    const user: User = await getRepository(User).save(
      new User({ nickname, password: hashedPassword }),
    );
    const token: string | undefined = !!user
      ? jwt.sign({ userId: user.id }, 'mommy')
      : undefined;

    return {
      success: !!user,
      message: 'User has been registered!',
      token,
    };
  }

  @Post('/login')
  async login(
    @BodyParam('nickname') nickname: string,
    @BodyParam('password') password: string,
  ): Promise<Result> {
    const user: User | undefined = await getRepository(User).findOne({
      nickname,
    });
    const success: boolean =
      !!user && (await bcrypt.compare(password, user.password));
    const token: string | undefined = !!user
      ? jwt.sign({ userId: user.id }, 'mommy')
      : undefined;

    return {
      success,
      message: 'User has been successfully logged in!',
      token,
    };
  }
}
