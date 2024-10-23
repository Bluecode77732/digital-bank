import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    accountNumber!: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    balance!: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column()
    accountType: string;

    /*     // Each account is tied to one user
        @ManyToOne(() => User, user => user.accounts)
        user: User;  // Reference the user entity */

    @ManyToOne(() => User, user => user.accounts, { eager: true })
    owner: User;
    
    @OneToMany(() => User, user => user.accounts, { eager: true })
    trscs: User;

    // Remove the duplicate user property
    // @ManyToOne(() => User, user => user.accounts)
    // user: User;
}
