import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("")
export class AuthController {
    constructor(
        private readonly authService : AuthService,
    ) {;};

    @Get()
    get() { 
        return this;
    }

    @Post()
    post() { 
        return this;
    }

    @Patch()
    update() { }

    @Delete()
    remove() { }
}
