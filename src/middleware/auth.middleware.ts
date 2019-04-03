import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { User } from '../entities/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/entities/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly jwtService: JwtService, private userService: UserService) {}

	public resolve() {
		return async (req, res, next) => {
			const token =
				req.body.token ||
				req.query.token ||
				(req.headers.authorization && req.headers.authorization.split(' ')[1]) ||
				undefined;

			if (token === undefined) {
				return res.json({
					status: HttpStatus.FORBIDDEN,
					message: 'Token not found'
				});
			}

			try {
				const tokenPayload = this.jwtService.verify(token);
				const user = new User();
				user.id = tokenPayload.id;
				const data = await this.userService.findById(user);
				if (!data) {
					return res.json({
						status: HttpStatus.FORBIDDEN,
						message: 'No user is associated with that token'
					});
				}
			} catch (error) {
				return res.json({
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					message: 'Token is not valid'
				});
			}
			next();
		};
	}
}
