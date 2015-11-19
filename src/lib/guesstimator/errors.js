function createError(name) {
  function CustomError(message) {
    this.name = name;
    this.message = message || 'Default Message';
    this.stack = (new Error()).stack;
  }
  CustomError.prototype = Object.create(Error.prototype);
  CustomError.prototype.constructor = MyError;
  return CustomError
}

export const EvilError = createError('evil')
