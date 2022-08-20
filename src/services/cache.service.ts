import { CACHE_SIZE, CACHE_TTL, KEY_LENGTH } from '@/config';
import { KeyValueDto } from '@/dtos/cache.dto';
import { CacheDao } from '@/interfaces/cache-dao.interface';
import { ICacheService } from '@/interfaces/cache-service.interface';
import cacheModel from '@/models/cache.model';
import { randomString } from '@/utils/util';
import { logger } from '@utils/logger';

export class CacheService implements ICacheService {
  public keyValues = cacheModel;

  async getByKey(key: string): Promise<KeyValueDto> {
    const keyValue = await this.keyValues.findOne({ key });
    if (keyValue) {
      logger.log('info', 'Cache hit');
      const isExpired = this.isKeyExpired(keyValue.createdAt);
      if (isExpired) {
        const value = randomString(Number(KEY_LENGTH) || 10);
        const updated = await this.updateKeyValue(key, value, true, false);
        if (!updated) {
          throw new Error(`couldn't update key`);
        }
        return new KeyValueDto(updated.key, updated.value, updated.createdAt, updated.updateAt);
      } else {
        return new KeyValueDto(keyValue.key, keyValue.value, keyValue.createdAt, keyValue.updateAt);
      }
    } else {
      logger.log('info', 'Cache miss');
      const value = randomString(Number(KEY_LENGTH) || 10);
      const isExceedingCacheLimit = await this.exceededingCacheLimit();
      if (isExceedingCacheLimit) {
        const keyShoulDelete = (await this.getOldestKey()).key;
        await this.deleteByKey(keyShoulDelete);
      }
      const updated = await this.updateKeyValue(key, value, true, isExceedingCacheLimit ? false : true);
      return new KeyValueDto(updated.key, updated.value, updated.createdAt, updated.updateAt);
    }
  }

  public async updateByKey(key: string, value: string): Promise<KeyValueDto> {
    const current = await this.keyValues.findOne({ key });
    if (current && !this.isKeyExpired(current.createdAt)) {
      current.value = value;
      current.save();
      return new KeyValueDto(current.key, current.value, current.createdAt, current.updateAt);
    }
  }

  public async deleteByKey(key: string): Promise<boolean> {
    const deleteResult = await this.keyValues.deleteOne({ key });
    return deleteResult.deletedCount == 1;
  }

  public async getKeys(): Promise<KeyValueDto[]> {
    const allValues = [];
    const result = await this.keyValues.find().sort({ createdAt: -1 });
    result?.forEach(kv => {
      if (this.isKeyExpired(kv.createdAt)) {
        allValues.push(new KeyValueDto(kv.key, kv.value, kv.createdAt, kv.updateAt));
      }
    });
    return allValues;
  }
  public async reset(): Promise<boolean> {
    const result = await this.keyValues.deleteMany({});
    return result.acknowledged;
  }

  private async updateKeyValue(key: string, value: string, resetTimeStamp = false, upsert: boolean): Promise<CacheDao> {
    if (resetTimeStamp) {
      await this.deleteByKey(key);
      return this.keyValues.create({ key, value });
    }
    const updateResult = await this.keyValues.findOneAndUpdate({ key }, { key, value }, { upsert, new: true });
    return updateResult;
  }

  private isKeyExpired(createdAt: Date): boolean {
    return (Number(CACHE_TTL) || 10 * 1000) - (new Date().getTime() - createdAt.getTime()) < 0;
  }

  private async exceededingCacheLimit(): Promise<boolean> {
    const keysCount = await this.getKeysCount();
    const maxAllowed = Number(CACHE_SIZE) || 10;
    return keysCount >= maxAllowed;
  }

  private async getKeysCount(): Promise<number> {
    return await this.keyValues.count();
  }

  private async getOldestKey(): Promise<CacheDao> {
    const result = await this.keyValues.find().sort({ createdAt: -1 }).limit(1);
    return result?.[0];
  }
}
