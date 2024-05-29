import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';
export class PayloadDto {
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @IsNotEmpty()
  bankName: string;

  @AutoMap()
  @IsNotEmpty()
  accountNumber: string;

  @AutoMap()
  @IsNotEmpty()
  ifsc: string;
}
