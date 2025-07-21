import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Account } from '../../accnt/entity/account.entity';
import { IsBoolean, IsNumber } from 'class-validator';
import { Role } from '@/common/type/common.type';
import { CommonTableEntity } from '@/common/entity/common-table.entity';

@Entity()
export class UserEntity extends CommonTableEntity {
    @PrimaryGeneratedColumn()
    @IsNumber()
    id: number;
    
    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string
    
    @Column()
    firstName: string

    @Column()
    lastName: string
    
    @Column({
        enum : Role,
        default: Role.user,
    })
    //* Array based.
    role: number
    
    @Column()
    @IsBoolean()
    isActive: boolean

    // One user can have multiple accounts
    @OneToMany(() => Account, account => account.owner)
    account: Account[];  // Fix the missing accounts property
    
    @OneToMany(() => Account, account => account.owner)
    trscs: Account[];  
}
