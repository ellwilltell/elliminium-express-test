import { CACHE_TTL } from '@/config';

export class KeyValueDto {
  public key: string;
  public value: string;
  public createdAt: Date;
  public updatedAt: Date;
  public ttl: number;

  constructor(key: string, value: string, createdAt: Date, updatedAt: Date) {
    this.key = key;
    this.value = value;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.ttl = (Number(CACHE_TTL) || 10 * 1000) - (new Date().getTime() - this.createdAt.getTime());
  }
}
