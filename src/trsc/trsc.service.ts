import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { CreateTrscDto } from "./dto/create-transaction.dto";
import { Account } from "@/accnt/account.entity";
import { Trsc } from "./trsc.entity";

@Injectable()
export class TrscService {
    constructor(
        @InjectRepository(Trsc)
        private transactionRepo: Repository<Trsc>,
        @InjectRepository(Account)
        private accountRepo: Repository<Account>,
        private dataSource: DataSource, // Inject DataSource for transactions
    ) { }

    async create(createTrscDto: CreateTrscDto): Promise<Trsc> {
        const { fromAccountId, toAccountId, trscType, amount } = createTrscDto;

        // Start a database transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Validate amount
            if (amount <= 0) {
                throw new BadRequestException('Transaction amount must be positive');
            }

            // Get fromAccount with lock
            const fromAccount = await this.accountRepo.findOne({
                where: { id: fromAccountId },
                lock: { mode: 'pessimistic_write' }
            });

            if (!fromAccount) {
                throw new NotFoundException('Source account not found');
            }

            let toAccount: Account | null = null;
            if (toAccountId) {
                toAccount = await this.accountRepo.findOne({
                    where: { id: toAccountId },
                    lock: { mode: 'pessimistic_write' }
                });

                if (!toAccount) {
                    throw new NotFoundException('Destination account not found');
                }
            }

            // Validate sufficient balance for withdrawals and transfers
            if ((trscType === 'withdrawal' || trscType === 'transfer') && fromAccount.balance < amount) {
                throw new BadRequestException('Insufficient balance');
            }

            // Create transaction record
            const transaction = this.transactionRepo.create({
                fromAccount,
                toAccount,
                trscType,
                amount,
                status: 'completed',
                timestamp: new Date()
            });

            // Update account balances based on transaction type
            switch (trscType) {
                case 'withdrawal':
                    fromAccount.balance -= amount;
                    break;
                case 'deposit':
                    fromAccount.balance += amount;
                    break;
                case 'transfer':
                    if (!toAccount) {
                        throw new BadRequestException('Destination account required for transfer');
                    }
                    fromAccount.balance -= amount;
                    toAccount.balance += amount;
                    break;
                default:
                    throw new BadRequestException('Invalid transaction type');
            }

            // Save all changes within the transaction
            await this.transactionRepo.save(transaction);
            await this.accountRepo.save(fromAccount);
            if (toAccount) {
                await this.accountRepo.save(toAccount);
            }

            // Commit the transaction
            await queryRunner.commitTransaction();
            return transaction;

        } catch (error) {
            // Rollback in case of any error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
    }

    async findByAccount(id: number): Promise<Trsc[]> {
        const transactions = await this.transactionRepo.find({
            where: [
                { fromAccount: { id } },
                { toAccount: { id } }
            ],
            relations: ['fromAccount', 'toAccount'],
            order: { timestamp: 'DESC' }
        });

        if (!transactions.length) {
            throw new NotFoundException('No transactions found for this account');
        }

        return transactions;
    }

    async findAll(): Promise<Trsc[]> {
        return this.transactionRepo.find({
            relations: ['fromAccount', 'toAccount'],
            order: { timestamp: 'DESC' }
        });
    }
}
