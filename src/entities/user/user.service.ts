import { Injectable, HttpStatus, Res, HttpException, Inject, forwardRef, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as googleapis from 'googleapis';
import { LoginUserDTo } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService
	) {}

	async checkPassword(password, user: User) {
		const isLogin = bcrypt
			.compare(password, user.password)
			.then((match) => {
				if (!match) {
					return {
						status: HttpStatus.INTERNAL_SERVER_ERROR,
						message: 'Password is invalid'
					};
				}
				return this.authService.generateToken(user);
			})
			.catch((err) => {
				return {
					status: HttpStatus.BAD_REQUEST,
					message: err
				};
			});

		return isLogin;
	}

	async login(loginUserDto: LoginUserDTo) {
		try {
			const user = await this.userRepository.findOne({
				where: [ { username: loginUserDto.username }, { email: loginUserDto.username } ]
			});

			if (!user) {
				return {
					status: HttpStatus.NOT_FOUND,
					message: 'Username not found'
				};
			}

			return this.checkPassword(loginUserDto.password, user);
		} catch (error) {
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: error
			};
		}
	}

	async save(user: User) {
		try {
			const data = await this.userRepository.save(user);
			this.sendEmail(user);
			return {
				status: HttpStatus.CREATED,
				message: data
			};
		} catch (err) {
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: err
			};
		}
	}

	async sendEmail(user: User) {
		const clientId = '22007026880-i42bgfjmf4gai8mm0u8pr0s6vvstikiu.apps.googleusercontent.com';
		const clientSecret = '-6muBf-8k6rb76BeFwk0fxOY';
		const refreshToken = '1/rZ87AePZna0TkKyIoXC67kkj9GeqxZBStLpLd6XSIBlbnv5lH8fBlYaJR1uy93lq';
		const { google } = googleapis;
		const OAuth2 = google.auth.OAuth2;

		const oauth2Client = new OAuth2(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
		oauth2Client.setCredentials({
			refresh_token: refreshToken
		});
		const tokens = await oauth2Client.refreshAccessToken();
		const accessToken = tokens.credentials.access_token;

		const smtpTransport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: 'hansinsusatya@gmail.com',
				clientId,
				clientSecret,
				refreshToken,
				accessToken
			}
		});

		const mailOptions = {
			from: 'adminChatApp@gmail.com',
			to: user.email,
			subject: 'Node.js Email with Secure OAuth',
			generateTextFromHTML: true,
			html: '<b>test</b>'
		};

		smtpTransport.sendMail(mailOptions, (error, response) => {
			error ? console.log(error) : console.log(response);
			smtpTransport.close();
		});
	}

	async insert(createUserDto: CreateUserDto) {
		let status: number;
		let message = '';
		const newUser = new User();

		Object.assign(newUser, createUserDto);
		newUser.email = newUser.email.toLowerCase();
		newUser.username = newUser.username.toLowerCase();

		const existingUsername = await this.userRepository.findOne({
			where: { username: newUser.username }
		});

		if (existingUsername) {
			status = HttpStatus.CONFLICT;
			message = 'Username already exist ';
			return {
				status,
				message
			};
		}

		const existingEmail = await this.userRepository.findOne({
			where: { email: newUser.email }
		});

		if (existingEmail) {
			status = HttpStatus.CONFLICT;
			message = 'Email already exist ';
			return {
				status,
				message
			};
		}

		const hashedPassword = bcrypt
			.hash(newUser.password, 10)
			.then((hash) => {
				newUser.password = hash;
				newUser.isActive = false;
				return this.save(newUser);
			})
			.catch((err) => {
				return {
					status: HttpStatus.BAD_REQUEST,
					message: err
				};
			});

		return hashedPassword;
	}

	async findById(user: User): Promise<User> {
		return await this.userRepository.findOne({
			select: [ 'id', 'username', 'email', 'isActive' ],
			where: { id: user.id }
		});
	}
}
