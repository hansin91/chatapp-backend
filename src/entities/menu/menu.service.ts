import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenuService {
	constructor(@InjectRepository(Menu) private menuRepository: Repository<Menu>) {}

	async findMenuByModule(module: string) {
		try {
			const data = await this.menuRepository.find({
				select: [ 'name', 'url', 'icon' ],
				where: { isActive: true, module }
			});
			return {
				status: HttpStatus.OK,
				menus: data
			};
		} catch (error) {
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				error
			};
		}
	}
}
