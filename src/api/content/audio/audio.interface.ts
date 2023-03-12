import type { ReadStream } from 'fs';

export type IAudioStream = {
  stream: ReadStream;
  size: number;
  start?: number;
  end?: number;
};
