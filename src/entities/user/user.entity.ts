import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn() id: number;

	@Column({ length: 25, nullable: false })
	username: string;

	@Column({ length: 50, nullable: false })
	email: string;

	@Column({ nullable: false })
	password: string;

	@Column({ nullable: false })
	isActive: boolean;
}
