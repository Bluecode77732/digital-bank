import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { IsBoolean, IsCurrency } from 'class-validator';
import { CommonTableEntity } from '@/common/entity/common-table.entity';

type type1 = number | string;
type type2 = number | any;

@Entity('account')
export class Account extends CommonTableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    accountNumber: string;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2
    })
    balance: type1 | type2;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @Column()
    accountType: string;

    /*  Old code.
        // Each account is tied to one user
        @ManyToOne(() => User, user => user.accounts)
        user: User;  // Reference the user entity 
    */

    @ManyToOne(
        () => UserEntity, 
        user => user.account, 
        {
            eager: false,
            nullable: false,    // means the related 'user' won't be automatically loaded with each account query.
        }
    )
    owner: UserEntity;

    // Todo : Transaction relation
    // @OneToMany(
    //     () => UserEntity,
    //     user => user.account,
    //     {
    //         eager: true,
    //     }
    // )
    // trscs: UserEntity[];

    // Remove the duplicate user property
    // @ManyToOne(() => User, user => user.accounts)
    // user: User;

    @IsCurrency()
    currency: string = 'KRW';

    @IsBoolean()
    isActive: boolean
}
