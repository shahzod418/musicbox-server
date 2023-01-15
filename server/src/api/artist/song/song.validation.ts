import Joi from 'joi';

import type { ICreateSong, IUpdateSong } from './song.interface';

export const createSongSchema = Joi.object<ICreateSong>({
  name: Joi.string().min(3).max(30).required(),
  text: Joi.string(),
  artistId: Joi.number().required(),
  albumId: Joi.number(),
});

export const updateSongSchema = Joi.object<IUpdateSong>({
  name: Joi.string().min(3).max(30),
  text: Joi.string(),
  albumId: Joi.number(),
});
