import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CondoController } from './condo.controller';
import { CondoService } from './condo.service';
import { CondoSchema } from './condo.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Condo', schema: CondoSchema , collection: 'Cluster0' }])
  ],
  controllers: [CondoController],
  providers: [CondoService],
  exports: [CondoService],
})
export class CondoModule {}