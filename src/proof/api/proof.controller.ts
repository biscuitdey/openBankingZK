import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProofCommand } from '../capabilities/createProof/createProof.command';
import { CreateProofDto } from './dtos/request/createProof.dto';

@Controller('proof')
export class ProofController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  async createProof(@Body() requestDto: CreateProofDto): Promise<string> {
    return await this.commandBus.execute(
      new CreateProofCommand(
        requestDto.payload,
        requestDto.signature,
        requestDto.publicKey,
      ),
    );
  }
}
