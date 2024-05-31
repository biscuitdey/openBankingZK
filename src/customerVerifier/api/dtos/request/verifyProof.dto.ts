import { IsNotEmpty } from 'class-validator';
import { PublicWitnessDto } from '../response/publicWitness.dto';
import { Type } from 'class-transformer';

export class VerifyProofDto {
  @IsNotEmpty()
  @Type(() => PublicWitnessDto)
  publicWitness: PublicWitnessDto;

  @IsNotEmpty()
  publicKey: string;
}
