import Joi from 'joi';

import type {
  ICreatePlaylistBody,
  IUpdatePlaylist,
} from './playlist.interface';

export const createPlaylistSchema = Joi.object<ICreatePlaylistBody>({
  name: Joi.string().min(3).max(30).required(),
});

export const updatePlaylistSchema = Joi.object<IUpdatePlaylist>({
  name: Joi.string().min(3).max(30),
});
