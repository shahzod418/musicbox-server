import Joi from 'joi';

import type { ICreateArtist, IUpdateArtist } from './profile.interface';

export const createArtistSchema = Joi.object<ICreateArtist>({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string(),
  userId: Joi.number().integer().positive().required(),
});

export const updateArtistSchema = Joi.object<IUpdateArtist>({
  name: Joi.string().min(3).max(30),
  description: Joi.string(),
});
