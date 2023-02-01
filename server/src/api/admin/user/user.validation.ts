import { Role } from '@prisma/client';
import Joi from 'joi';

import type { ICreateUser, IUpdateUser } from './user.interface';

export const createUserSchema = Joi.object<ICreateUser>({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).alphanum().required(),
  name: Joi.string().min(3).max(30),
  role: Joi.string().valid(...Object.values(Role)),
});

export const updateUserSchema = Joi.object<IUpdateUser>({
  email: Joi.string().email(),
  name: Joi.string().min(3).max(30),
  password: Joi.string().min(8).alphanum(),
  role: Joi.string().valid(...Object.values(Role)),
});
