import { Prisma } from '@prisma/client';
import { DatabaseError } from './databaseErrors.js';

export class PrismaErrorHandler {
  static handle(error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors

      switch (error.code) {
        case 'P2002':
          // For unique constraint violations, provide more specific error messages
          const uniqueFields = error.meta?.target;
          if (uniqueFields) {
            if (uniqueFields.includes("email")) {
              return new DatabaseError('A user with this email already exists', {
                field: 'email',
                value: 'already in use'
              },400);
            }
            // Add more specific checks for other unique fields if needed
            return new DatabaseError(`Unique constraint violation on field(s): ${uniqueFields.join(', ')}`, {
              field: uniqueFields,
              value: 'already exists'
            });
          }
          return new DatabaseError('A unique constraint violation occurred');

        case 'P2014':
          return new DatabaseError('Invalid ID. The record you\'re trying to relate does not exist', {
            type: 'invalid_relation'
          });

        case 'P2003':
          return new DatabaseError('Foreign key constraint failed', {
            type: 'foreign_key_error'
          });

        case 'P2025':
          return new DatabaseError('User not found', {
            type: 'not_found'
          },404);

        default:
          return new DatabaseError(`Database error: ${error.message}`);
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return new DatabaseError('Invalid data provided to database operation', {
        type: 'validation_error'
      });
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return new DatabaseError('Failed to initialize database connection', {
        type: 'connection_error'
      });
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return new DatabaseError('An unexpected error occurred', {
        type: 'unknown_error'
      });
    }

    // If it's not a Prisma error, return the original error
    return error;
  }
}