import { Controller, Get, Post, Body, Param, Patch, ParseIntPipe, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post()
    create(
        @Body() createUserDto: CreateUserDto
    ) {
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id : number,
        @Body() updateUserDTO : UpdateUserDTO,
    ) {
        return this.userService.update(id, updateUserDTO);
    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id : number,
    ) {
        return this.userService.remove(id);
    }
}
