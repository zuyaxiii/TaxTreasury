import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CondoModule } from './condo/condo.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/mydatabase' ),
    CondoModule,
  ],
})
export class AppModule {}