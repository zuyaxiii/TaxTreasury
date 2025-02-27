import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CondoService } from './condo.service';
import { Condo } from './condo.interface';

@Controller('condos')
export class CondoController {
  constructor(private readonly condoService: CondoService) {}

  @Get()
  async findAll(): Promise<Condo[]> {
    return this.condoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Condo | null> {
    return this.condoService.findOne(id);
  }

  @Post()
  async create(@Body() condo: Condo): Promise<Condo> {
    return this.condoService.create(condo);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() condo: Partial<Condo>): Promise<Condo | null> {
    return this.condoService.update(id, condo);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Condo | null> {
    return this.condoService.delete(id);
  }

  @Get('search/name')
  async findByCondoName(@Query('name') name: string): Promise<Condo[]> {
    return this.condoService.findByCondoName(name);
  }
}
