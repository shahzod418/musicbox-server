import Joi from 'joi';

import type { ICreatePlaylist, IUpdatePlaylist } from './playlist.interface';

export const createPlaylistSchema = Joi.object<ICreatePlaylist>({
  name: Joi.string().min(3).max(30).required(),
  userId: Joi.number().required(),
});

export const updatePlaylistSchema = Joi.object<IUpdatePlaylist>({
  name: Joi.string().min(3).max(30),
});
