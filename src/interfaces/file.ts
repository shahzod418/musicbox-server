export enum FileType {
  Audio = 'audio',
  Cover = 'cover',
  Avatar = 'avatar',
}

export enum RoleType {
  Artist = 'artist',
  User = 'user',
}

export type IFile = { data: Buffer; name: string };
