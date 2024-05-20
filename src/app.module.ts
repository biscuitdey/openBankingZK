import { Module } from '@nestjs/common';
import { ProofModule } from './proof/proof.module';

@Module({
  imports: [ProofModule],
  providers: [],
})
export class AppModule {}
