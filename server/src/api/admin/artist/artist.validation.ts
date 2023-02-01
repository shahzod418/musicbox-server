import { Status } from '@prisma/client';
import Joi from 'joi';

import type { ICreateArtist, IUpdateArtist } from './artist.interface';

export const createArtistSchema = Joi.object<ICreateArtist>({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string(),
  status: Joi.string().valid(...Object.values(Status)),
  userId: Joi.number().integer().positive().required(),
});

export const updateArtistSchema = Joi.object<IUpdateArtist>({
  name: Joi.string().min(3).max(30),
  description: Joi.string(),
  status: Joi.string().valid(...Object.values(Status)),
});
