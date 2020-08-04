import { SetMetadata } from '@nestjs/common';

/**
 * Set Metadata
 *
 * @param args
 */
export const Roles = (...args: string[]) => SetMetadata('roles', args);
