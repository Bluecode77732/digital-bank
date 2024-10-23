import { Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { TrscService } from './trsc.service';

@Controller('trsc')
export class TrscController {
    constructor(private readonly trscService: TrscService) {}

    @Get('accountId')
    findByAccnt(@Param('accountId') accountId: string) {
        return this.trscService.findByAccnt(accountId);
    }
    
    findAllAccnt

    @Post() 
    create() {}
    
    
}
