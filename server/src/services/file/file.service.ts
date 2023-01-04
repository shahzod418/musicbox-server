import { access, mkdir, readFile, rm, writeFile } from 'fs/promises';
import { resolve } from 'path';

import { Injectable } from '@nestjs/common';

import type { FileType, RoleType } from '@interfaces/file';

@Injectable()
export class FileService {
  public async addFile(
    id: number,
    role: RoleType,
    type: FileType,
    file: Express.Multer.File,
  ): Promise<void> {
    const dirPath = this.getDirPath(id, role, type);

    try {
      await access(dirPath);
    } catch {
      await mkdir(dirPath);
    }

    await writeFile(
      this.getFilePath(id, role, type, file.originalname),
      file.buffer,
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

  public async updateFile(
    id: number,
    role: RoleType,
    type: FileType,
    currentFile: Express.Multer.File,
    previousFilename?: string,
  ): Promise<void> {
    if (previousFilename) {
      await rm(this.getFilePath(id, role, type, previousFilename));
    }

    await writeFile(
      this.getFilePath(id, role, type, currentFile.originalname),
      currentFile.buffer,
    );
  }

  public removeFile(
    id: number,
    role: RoleType,
    type: FileType,
    filename: string,
  ): Promise<void> {
    return rm(this.getFilePath(id, role, type, filename));
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
