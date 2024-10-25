import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { CreateTrscDto } from "./dto/create-transaction.dto";
import { Account } from "@/accnt/account.entity";
import { Trsc } from "./trsc.entity";

type TrscType = 'withdrawal' | 'deposit' | 'transfer';

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

            // Load accounts with locks to prevent race conditions
            const from = await this.accounts.findOne({
                where: { id: dto.fromAccountId },
                lock: { mode: 'pessimistic_write' }
            });

            if (!from) {
                throw new NotFoundException('Source account not found');
            }

            // Only load destination account if it's a transfer
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

            // Ensure sufficient funds for withdrawals/transfers
            if (['withdrawal', 'transfer'].includes(dto.trscType) && from.balance < dto.amount) {
                throw new BadRequestException('Insufficient funds');
            }

            // Update balances based on transaction type
            this.updateBalances(from, to, dto.trscType, dto.amount);

            // Save everything
            const trsc = await this.transactions.save({
                fromAccount: from,
                toAccount: to,
                amount: dto.amount,
                trscType: dto.trscType,
                timestamp: new Date()
            });

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

    private updateBalances(from: Account, to: Account | null, type: TransactionType, amount: number): void {
        switch (type) {
            case 'withdrawal':
                from.balance -= amount;
                break;
            case 'deposit':
                from.balance += amount;
                break;
            case 'transfer':
                from.balance -= amount;
                to.balance += amount;
                break;
        }
    }

    async findByAccount(accountId: number): Promise<Trsc[]> {
        const transactions = await this.transactions.find({
            where: [
                { fromAccount: { id: accountId } },
                { toAccount: { id: accountId } }
            ],
            relations: ['fromAccount', 'toAccount'],
            order: { timestamp: 'DESC' },
            take: 50  // Limit to last 50 transactions by default
        });

        if (!transactions.length) {
            throw new NotFoundException('No transactions found');
        }

        return transactions;
    }

    async findAll(limit = 100): Promise<Trsc[]> {
        return this.transactions.find({
            relations: ['fromAccount', 'toAccount'],
            order: { timestamp: 'DESC' },
            take: limit
        });
    }
}