import { AccountEntity } from "@/accnt/account.entity";
import { Column, CreateDateColumn, Decimal128, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('trscs')
export class TrscEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    trscType: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @CreateDateColumn()
    createdAt: Date;

    /* @ManyToOne(() => Account, account => account.trscs, {onDelete : 'CASCADE'}) //WTH IS CASCADE? NV SEEN LIKE THIS ONE LOL
    fromAccount: Account; */

    @ManyToOne(() => AccountEntity, account => account.trscs)
    fromAccount: AccountEntity;

    @ManyToOne(() => AccountEntity, { nullable: true })
    toAccount: AccountEntity;


    /* @ManyToOne(() => Account, (account) => account.sentTransactions, { eager: true })  // Relation to the fromAccount
    fromAccount: Account;

    @ManyToOne(() => Account, (account) => account.receivedTransactions, { eager: true, nullable: true })  // Relation to the toAccount
    toAccount: Account; */
}
