import { KeyValueDto } from '@/dtos/cache.dto';

export interface ICacheService {
  getByKey(key: string): Promise<KeyValueDto>;

  updateByKey(key: string, value: string): Promise<KeyValueDto>;

  deleteByKey(key: string): Promise<boolean>;

  getKeys(): Promise<KeyValueDto[]>;

  reset(): Promise<boolean>;
}
