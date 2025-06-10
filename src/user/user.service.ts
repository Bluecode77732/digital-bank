import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find({ relations: ['accounts'] }); // Include accounts relation if needed
    }

    findOne(id: string): Promise<User> {
        return this.userRepository.findOne({ where: { id }, relations: ['accounts'] });
    }
}
