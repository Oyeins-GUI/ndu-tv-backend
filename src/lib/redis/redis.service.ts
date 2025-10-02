import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { IRedisCacheService } from './redis.interface';
import { CustomLogger } from '../logger/logger.service';
import { env } from '../../config';

@Injectable()
export class RedisCacheService implements IRedisCacheService, OnModuleInit {
  private readonly client: RedisClientType;
  private readonly DEFAULT_TTL = 60 * 60 * 24; // default ttl for redis

  constructor(private readonly logger: CustomLogger) {
    this.logger.setContext(RedisCacheService.name);
    this.logger.debug(env.REDIS_URL);
    this.client = createClient({
      url: env.REDIS_URL,
    });
    this.client.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.debug('✅ Connected to Redis successfully');
    } catch (err) {
      this.logger.error('❌ Failed to connect to Redis:', err);
      throw new Error(`Redis connection failed: ${err.message}`);
    }
  }

  public async delete(target: string | string[]): Promise<number> {
    try {
      return await this.client.del(target);
    } catch (error) {
      this.logger.warn(
        `Error deleting key or keys ${target}, error: ${error.message}`,
      );
      return 0;
    }
  }

  public async setString(
    key: string,
    value: string | number,
    ttl: number = this.DEFAULT_TTL,
  ): Promise<string | null> {
    try {
      const result = await this.client.set(key, value);
      if (ttl > 0) await this.client.expire(key, ttl);
      return result;
    } catch (error) {
      this.logger.warn(`Error setting string value, Error: ${error.message}`);
      return null;
    }
  }

  public async setStringIfNotExists(
    key: string,
    value: string | number,
    ttl: number = this.DEFAULT_TTL,
  ): Promise<string | null> {
    try {
      const result = await this.client.set(key, value, { NX: true });
      if (ttl > 0) await this.client.expire(key, ttl);
      return result;
    } catch (error) {
      this.logger.warn(`Error setting string value, Error: ${error.message}`);
      return null;
    }
  }

  public async incrementStringCounter(key: string): Promise<number | null> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      this.logger.warn(
        `Error incrementing string counter, Error: ${error.message}`,
      );
      return null;
    }
  }

  public async getStringValue(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.warn(`Error getting string value, Error: ${error.message}`);
      return null;
    }
  }

  public async setHash<T extends Record<string, string | number | unknown>>(
    key: string,
    value: T,
    ttl: number = this.DEFAULT_TTL,
  ): Promise<number> {
    try {
      const entries = Object.entries(value) as any;
      const result = await this.client.hSet(key, [...entries]);
      if (ttl > 0) await this.client.expire(key, ttl);
      return result;
    } catch (error) {
      this.logger.warn(
        `Error setting hash for key ${key}, Erorr: ${error}`,
        error,
      );
      return 0;
    }
  }

  public async setHashFieldValue(
    key: string,
    field: string,
    value: string | number | unknown,
  ): Promise<number> {
    try {
      const result = await this.client.hSet(key, field, value as any);
      return result;
    } catch (error) {
      this.logger.warn(`Error setting hash for key ${key}`);
      return 0;
    }
  }

  public async setHashFieldExpiry(
    key: string,
    fields: string[] | string,
    ttl: number,
  ): Promise<void> {
    try {
      await this.client.hExpire(key, fields, ttl);
    } catch (error) {
      this.logger.error(
        `Error setting hash field expiry  in Redis for key ${key}, error: ${error}`,
      );
    }
  }

  public async getHashField(
    key: string,
    field: string,
  ): Promise<string | null> {
    try {
      return await this.client.hGet(key, field);
    } catch (error) {
      this.logger.error(
        `Error getting field ${field} from Redis hash ${key}:`,
        error,
      );
      return null;
    }
  }

  public async getAllHashFields(
    key: string,
  ): Promise<Record<string, string> | null> {
    try {
      return await this.client.hGetAll(key);
    } catch (error) {
      this.logger.error(
        `Error getting all fields from Redis hash ${key}:`,
        error,
      );
      return null;
    }
  }

  public async getTypedHashFields<
    T extends Record<string, string | number | unknown>,
  >(key: string): Promise<T | null> {
    try {
      const result = await this.client.hGetAll(key);
      return result as unknown as T;
    } catch (error) {
      this.logger.error(
        `Error getting all fields from Redis hash ${key}:`,
        error,
      );
      return null;
    }
  }

  public async addToSet(
    key: string,
    value: string,
    ttl?: number,
  ): Promise<number> {
    try {
      const result = await this.client.sAdd(key, value);

      if (ttl && ttl > 0) {
        await this.client.expire(key, ttl);
      }

      return result;
    } catch (error) {
      this.logger.warn(
        `Error adding value to set ${key}, Error: ${error.message}`,
      );
      return 0;
    }
  }

  public async getSetMembers(key: string): Promise<string[]> {
    try {
      return await this.client.sMembers(key);
    } catch (error) {
      this.logger.warn(
        `Error getting members from set ${key}, Error: ${error.message}`,
      );
      return [];
    }
  }

  public async removeFromSet(key: string, value: string): Promise<number> {
    try {
      return await this.client.sRem(key, value);
    } catch (error) {
      this.logger.warn(
        `Error removing value from set ${key}, Error: ${error.message}`,
      );
      return 0;
    }
  }

  public async isMemberOfSet(key: string, value: string): Promise<boolean> {
    try {
      const result = await this.client.sIsMember(key, value);
      return result === 1;
    } catch (error) {
      this.logger.warn(
        `Error checking set membership in ${key}, Error: ${error.message}`,
      );
      return false;
    }
  }
}
