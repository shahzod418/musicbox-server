import { Status } from '@prisma/client';
import Joi from 'joi';

import type { ICreateSong, IUpdateSong } from './song.interface';

export const createSongSchema = Joi.object<ICreateSong>({
  name: Joi.string().min(3).max(30).required(),
  text: Joi.string(),
  explicit: Joi.boolean(),
  status: Joi.string().valid(...Object.values(Status)),
  artistId: Joi.number().integer().positive().required(),
  albumId: Joi.number().integer().positive(),
});

export const updateSongSchema = Joi.object<IUpdateSong>({
  name: Joi.string().min(3).max(30),
  text: Joi.string(),
  explicit: Joi.boolean(),
  status: Joi.string().valid(...Object.values(Status)),
  albumId: Joi.number().integer().positive(),
});
