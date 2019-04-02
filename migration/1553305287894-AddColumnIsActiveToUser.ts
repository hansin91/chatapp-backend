import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnIsActiveToUser1553305287894 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.addColumn(
			'user',
			new TableColumn({
				name: 'isActive',
				type: 'boolean'
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropColumn('user', 'isActive');
	}
}
