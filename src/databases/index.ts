import { DB_HOST, DB_PORT, DB_DATABASE } from '@config';
import { ConnectOptions } from 'mongoose';
export const dbConnection = {
  url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions,
};
