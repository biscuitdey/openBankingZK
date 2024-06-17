import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProofCommand } from '../capabilities/createProof/createProof.command';
import { CreateProofDto } from './dtos/request/createProof.dto';
import { PublicWitnessDto } from './dtos/response/publicWitness.dto';
import { VerifyProofDto } from './dtos/request/verifyProof.dto';
import { VerifyProofCommand } from '../capabilities/verifyProof/verifyProof.command';

@Controller('proof')
export class CustomerVerifierController {
  constructor(private commandBus: CommandBus) {}

  @Post('/create')
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

  @Post('verify')
  async verifyProof(@Body() requestDto: VerifyProofDto): Promise<boolean> {
    return await this.commandBus.execute(
      new VerifyProofCommand(requestDto.publicWitness, requestDto.publicKey),
    );
  }
}
