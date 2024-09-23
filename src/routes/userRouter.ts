import { Router } from 'express';

//Import controllers
import { UserController } from '../controllers/UserController';

const userRouter: Router = Router();

userRouter.post('/create', UserController.createUser);

export default userRouter;
