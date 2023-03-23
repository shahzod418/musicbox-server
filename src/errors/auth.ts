export class UserExistError extends Error {
  constructor() {
    super();
    this.message = 'User already exists';
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super();
    this.message = 'Invalid password';
  }
}
