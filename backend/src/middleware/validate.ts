import type { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

type Section = 'body' | 'query' | 'params';

interface ValidateInput {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

function toFields(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    fields[path || '_'] = issue.message;
  }
  return fields;
}

/**
 * Validates and (importantly) replaces `req.body/query/params` with the parsed,
 * type-coerced object so controllers only ever see clean data.
 */
export function validate(schemas: ValidateInput) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      for (const section of ['body', 'query', 'params'] as Section[]) {
        const schema = schemas[section];
        if (!schema) continue;
        const parsed = schema.parse(req[section]);
        // Reassign so downstream code operates on the coerced values.
        (req as unknown as Record<Section, unknown>)[section] = parsed;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError(toFields(error)));
        return;
      }
      next(error);
    }
  };
}

export { z };
