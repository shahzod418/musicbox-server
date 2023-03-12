export class UserAlreadyExists extends Error {
  constructor() {
    super();
    this.message = 'User already exists';
  }
}

export class InvalidPassword extends Error {
  constructor() {
    super();
    this.message = 'Invalid password';
  }
}
