import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn} from "typeorm"
import {BaseDO} from "@main/entity/do/BaseDO";

@Entity()
export class Project extends BaseDO {
	@Column({
		unique: true,
		comment: '项目名称',
	})
	projectName: string;

	@Column({
		comment: '项目描述',
		nullable: true,
	})
	description: string;

	@Column({
		comment: '项目图标SVG',
		nullable: true,
	})
	icon: string;

	@Column({
		comment: '项目文件夹路径',
	})
	projectPath: string;
}
