import type { Role } from '@prisma/client';

export enum FileType {
  Audio = 'audio',
  Cover = 'cover',
  Avatar = 'avatar',
}

export type IFile = { data: Buffer; name: string };

export type IAddFileArgs = {
  id: number;
  role: Role;
  type: FileType;
  file: IFile;
};

export type ICreateAudioStreamArgs = {
  id: number;
  filename: string;
  start?: number;
  end?: number;
};

export type IGetFileArgs = {
  id: number;
  role: Role;
  type: FileType;
  filename: string;
};

export type IGetSizeArgs = {
  id: number;
  role: Role;
  type: FileType;
  filename: string;
};

export type IUpdateFileArgs = {
  id: number;
  role: Role;
  type: FileType;
  currentFile: IFile;
  previousFilename?: string;
};

export type IRemoveFileArgs = {
  id: number;
  role: Role;
  type: FileType;
  filename: string;
};

export type IGetDirPathArgs = {
  id: number;
  role: Role;
  type: FileType;
};

export type IGetFilePathArgs = {
  id: number;
  role: Role;
  type: FileType;
  filename: string;
};
