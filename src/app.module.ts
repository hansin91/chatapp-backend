import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './entities/user/user.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './entities/menu/menu.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { MenuController } from './entities/menu/menu.controller';

@Module({
	imports: [ TypeOrmModule.forRoot(), UserModule, AuthModule, MenuModule ],
	controllers: [ AppController ],
	providers: [ AppService ]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(MenuController);
	}
}
