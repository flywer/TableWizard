import {BaseDO} from "@main/entity/do/BaseDO";
import {Column, Entity} from "typeorm";

/**
 * 存储发布版本号，也就一条数据存储各个属性的版本号
 **/
@Entity()
export class ModelVersionHistory extends BaseDO {

	@Column({
		comment: '模型ID',
	})
	modelId: number;

	@Column({
		comment: '版本号',
	})
	releaseVersion: number;

	@Column({
		comment: '模型属性ID',
	})
	attributeId: number;

	@Column({
		comment: '模型属性版本号',
	})
	attributeVersion: number;

	/**
	 * 模型属性json缓存，备用
	 **/
	@Column({
		comment: '模型属性json缓存',
		nullable: true,
	})
	attributeJson: string;
}
