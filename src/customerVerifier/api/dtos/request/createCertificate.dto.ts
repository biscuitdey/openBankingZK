import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { PayloadDto } from './payload.dto';

export class CreateCertificateDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PayloadDto)
  payload: PayloadDto;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  publicKey: string;
}
