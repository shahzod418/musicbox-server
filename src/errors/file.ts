import type { FileType } from '@interfaces/file';

export class FileNotFoundError extends Error {
  constructor(fileType: FileType) {
    super();
    this.message = `${fileType.at(0).toUpperCase()}${fileType.slice(
      1,
    )} not found`;
  }
}

export class FileNotRecordError extends Error {
  constructor() {
    super('File not recorded');
  }
}

export class FileNotUpdatedError extends Error {
  constructor() {
    super('File not updated');
  }
}

export class FileNotRemovedError extends Error {
  constructor() {
    super('File not removed');
  }
}

export class ResourcesNotRemovedError extends Error {
  constructor() {
    super('Resources not removed');
  }
}
