import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SnarkjsCircuitService } from './service/circuit/snarkjs/snarkjs.service';
import { LoggingModule } from '../shared/logging/logging.module';
import { CreateProofCommandHandler } from './capabilities/createProof/createProofCommand.handler';
import { VerifyProofCommandHandler } from './capabilities/verifyProof/verifyProofCommand.handler';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { CustomerVerifierController } from './api/customerVerifier.controller';
import { CustomerVerifierAgent } from './agents/customerVerifier.agent';
import { CustomerVerifierStorageAgent } from './agents/customerVerifierStorage.agent';
import { CustomerVerifierProfile } from './customerVerifier.profile';

export const CommandHandlers = [
  CreateProofCommandHandler,
  VerifyProofCommandHandler,
];

@Module({
  imports: [CqrsModule, LoggingModule, PrismaModule],
  controllers: [CustomerVerifierController],
  providers: [
    ...CommandHandlers,
    CustomerVerifierAgent,
    CustomerVerifierStorageAgent,
    CustomerVerifierProfile,
    {
      provide: 'ICircuitService',
      useClass: SnarkjsCircuitService,
    },
  ],
  exports: ['ICircuitService'],
})
export class CustomerVerifierModule {}
