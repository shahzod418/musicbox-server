import Joi from 'joi';

import type { ICreateSongBody, IUpdateSong } from './song.interface';

export const createSongSchema = Joi.object<ICreateSongBody>({
  name: Joi.string().min(3).max(30).required(),
  text: Joi.string(),
  albumId: Joi.number().integer().positive(),
});

export const updateSongSchema = Joi.object<IUpdateSong>({
  name: Joi.string().min(3).max(30),
  text: Joi.string(),
  albumId: Joi.number().integer().positive(),
});
