import { Router } from 'express';

//Import controllers
import { UserController } from '../controllers/UserController';

import verifyTokenMiddleware from '../middlewares/verifyTokenMiddleware';

const userRouter: Router = Router();

userRouter.post('/create', UserController.createUser);
userRouter.put('/update', verifyTokenMiddleware, UserController.updateUser);
userRouter.get('/', verifyTokenMiddleware, UserController.getUser);

export default userRouter;
