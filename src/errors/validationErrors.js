  // src/errors/validationErrors.js
  import { AppError } from "./AppError.js";
  export class ValidationError extends AppError {
    constructor(errors) {
      super('Validation Error', 400);
      this.errors = errors;
      this.isValidationError = true;
    }
  }
  