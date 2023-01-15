import { BadRequestException, Injectable } from '@nestjs/common';
import Joi from 'joi';

import type { PipeTransform } from '@nestjs/common';

@Injectable()
export class BodyValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: Joi.ObjectSchema<T>) {}

  async transform(value: T): Promise<T> {
    try {
      const data = await this.schema.validateAsync(value, {
        convert: true,
        errors: {
          wrap: {
            label: false,
          },
        },
      });
      return data;
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        throw new BadRequestException(error.details.at(0).message);
      }

      throw error;
    }
  }
}
