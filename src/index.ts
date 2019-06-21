import 'reflect-metadata'; // this shim is required
import { createExpressServer, Action } from 'routing-controllers';
import { AuthController } from './controllers/AuthController';

const app = createExpressServer({
  controllers: [AuthController], // we specify controllers we want to use
  authorizationChecker: async (action: Action, roles: string[]) => {
    // here you can use request/response objects from action
    // also if decorator defines roles it needs to access the action
    // you can use them to provide granular access check
    // checker must return either boolean (true or false)
    // either promise that resolves a boolean value
    // demo code:
    const token = action.request.headers['authorization'];

    const user = await getEntityManager().findOneByToken(User, token);
    if (user) return true;

    return false;
  },
});

console.log('Running on 3000');
// run express application on port 3000
app.listen(3000);
