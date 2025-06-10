import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Account } from '../accnt/account.entity';
import { IsBoolean } from 'class-validator';

@Entity('uers')
export class User {
    @PrimaryGeneratedColumn()
    id!: string;
    
    @Column()
    username!: string;

    @Column()
    email!: string;

    @Column()
    password!: string
    
    @Column()
    firstName!: string

    @Column()
    lastName!: string
    
    @Column()
    role!: string
    
    @Column()
    @IsBoolean()
    isActive!: boolean

    // One user can have multiple accounts
    @OneToMany(() => Account, account => account.owner)
    accounts!: Account[];  // Fix the missing accounts property
    
    @OneToMany(() => Account, account => account.owner)
    trscs: Account[];  
}
