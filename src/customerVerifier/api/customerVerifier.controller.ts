import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCertificateCommand } from '../capabilities/createCertificate/createCertificate.command';
import { CreateCertificateDto } from './dtos/request/createCertificate.dto';
import { PublicWitnessDto } from './dtos/response/publicWitness.dto';
import { VerifyCertificateDto } from './dtos/request/verifyCertificate.dto';
import { VerifyCertificateCommand } from '../capabilities/verifyCertificate/verifyCertificate.command';

@Controller('certificate')
export class CustomerVerifierController {
  constructor(private commandBus: CommandBus) {}

  @Post('/create')
  async createCertificate(
    @Body() requestDto: CreateCertificateDto,
  ): Promise<PublicWitnessDto> {
    return await this.commandBus.execute(
      new CreateCertificateCommand(
        requestDto.payload,
        requestDto.signature,
        requestDto.publicKey,
      ),
    );
  }

  @Post('verify')
  async verifyCertificate(
    @Body() requestDto: VerifyCertificateDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new VerifyCertificateCommand(
        requestDto.publicWitness,
        requestDto.publicKey,
      ),
    );
  }
}
