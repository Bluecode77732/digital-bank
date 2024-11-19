// src/database/db.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: configService.get('NODE_ENV') !== 'production',
                logging: configService.get('NODE_ENV') !== 'production',
                ssl: configService.get('NODE_ENV') === 'production' ? {
                    rejectUnauthorized: false,
                } : false,
                autoLoadEntities: true,
                migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
                migrationsRun: true,
                keepConnectionAlive: true,
                poolSize: 20,
                connectionTimeoutMillis: 10000,
                maxQueryExecutionTime: 5000,
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }

// src/database/migrations/1700000000000-InitialSchema.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
    name = 'InitialSchema1700000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR UNIQUE NOT NULL,
        "password" VARCHAR NOT NULL,
        "firstName" VARCHAR,
        "lastName" VARCHAR,
        "isActive" BOOLEAN DEFAULT true,
        "role" VARCHAR DEFAULT 'user',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await queryRunner.query(`
      CREATE TABLE "accounts" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "accountNumber" VARCHAR UNIQUE NOT NULL,
        "accountType" VARCHAR NOT NULL,
        "balance" DECIMAL(20,2) DEFAULT 0,
        "currency" VARCHAR DEFAULT 'USD',
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" SERIAL PRIMARY KEY,
        "fromAccountId" INTEGER REFERENCES accounts(id),
        "toAccountId" INTEGER REFERENCES accounts(id),
        "amount" DECIMAL(20,2) NOT NULL,
        "currency" VARCHAR NOT NULL,
        "type" VARCHAR NOT NULL,
        "status" VARCHAR DEFAULT 'pending',
        "description" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Add indexes for better query performance
        await queryRunner.query(`
      CREATE INDEX "idx_users_email" ON "users"("email");
      CREATE INDEX "idx_accounts_userId" ON "accounts"("userId");
      CREATE INDEX "idx_accounts_accountNumber" ON "accounts"("accountNumber");
      CREATE INDEX "idx_transactions_fromAccountId" ON "transactions"("fromAccountId");
      CREATE INDEX "idx_transactions_toAccountId" ON "transactions"("toAccountId");
      CREATE INDEX "idx_transactions_createdAt" ON "transactions"("createdAt");
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}

// src/database/seeding/seed.ts
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../users/user.entity';
import { Account } from '../../accounts/account.entity';

export default class InitialDatabaseSeed implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        // Create admin user
        const adminUser = await connection
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
                email: 'admin@digitalbank.com',
                password: 'hashedAdminPassword', // Remember to hash this in production
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                isActive: true,
            })
            .execute();

        // Create admin account
        await connection
            .createQueryBuilder()
            .insert()
            .into(Account)
            .values({
                userId: adminUser.identifiers[0].id,
                accountNumber: 'ADMIN-000001',
                accountType: 'admin',
                balance: 0,
                currency: 'USD',
                isActive: true,
            })
            .execute();
    }
}
