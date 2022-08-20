import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import CacheController from '@/controllers/cache.controller';

class CacheRoute implements Routes {
  public path = '/cache';
  public router = Router();
  public cacheController = new CacheController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/getAllKeys`, this.cacheController.getAllKeys);
    this.router.get(`${this.path}/getByKey/:key`, this.cacheController.getByKey);
    this.router.put(`${this.path}/updateByKey/:key`, this.cacheController.updateByKey);
    this.router.delete(`${this.path}/deleteByKey/:key`, this.cacheController.deleteByKey);
    this.router.delete(`${this.path}/resetKeys`, this.cacheController.resetCache);
  }
}

export default CacheRoute;
