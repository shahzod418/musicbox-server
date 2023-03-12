import Joi from 'joi';

import type { ICreateAlbum, IUpdateAlbum } from './album.interface';

export const createAlbumSchema = Joi.object<ICreateAlbum>({
  name: Joi.string().min(3).max(30).required(),
  artistId: Joi.number().integer().positive().required(),
});

export const updateAlbumSchema = Joi.object<IUpdateAlbum>({
  name: Joi.string().min(3).max(30),
});
