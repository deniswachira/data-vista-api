import {Hono} from 'hono';
import { zValidator } from '@hono/zod-validator';
import {updateUserValidator } from '../validators/user.validator';
import {  checkUserIsPremium, getUserById,  updateUser, upgradeToPremium } from './user.controller';
// import { adminRoleAuth } from '../middleWare/bearAuth';


export const userRouter = new Hono();


//get a single user    api/users/1
userRouter.get("/users/:user_id", getUserById)

//update a user
userRouter.put("/users/:user_id", zValidator('json',updateUserValidator,(result,c)=>{    if(!result.success) return c.text( result.error.message + "😒",400)}), updateUser)

//check if user is premium
userRouter.get("/users/:user_id/isPremium", checkUserIsPremium)

//upgrade user to premium
userRouter.put("/users/:user_id/upgrade",  upgradeToPremium)
