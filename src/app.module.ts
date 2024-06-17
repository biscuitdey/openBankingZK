import { Module } from '@nestjs/common';
import { CustomerVerifierModule } from './customerVerifier/customerVerifier.module';
import { PrismaService } from './shared/prisma/prisma.service';

@Module({
  imports: [CustomerVerifierModule],
  providers: [PrismaService],
})
export class AppModule {}
