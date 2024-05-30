import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { PayloadDto } from './payload.dto';

export class CreateProofDto {
  @IsNotEmpty()
  @Type(() => PayloadDto)
  payload: PayloadDto;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  publicKey: string;
}
