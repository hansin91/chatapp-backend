import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Response } from 'express';

@Controller('api/menu')
export class MenuController {
	constructor(private menuService: MenuService) {}

	@Get(':module')
	async findMenu(@Param('module') module, @Res() res: Response) {
		const data = await this.menuService.findMenuByModule(module);
		res.status(data.status).json(data);
	}
}
