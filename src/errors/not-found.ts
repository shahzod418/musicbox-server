import type { FileType } from '@interfaces/file';

export class NotFoundError extends Error {
  constructor(fileType: FileType) {
    super();
    this.message = `${fileType.at(0).toUpperCase()}${fileType.slice(
      1,
    )} not found`;
  }
}
