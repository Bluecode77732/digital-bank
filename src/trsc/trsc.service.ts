// The main service file
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { CreateTrscDto } from "./dto/create-trsc.dto";
import { Account } from "@/accnt/account.entity";
import { Trsc } from "./trsc.entity";

@Injectable()
export class TrscService {
    constructor(
        @InjectRepository(Trsc)
        private transactions: Repository<Trsc>,
        @InjectRepository(Account)
        private accounts: Repository<Account>,
        private db: DataSource,
    ) { }

    async create(dto: CreateTrscDto): Promise<Trsc> {
        const runner = this.db.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();

        try {
            if (dto.amount <= 0) {
                throw new BadRequestException('Amount must be positive');
            }

            const from = await this.accounts.findOne({
                where: { id: dto.fromAccountId },
                lock: { mode: 'pessimistic_write' }
            });

            if (!from) {
                throw new NotFoundException('Source account not found');
            }

            let to = null;
            if (dto.trscType === 'transfer') {
                if (!dto.toAccountId) {
                    throw new BadRequestException('Transfer requires destination account');
                }

                to = await this.accounts.findOne({
                    where: { id: dto.toAccountId },
                    lock: { mode: 'pessimistic_write' }
                });

                if (!to) {
                    throw new NotFoundException('Destination account not found');
                }
            }

            if (['withdrawal', 'transfer'].includes(dto.trscType) && from.balance < dto.amount) {
                throw new BadRequestException('Insufficient funds');
            }

            // Update balances based on transaction type
            this.updateBalances(from, to, dto.trscType, dto.amount);

            // Create new transaction
            const trsc = this.transactions.create({
                fromAccount: from,
                toAccount: to,
                amount: dto.amount,
                trscType: dto.trscType,
                createdAt: new Date()  // Changed from timestamp to createdAt
            });

            // Save all changes
            await this.transactions.save(trsc);
            await this.accounts.save(from);
            if (to) {
                await this.accounts.save(to);
            }

            await runner.commitTransaction();
            return trsc;

        } catch (error) {
            await runner.rollbackTransaction();
            throw error;
        } finally {
            await runner.release();
        }
    }

    private updateBalances(from: Account, to: Account | null, type: CreateTrscDto['trscType'], amount : number): void {
        switch (type) {
            case 'withdrawal':
                from.balance -= amount;
                break;
            case 'deposit':
                from.balance += amount;
                break;
            case 'transfer':
                if (!to) throw new Error('Destination account required for transfer');
                from.balance -= amount;
                to.balance += amount;
                break;
        }
    }

    async findByAccnt(accountId: string): Promise<Trsc[]> {
        const transactions = await this.transactions.find({
            where: [
                { fromAccount: { id: accountId } },
                { toAccount: { id: accountId } }
            ],
            relations: ['fromAccount', 'toAccount'],
            order: { createdAt: 'DESC' },  // Changed from timestamp to createdAt
            take: 50
        });

        if (!transactions.length) {
            throw new NotFoundException('No transactions found');
        }

        return transactions;
    }

    async findAll(limit = 100): Promise<Trsc[]> {
        return this.transactions.find({
            relations: ['fromAccount', 'toAccount'],
            order: { createdAt: 'DESC' },  // Changed from timestamp to createdAt
            take: limit
        });
    }
}
