import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProofCommand } from '../capabilities/createProof/createProof.command';
import { CreateProofDto } from './dtos/request/createProof.dto';
import { PublicWitnessDto } from './dtos/response/publicWitness.dto';

@Controller('proof')
export class CustomerVerifierController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  async createProof(
    @Body() requestDto: CreateProofDto,
  ): Promise<PublicWitnessDto> {
    return await this.commandBus.execute(
      new CreateProofCommand(
        requestDto.payload,
        requestDto.signature,
        requestDto.publicKey,
      ),
    );
  }
}
