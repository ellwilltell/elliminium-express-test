import { Response } from 'express';
export class ResponseDto {
  data?: any;
  code: number;
  status: 'ok' | 'failed';
  reason?: string;

  public constructor(data: any, code = 200, status: 'ok' | 'failed' = 'ok', reason: string) {
    this.data = data;
    this.code = code;
    this.status = status;
    this.reason = reason;
  }

  static New(response: Response, data: any, code = 200, status: 'ok' | 'failed' = 'ok', message?: string) {
    const responseDto = new ResponseDto(data, code, status, message);
    return response.status(code).json(responseDto);
  }
}
