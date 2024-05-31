import { AutoMap } from '@automapper/classes';

export class PublicWitnessDto {
  @AutoMap()
  publicInputs?: string[];

  @AutoMap()
  verificationKey: object;
}
