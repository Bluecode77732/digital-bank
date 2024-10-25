import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { TrscService } from './trsc.service';
import { CreateTrscDto } from './dto/create-transaction.dto';

@Controller('trscs')
export class TrscController {
    constructor(private readonly trscService: TrscService) {}

    @Get('accountId')
    findByAccnt(@Param('accountId') accountId: string) {
        return this.trscService.findByAccnt(accountId);
    }
    
    @Get()
    findAllAccnt() {
        return this.trscService.findAll();
    }

    @Post() 
    create(@Body() createTrscDto: CreateTrscDto) {
        return this.trscService.create(createTrscDto);
    }
    
    
}
