import { Response } from 'express';
import { ResponseDto } from './base-response.dto';

export class ErrorDto extends ResponseDto {
  static Error(response: Response, message: string, code: number, data?: any) {
    return ResponseDto.New(response, data, code, 'failed', message);
  }
}
