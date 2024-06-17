import { Mapper, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { PublicWitness } from './models/publicWitness';
import { PublicWitnessDto } from './api/dtos/response/publicWitness.dto';

@Injectable()
export class CustomerVerifierProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, PublicWitness, PublicWitnessDto);
    };
  }
}
