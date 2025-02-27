import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Condo } from './condo.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CondoService {
  constructor(
    @InjectModel('Condo') private readonly condoModel: Model<Condo>,
    private readonly configService: ConfigService, 
  ) {}

  async findAll(): Promise<Condo[]> {
    const limit = this.configService.get<number>('DEFAULT_CONDO_LIMIT') || 500; 
    return this.condoModel.find().limit(limit).exec();
  }

  async findOne(id: string): Promise<Condo | null> {
    return this.condoModel.findOne({ ID_LIST: id }).exec();
  }

  async create(condo: Condo): Promise<Condo> {
    const createdCondo = new this.condoModel(condo);
    return createdCondo.save();
  }

  async update(id: string, condo: Partial<Condo>): Promise<Condo | null> {
    return this.condoModel.findOneAndUpdate({ ID_LIST: id }, condo, { new: true }).exec();
  }

  async delete(id: string): Promise<Condo | null> {
    return this.condoModel.findOneAndDelete({ ID_LIST: id }).exec();
  }

  async findByCondoName(name: string): Promise<Condo[]> {
    return this.condoModel.find({ CONDO_NAME: new RegExp(name, 'i') }).exec();
  }
}
