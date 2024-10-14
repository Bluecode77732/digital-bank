import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Account } from 'src/accnt/account.entity';

@Entity('uers')
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    // One user can have multiple accounts
    @OneToMany(() => Account, account => account.owner)
    accounts: Account[];  // Fix the missing accounts property
}
