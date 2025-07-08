import { Entity, Column, PrimaryGeneratedColumn, OneToMany, AcceptedFields } from 'typeorm';
import { AccountEntity } from '../accnt/account.entity';
import { IsBoolean } from 'class-validator';

@Entity('uers')
export class UserEntity {
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
    @OneToMany(() => AccountEntity, account => account.owner)
    accounts!: AccountEntity[];  // Fix the missing accounts property
    
    @OneToMany(() => AccountEntity, account => account.owner)
    trscs: AccountEntity[];  
}
