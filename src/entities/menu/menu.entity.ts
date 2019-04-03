import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
	@PrimaryGeneratedColumn() id: number;

	@Column({ nullable: false })
	name: string;

	@Column({ nullable: false })
	url: string;

	@Column({ nullable: false })
	icon: string;

	@Column({ nullable: false })
	module: string;

	@Column({ nullable: false })
	isActive: boolean;

	@Column({ nullable: false })
	parent: number;
}
