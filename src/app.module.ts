import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './entities/user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [ TypeOrmModule.forRoot(), UserModule, AuthModule ],
	controllers: [ AppController ],
	providers: [ AppService ]
})
export class AppModule {}
