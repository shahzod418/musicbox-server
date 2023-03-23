import { createReadStream } from 'fs';
import { access, mkdir, readFile, rm, stat, writeFile } from 'fs/promises';
import { resolve } from 'path';

import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import {
  FileNotFoundError,
  FileNotRecordError,
  FileNotRemovedError,
  FileNotUpdatedError,
  ResourcesNotRemovedError,
} from '@errors/file';

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
  public async addFile(args: IAddFileArgs): Promise<void> {
    const { id, role, type, file } = args;

    const dirPath = this.getDirPath({ id, role, type });

    try {
      await access(dirPath);
    } catch {
      await mkdir(dirPath, { recursive: true });
    }

    const { name, data } = file;

    try {
      await writeFile(
        this.getFilePath({ id, role, type, filename: name }),
        data,
      );
    } catch {
      throw new FileNotRecordError();
    }
  }

  public createAudioStream(args: ICreateAudioStreamArgs): ReadStream {
    const { id, filename, start, end } = args;

    const getFilePathArgs = {
      id,
      filename,
      role: Role.Artist,
      type: FileType.Audio,
    };

    try {
      return createReadStream(this.getFilePath(getFilePathArgs), {
        start,
        end,
      });
    } catch {
      throw new FileNotFoundError(FileType.Audio);
    }
  }

  public getFile(args: IGetFileArgs): Promise<Buffer> {
    try {
      return readFile(this.getFilePath(args));
    } catch {
      throw new FileNotFoundError(args.type);
    }
  }

  public async getSize(args: IGetSizeArgs): Promise<number> {
    try {
      const { size } = await stat(this.getFilePath(args));

      return size;
    } catch {
      throw new FileNotFoundError(args.type);
    }
  }

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
        await rm(filePath);
      } catch {
        throw new FileNotUpdatedError();
      }
    }

    const { name, data } = currentFile;

    try {
      await writeFile(
        this.getFilePath({ id, role, type, filename: name }),
        data,
      );
    } catch {
      throw new FileNotUpdatedError();
    }
  }

  public async removeFile(args: IRemoveFileArgs): Promise<void> {
    const filePath = this.getFilePath(args);

    try {
      await rm(filePath);
    } catch {
      throw new FileNotRemovedError();
    }
  }

  public removeResources(id: number, role: Role): Promise<void> {
    try {
      return rm(this.getResourcesDirPath(id, role), {
        recursive: true,
        force: true,
      });
    } catch {
      throw new ResourcesNotRemovedError();
    }
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
