import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { PayloadDto } from './payload.dto';

export class CreateProofDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PayloadDto)
  payload: PayloadDto;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  publicKey: string;
}
