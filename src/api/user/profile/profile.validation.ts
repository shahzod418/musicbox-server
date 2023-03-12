import Joi from 'joi';

import type { IUpdateUser } from './profile.interface';

export const updateUserSchema = Joi.object<IUpdateUser>({
  name: Joi.string().min(3).max(30),
});
