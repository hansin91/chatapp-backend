import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMenuTable1554219645358 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			// tslint:disable-next-line:max-line-length
			'CREATE TABLE `menu` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `url` varchar(255) NOT NULL, `icon` varchar(255) NOT NULL, `module` varchar(255) NOT NULL, `isActive` tinyint NOT NULL, `parent` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query('DROP TABLE `menu`');
	}
}
