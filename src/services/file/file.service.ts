import { createReadStream } from 'fs';
import { access, mkdir, readFile, rm, stat, writeFile } from 'fs/promises';
import { resolve } from 'path';

import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { FileType } from '@interfaces/file';

import type {
  IAddFileArgs,
  ICreateAudioStreamArgs,
  IGetDirPathArgs,
  IGetFileArgs,
  IGetFilePathArgs,
  IGetSizeArgs,
  IRemoveFileArgs,
  IUpdateFileArgs,
} from '@interfaces/file';
import type { ReadStream } from 'fs';

@Injectable()
export class FileService {
  // TODO: return boolean result
  public async addFile(args: IAddFileArgs): Promise<void> {
    const { id, role, type, file } = args;

    const dirPath = this.getDirPath({ id, role, type });

    try {
      await access(dirPath);
    } catch {
      await mkdir(dirPath, { recursive: true });
    }

    const { name, data } = file;

    await writeFile(this.getFilePath({ id, role, type, filename: name }), data);
  }

  public createAudioStream(args: ICreateAudioStreamArgs): ReadStream {
    const { id, filename, start, end } = args;

    const getFilePathArgs = {
      id,
      filename,
      role: Role.Artist,
      type: FileType.Audio,
    };

    return createReadStream(this.getFilePath(getFilePathArgs), { start, end });
  }

  public getFile(args: IGetFileArgs): Promise<Buffer> {
    return readFile(this.getFilePath(args));
  }

  public async getSize(args: IGetSizeArgs): Promise<number> {
    const { size } = await stat(this.getFilePath(args));

    return size;
  }

  // TODO: return boolean result
  public async updateFile(args: IUpdateFileArgs): Promise<void> {
    const { id, role, type, currentFile, previousFilename } = args;

    const dirPath = this.getDirPath({ id, role, type });

    try {
      await access(dirPath);
    } catch {
      await mkdir(dirPath, { recursive: true });
    }

    if (previousFilename) {
      const filePath = this.getFilePath({
        id,
        role,
        type,
        filename: previousFilename,
      });

      try {
        await access(filePath);
        await rm(filePath);
      } catch {}
    }

    const { name, data } = currentFile;

    await writeFile(this.getFilePath({ id, role, type, filename: name }), data);
  }

  // TODO: return boolean result and cache value
  public async removeFile(args: IRemoveFileArgs): Promise<void> {
    const filePath = this.getFilePath(args);

    try {
      await access(filePath);
      await rm(filePath);
    } catch {}
  }

  // TODO: return boolean result
  public removeResources(id: number, role: Role): Promise<void> {
    return rm(this.getResourcesDirPath(id, role), {
      recursive: true,
      force: true,
    });
  }

  private getDirPath(args: IGetDirPathArgs): string {
    const { id, role, type } = args;

    return resolve('resources', `${role}${id}`, type);
  }

  private getFilePath(args: IGetFilePathArgs): string {
    const { id, role, type, filename } = args;

    return resolve('resources', `${role}${id}`, type, filename);
  }

  private getResourcesDirPath(id: number, role: Role): string {
    return resolve('resources', `${role}${id}`);
  }
}
