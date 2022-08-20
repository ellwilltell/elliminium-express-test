import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateKeyValue {
  @IsString()
  @IsNotEmpty()
  value: string;
}
