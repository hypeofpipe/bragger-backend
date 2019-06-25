import 'reflect-metadata';
import { createExpressServer, Action } from 'routing-controllers';
import { createConnection } from 'typeorm';
import { User } from './entities/User';
import { Twit } from './entities/Twit';
import { AuthController } from './controllers/AuthController';
import { findOneByToken } from './auth/Helper';
import { TwitController } from './controllers/TwitController';
require('dotenv').config();

if (!process.env.DB_URL) {
  throw new Error('Please, specify correct DB url.');
}

createConnection({
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [Twit, User],
  synchronize: true,
})
  .then(async connection => {
    const app = createExpressServer({
      controllers: [AuthController, TwitController],
      authorizationChecker: async (action: Action, roles: string[]) => {
        const token = action.request.headers['authorization'];

        const user = await findOneByToken(token);
        if (user) return true;

        return false;
      },
      currentUserChecker: async (action: Action) => {
        const token = action.request.headers['authorization'];
        return await findOneByToken(token);
      },
      cors: true,
    });

    console.log('Running on 4000');
    app.listen(4000);
  })
  .catch(err => console.error(err));
