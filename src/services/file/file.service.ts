import { createReadStream } from 'fs';
import { access, mkdir, readFile, rm, stat, writeFile } from 'fs/promises';
import { resolve } from 'path';

import { Injectable } from '@nestjs/common';

import { FileType, RoleType } from '@interfaces/file';

import type { IFile } from '@interfaces/file';
import type { ReadStream } from 'fs';

@Injectable()
export class FileService {
  public async addFile(
    id: number,
    role: RoleType,
    type: FileType,
    file: IFile,
  ): Promise<void> {
    const dirPath = this.getDirPath(id, role, type);

    try {
      await access(dirPath);
    } catch {
      await mkdir(dirPath, { recursive: true });
    }

    const { name, data } = file;

    await writeFile(this.getFilePath(id, role, type, name), data);
  }

  public createAudioStream(
    id: number,
    filename: string,
    start?: number,
    end?: number,
  ): ReadStream {
    return createReadStream(
      this.getFilePath(id, RoleType.Artist, FileType.Audio, filename),
      {
        start,
        end,
      },
    );
  }

  public getFile(
    id: number,
    role: RoleType,
    type: FileType,
    filename: string,
  ): Promise<Buffer> {
    return readFile(this.getFilePath(id, role, type, filename));
  }

  public async getSize(
    id: number,
    role: RoleType,
    type: FileType,
    filename: string,
  ): Promise<number> {
    const { size } = await stat(this.getFilePath(id, role, type, filename));

    return size;
  }

  public async updateFile(
    id: number,
    role: RoleType,
    type: FileType,
    currentFile: IFile,
    previousFilename?: string,
  ): Promise<void> {
    const dirPath = this.getDirPath(id, role, type);

    try {
      await access(dirPath);
    } catch {
      await mkdir(dirPath, { recursive: true });
    }

    if (previousFilename) {
      const filePath = this.getFilePath(id, role, type, previousFilename);

      try {
        await access(filePath);
        await rm(filePath);
      } catch {}
    }

    const { name, data } = currentFile;

    await writeFile(this.getFilePath(id, role, type, name), data);
  }

  public async removeFile(
    id: number,
    role: RoleType,
    type: FileType,
    filename: string,
  ): Promise<void> {
    const filePath = this.getFilePath(id, role, type, filename);

    try {
      await access(filePath);
      await rm(filePath);
    } catch {}
  }

  public removeResources(id: number, role: RoleType): Promise<void> {
    return rm(this.getResourcesDirPath(id, role), {
      recursive: true,
      force: true,
    });
  }

  private getDirPath(id: number, role: RoleType, type: FileType): string {
    return resolve('resources', `${role}${id}`, type);
  }

  private getFilePath(
    id: number,
    role: RoleType,
    type: FileType,
    filename: string,
  ): string {
    return resolve('resources', `${role}${id}`, type, filename);
  }

  private getResourcesDirPath(id: number, role: RoleType): string {
    return resolve('resources', `${role}${id}`);
  }
}
