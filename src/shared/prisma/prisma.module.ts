import { Module } from '@nestjs/common';
import { PrismaMapper } from './prisma.mapper';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, PrismaMapper],
  exports: [PrismaService, PrismaMapper],
})
export class PrismaModule {}
