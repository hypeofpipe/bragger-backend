import {
  Get,
  Post,
  CurrentUser,
  BodyParam,
  InternalServerError,
  Authorized,
  JsonController,
  BadRequestError,
} from 'routing-controllers';
import { Twit } from '../entities/Twit';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

@JsonController('/twit')
export class TwitController {
  @Authorized()
  @Get('/')
  async getAll(): Promise<{ twits: Twit[] }> {
    const twits = await getRepository(Twit).find();

    return {
      twits,
    };
  }

  @Authorized()
  @Post('/')
  async create(
    @BodyParam('message') message: string,
    @CurrentUser() author?: User,
  ): Promise<{ success: boolean }> {
    if (!message) {
      throw new BadRequestError('Provide message please');
    }
    if (!author) {
      console.error(author);
      throw new InternalServerError('Something went wrong');
    }
    const twit = await getRepository(Twit).save(
      new Twit(message, author, new Date().toDateString()),
    );

    return {
      success: !!twit,
    };
  }
}
