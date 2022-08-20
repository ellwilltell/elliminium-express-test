import { Request, Response } from 'express';
import { ResponseDto } from '@/dtos/base-response.dto';
import { ErrorDto } from '@/dtos/base-error.dto';
import { CacheService } from '@/services/cache.service';

class CacheController {
  cacheService: CacheService;

  constructor() {
    this.cacheService = new CacheService();
  }

  public getAllKeys = async (req: Request, res: Response) => {
    try {
      const result = await this.cacheService.getKeys();
      return ResponseDto.New(res, result, 200);
    } catch (e) {
      return ErrorDto.Error(res, 'unknown error', 500);
    }
  };

  public getByKey = async (req: Request, res: Response) => {
    const key = req.params.key;
    if (!key) return ErrorDto.Error(res, 'key is not valid', 422);
    try {
      const result = await this.cacheService.getByKey(key);
      if (result) {
        return ResponseDto.New(res, result, 200);
      } else {
        return ErrorDto.Error(res, 'unknown error', 500);
      }
    } catch (e) {
      return ErrorDto.Error(res, 'unknown error', 500);
    }
  };

  public updateByKey = async (req: Request, res: Response) => {
    const key = req.params.key;
    const value = req.body.value;
    if (!key || !value) return ErrorDto.Error(res, 'key or value is not valid', 422);
    try {
      const result = await this.cacheService.updateByKey(key, value);
      if (result) {
        return ResponseDto.New(res, result, 200);
      } else {
        return ErrorDto.Error(res, 'key is not exist', 404);
      }
    } catch (e) {
      return ErrorDto.Error(res, 'unknown error', 500);
    }
  };

  public deleteByKey = async (req: Request, res: Response) => {
    const key = req.params.key;
    if (!key) return ErrorDto.Error(res, 'key is not valid', 422);
    try {
      const result = await this.cacheService.deleteByKey(key);
      if (result) {
        return ResponseDto.New(res, result, 200);
      } else {
        return ErrorDto.Error(res, 'key is not exist', 500);
      }
    } catch (e) {
      return ErrorDto.Error(res, 'unknown error', 500);
    }
  };

  public resetCache = async (req: Request, res: Response) => {
    try {
      const result = await this.cacheService.reset();
      if (result) {
        return ResponseDto.New(res, result, 200);
      } else {
        return ErrorDto.Error(res, 'unknown error', 500);
      }
    } catch (e) {
      return ErrorDto.Error(res, 'unknown error', 500);
    }
  };
}

export default CacheController;
