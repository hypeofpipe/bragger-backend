import 'reflect-metadata';
import { createExpressServer, Action } from 'routing-controllers';
import { AuthController } from './controllers/AuthController';
import { findOneByToken } from './auth/Helper';

const app = createExpressServer({
  controllers: [AuthController],
  authorizationChecker: async (action: Action, roles: string[]) => {
    const token = action.request.headers['authorization'];

    const user = await findOneByToken(token);
    if (user) return true;

    return false;
  },
});

console.log('Running on 3000');
app.listen(3000);
