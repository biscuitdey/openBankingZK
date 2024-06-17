import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';

export class PublicWitnessDto {
  @AutoMap()
  @IsNotEmpty()
  publicInputs?: string[];

  @AutoMap()
  @IsNotEmpty()
  verificationKey: object;
}
