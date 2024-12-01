import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { IsBoolean, IsCurrency } from 'class-validator';

type type1 = number | string;
type type2 = number | any;

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    accountNumber!: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    balance: type1 | type2;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column()
    accountType: string;

    /*     // Each account is tied to one user
        @ManyToOne(() => User, user => user.accounts)
        user: User;  // Reference the user entity */

    @ManyToOne(() => User, user => user.accounts, { 
        eager: false,
        nullable: false,    // means the related user won't be automatically loaded with each account query
    })
    owner!: User;
    
    @OneToMany(() => User, user => user.accounts, { eager: true })
    trscs!: User[];

    // Remove the duplicate user property
    // @ManyToOne(() => User, user => user.accounts)
    // user: User;

    @IsCurrency()
    currency!: string;

    @IsBoolean()
    isActive : boolean
}
