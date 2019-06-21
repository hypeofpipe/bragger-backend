import { User } from '../entities/User';
import * as JWT from 'jsonwebtoken';
import { getRepository } from 'typeorm';

export const findOneByToken = async (
  token: string,
): Promise<User | undefined> => {
  const payload = JWT.verify(token, 'mommy');
  if (typeof payload === 'string') {
    console.log('Bad payload', payload);
    return;
  }
  const user = await getRepository(User).findOne(
    (payload as { userId: number }).userId,
  );

  return user;
};
