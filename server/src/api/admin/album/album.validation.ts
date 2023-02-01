import { Status } from '@prisma/client';
import Joi from 'joi';

import type { ICreateAlbum, IUpdateAlbum } from './album.interface';

export const createAlbumSchema = Joi.object<ICreateAlbum>({
  name: Joi.string().min(3).max(30).required(),
  status: Joi.string().valid(...Object.values(Status)),
  artistId: Joi.number().integer().positive().required(),
});

export const updateAlbumSchema = Joi.object<IUpdateAlbum>({
  name: Joi.string().min(3).max(30),
  status: Joi.string().valid(...Object.values(Status)),
});
