import Joi from 'joi';

import type { ISignData } from './auth.interface';

export const signSchema = Joi.object<ISignData>({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).alphanum().required(),
});
