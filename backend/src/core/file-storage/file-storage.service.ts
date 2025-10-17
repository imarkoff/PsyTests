import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'node:path';
import { validate as validateUUID } from 'uuid';
import { UUID } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { FileStorageService } from './file-storage.interface';

@Injectable()
export class FileStorageServiceImpl implements FileStorageService {
  private readonly basePath: string;
  private readonly entityFileName = 'entity.json';

  constructor(private readonly configService: ConfigService) {
    this.basePath = this.configService.get<string>('fileDbBasePath')!;
  }

  async getById<T>(entity: string, id: UUID): Promise<T | null> {
    if (!this.isEntityValid(entity)) {
      throw new Error(`Invalid entity name.`);
    }

    if (!validateUUID(id)) {
      throw new TypeError(`Invalid UUID has been provided.`);
    }

    const filePath = path.join(this.basePath, entity, id, this.entityFileName);

    try {
      const fileContent = await readFile(filePath, { encoding: 'utf-8' });
      return JSON.parse(fileContent) as T;
    } catch (error) {
      console.error(`Error reading or parsing file at ${filePath}:`, error);
      return null;
    }
  }

  async getAll<T>(entity: string): Promise<T[]> {
    const entitiesPath = path.join(this.basePath, entity);

    const ids = await readdir(entitiesPath).catch(() => {
      throw new Error(`The specified entity does not exist.`);
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
  ): Promise<Buffer | null> {
    if (!this.isEntityValid(entity)) {
      throw new Error(`Invalid entity name.`);
    }

    if (!validateUUID(id)) {
      throw new TypeError(`Provided id is not a valid UUID.`);
    }

    if (this.isPathTraversalAttempt(entity, id, filePath)) {
      console.error('Path traversal attempt detected:', filePath);
      return null;
    }

    const fullPath = path.join(this.basePath, entity, id, filePath);

    try {
      return await readFile(fullPath);
    } catch (error) {
      console.error(`Error reading file at ${fullPath}:`, error);
      return null;
    }
  }

  private isEntityValid(entity: string): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(entity);
  }

  private isPathTraversalAttempt(
    entity: string,
    id: string,
    filePath: string,
  ): boolean {
    const fullPath = path.normalize(
      path.join(this.basePath, entity, id, filePath),
    );
    const expectedBasePath = path.normalize(
      path.join(this.basePath, entity, id),
    );
    return !fullPath.startsWith(expectedBasePath);
  }
}
