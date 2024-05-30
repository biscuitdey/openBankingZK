import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SnarkjsCircuitService } from './service/circuit/snarkjs/snarkjs.service';
import { LoggingModule } from '../shared/logging/logging.module';

@Module({
  imports: [CqrsModule, LoggingModule],

  providers: [
    {
      provide: 'ICircuitService',
      useClass: SnarkjsCircuitService,
    },
  ],
  exports: ['ICircuitService'],
})
export class CustomerVerifierModule {}
