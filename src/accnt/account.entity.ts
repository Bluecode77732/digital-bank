import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    accountNumber!: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    balance!: number;

    @ManyToOne(() => User, user => user.accounts, { eager: true })
    owner: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
