import { Module } from '@nestjs/common';
import { CustomerVerifierModule } from './customerVerifier/customerVerifier.module';
import { PrismaService } from './shared/prisma/prisma.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [
    CustomerVerifierModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
