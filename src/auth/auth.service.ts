import { Injectable, Inject, forwardRef, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { User } from '../entities/user/user.entity';
import { UserService } from '../entities/user/user.service';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async generateToken(user: User) {
		const payload: JwtPayload = { id: user.id, email: user.email };
		const token = await this.jwtService.sign(payload);
		return {
			status: HttpStatus.OK,
			token,
			message: 'Login successfully'
		};
	}

	async validateUser(payload: any): Promise<any> {
		try {
			if (payload.token) {
				const tokenPayload = this.jwtService.verify(payload.token);
				const user = new User();
				user.id = tokenPayload.id;
				const data = await this.userService.findById(user);
				if (data) {
					return {
						status: HttpStatus.OK,
						data
					};
				}
			} else {
				return {
					status: HttpStatus.BAD_REQUEST,
					data: 'token is not valid'
				};
			}
		} catch (error) {
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				error
			};
		}
	}
}
