import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,

        private readonly dataSource: DataSource,
    ) { }

    async create(createUserDto: CreateUserDto) {

        const qr = this.dataSource.createQueryRunner();

        await qr.connect();
        await qr.startTransaction();

        try {
            const user = await qr.manager.createQueryBuilder()
                .insert()
                .into(UserEntity)
                .values({
                    username: createUserDto.username,
                    email: createUserDto.email,
                    password: createUserDto.password,
                    role: createUserDto.role,
                })
                .execute();

            const userId = user.identifiers[0].id
            
            await qr.commitTransaction();
            
            return await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });

        } catch (error) {
            await qr.rollbackTransaction();
            throw error;

        } finally {
            await qr.release();
        };

    }

    async findAll() {
        const qb = this.userRepository.createQueryBuilder('user')

        return await qb.getManyAndCount();
    };

    async findOne(id: number) {
        const user = await this.userRepository.createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne();

        if(!user) {
            throw new NotFoundException(`The user has ${user} value, which the user you are looking for is not found.`)
        }

        return user;
    }

    async update(id: number, updateUserDTO: UpdateUserDTO) {
        
        const qr = await this.dataSource.createQueryRunner();
        await qr.connect()
        await qr.startTransaction()
        
        try {
            const user = await qr.manager.findOne(UserEntity, {
                where: {
                    id,
                },
            });

            if(!user) 
                throw new NotFoundException(`The user has ${user} value, which the user you are looking for is not found.`);

            await qr.manager.createQueryBuilder()
                .update(UserEntity)
                .set(updateUserDTO)
                .where('id = :id', { id })
                .execute();
            await qr.commitTransaction()

            return this.userRepository.findOne({
                where: {
                    id,
                },
            });

        } catch (error) {
            await qr.rollbackTransaction();
            throw new NotFoundException(error)

        } finally {
            await qr.release();
        }
    };

    async remove(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id,
            },
        });

        if(!user) 
            throw new NotFoundException(`The user has ${user} value, which the user you are looking for is not found.`);

        await this.userRepository.createQueryBuilder()
            .delete()
            .from(UserEntity)
            .where('id = :id', { id })
            .execute();

        return id;
    }
    
}
