import { AccountService } from "@/accnt/account.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction } from "typeorm";
import { CreateTrscDto } from "./dto/create-transaction.dto";

@Injectable()
export class TrscService {
    constructor(
        @InjectRepository(Transaction) 
        private trscRepository: Repository<Transaction>,
        private accntService: AccountService,
    ) {}
    
    /* async create(createTrscDto: CreateTrscDto) : Promise<Transaction> {
        // Find specific account A.
        const accnt = await this.accntService.findOne(createTrscDto.accountId);
        // with the A, make the transaction to perform.
        const trsc = this.trscRepository.create({
            ...createTrscDto,
            accnt,
        });
            
        // Update account balance based on the transaction type
        if(createTrscDto.trscType === 'deposit') {
            accnt.balance += createTrscDto.amount;
            } else if(createTrscDto.trscType === 'withdrawal') {
                accnt.balance += createTrscDto.amount;
            }
        } 
    */

    async create(createTrscDto: CreateTrscDto) : Promise<Transaction> {
        const { fromAccountId, toAccountId, trscType, amount } = createTrscDto;

        const fromAccountId = await this.accrepo
    }

    findByAccnt(accntId: string) : Promise<Transaction[]> {
        return this.accntService.findOne(accntId);
    }
    
    findAllAccnt() {
        return this.accntService.findAll();
    }
}
