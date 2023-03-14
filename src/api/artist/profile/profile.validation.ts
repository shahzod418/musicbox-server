import Joi from 'joi';

import type { ICreateArtistBody, IUpdateArtist } from './profile.interface';

export const createArtistSchema = Joi.object<ICreateArtistBody>({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string(),
});

export const updateArtistSchema = Joi.object<IUpdateArtist>({
  name: Joi.string().min(3).max(30),
  description: Joi.string(),
});
