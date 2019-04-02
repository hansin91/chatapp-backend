import { Controller, Post, Body, Res, HttpStatus, Put, Get, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { LoginUserDTo } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('api/user')
export class UserController {
	constructor(private service: UserService, private authService: AuthService) {}

	@Post('register')
	async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
		const data = await this.service.insert(createUserDto);
		res.status(data.status).json(data);
	}

	@Post('login')
	async login(@Body() loginUserDto: LoginUserDTo, @Res() res: Response) {
		const data = await this.service.login(loginUserDto);
		res.status(data.status).json(data);
	}

	@Post('validate')
	async validate(@Body() payload: any, @Res() res: Response) {
		const data = await this.authService.validateUser(payload);
		res.status(data.status).json(data);
	}
}
