import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/entities/user/user.module';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secretOrPrivateKey: 'chatAppSecretKey',
			signOptions: {
				expiresIn: '1d'
			}
		}),
		forwardRef(() => UserModule)
	],
	providers: [ AuthService, JwtStrategy ],
	exports: [ PassportModule, AuthService ]
})
export class AuthModule {}
