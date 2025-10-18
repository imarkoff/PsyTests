import { Injectable, type LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'node:path';
import { UUID } from 'node:crypto';
import { FileStorageService } from './file-storage.interface';
import { FileSystemService } from './file-system/file-system.interface';
import { FileNotFoundError } from '../exceptions/file-storage/file-not-found.error';
import { FileNoAccessError } from '../exceptions/file-storage/file-no-access.error';
import { UUIDValidator } from '../validations/uuid-validator/uuid-validator.interface';
import { FileStorageEntityValidator } from './validations/file-storage-entity-validator/file-storage-entity-validator.interface';
import { PathTraversalValidator } from './validations/path-traversal-validator/path-traversal-validator.interface';
import { DirectoryNotFoundError } from '../exceptions/file-storage/directory-not-found.error';
import { EntityIsInvalidError } from '../exceptions/file-storage/entity-is-invalid.error';
import { UUIDIsInvalidError } from '../exceptions/file-storage/uuid-is-invalid.error';

@Injectable()
export class FileStorageServiceImpl implements FileStorageService {
  private readonly basePath: string;
  private readonly entityFileName: string;

  constructor(
    private readonly fs: FileSystemService,
    private readonly uuidValidator: UUIDValidator,
    private readonly entityValidator: FileStorageEntityValidator,
    private readonly pathTraversalValidator: PathTraversalValidator,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.basePath = this.configService.get<string>('fileDbBasePath')!;
    this.entityFileName = this.configService.get<string>(
      'fileDbEntityFileName',
    )!;
  }

  async getById<T>(entity: string, id: UUID): Promise<T | null> {
    this.validateEntityAndId(entity, id);

    const filePath = this.getEntityJsonPath(entity, id);

    try {
      const fileContent = await this.fs.readFile(filePath, {
        encoding: 'utf-8',
      });

      return JSON.parse(fileContent as string) as T;
    } catch (error) {
      if (error instanceof FileNotFoundError) {
        return null;
      }
      if (error instanceof FileNoAccessError) {
        this.logger.error(`No access to file at ${filePath}:`, error);
        return null;
      }
      this.logger.error(`Error reading file at ${filePath}:`, error);
      throw error;
    }
  }

  async getAll<T>(entity: string): Promise<T[]> {
    if (!this.entityValidator.isValid(entity)) {
      throw new EntityIsInvalidError(`Invalid entity name.`);
    }

    const entitiesPath = path.join(this.basePath, entity);

    const ids = await this.fs.readDir(entitiesPath).catch((error) => {
      if (error instanceof DirectoryNotFoundError) {
        throw new EntityIsInvalidError('The specified entity does not exist.');
      }
      this.logger.error(`Error reading directory at ${entitiesPath}:`, error);
      throw error;
    });

    const entities = [];

    for (const id of ids) {
      const entityData = await this.getById<T>(entity, id as UUID);
      if (entityData) {
        entities.push(entityData);
      }
    }

    return entities;
  }

  async getEntityFile(
    entity: string,
    id: UUID,
    filePath: string,
  ): Promise<string | Buffer | null> {
    this.validateEntityAndId(entity, id);

    const basePath = this.getEntityBasePath(entity, id);
    const fullPath = path.join(basePath, filePath);

    if (!this.pathTraversalValidator.isValid(basePath, fullPath)) {
      this.logger.error('Path traversal attempt detected:', filePath);
      return null;
    }

    try {
      return await this.fs.readFile(fullPath);
    } catch (error) {
      if (error instanceof FileNotFoundError) {
        return null;
      }
      this.logger.error(`Error reading file at ${fullPath}:`, error);
      return null;
    }
  }

  private validateEntityAndId(entity: string, id: UUID): void {
    if (!this.entityValidator.isValid(entity)) {
      throw new EntityIsInvalidError(`Invalid entity name.`);
    }

    if (!this.uuidValidator.isValid(id)) {
      throw new UUIDIsInvalidError(`Invalid UUID has been provided.`);
    }
  }

  private getEntityBasePath(entity: string, id: UUID): string {
    return path.join(this.basePath, entity, id);
  }

  private getEntityJsonPath(entity: string, id: UUID): string {
    return path.join(this.getEntityBasePath(entity, id), this.entityFileName);
  }
}
