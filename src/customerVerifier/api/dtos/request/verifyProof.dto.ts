import { IsNotEmpty, ValidateNested } from 'class-validator';
import { PublicWitnessDto } from '../response/publicWitness.dto';
import { Type } from 'class-transformer';

export class VerifyProofDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PublicWitnessDto)
  publicWitness: PublicWitnessDto;

  @IsNotEmpty()
  publicKey: string;
}
