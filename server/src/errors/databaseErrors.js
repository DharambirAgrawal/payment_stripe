
// utils/errors/DatabaseError.js
import { AppError } from './AppError.js';


export class DatabaseError extends AppError {

  constructor(message,metadata = {},statusCode=500) {
    super(message || 'Database Error', 500);
    this.isDatabaseError = true;
    this.metadata = metadata;
    this.isOperational=true
    this.statusCode=statusCode
  }
}