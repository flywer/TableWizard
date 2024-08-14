import {BaseDO} from "@main/entity/do/BaseDO";
import {Column, Entity} from "typeorm";

export type ModelType = 'datatable' | 'enum' | 'relation' | 'view' | 'sql' | 'other';

/**
 * 模型类
 **/
@Entity()
export class Model extends BaseDO {

	@Column({
		unique: true,
		comment: '模型代码',
	})
	modelKey: string;

	@Column({
		comment: '模型名称',
	})
	modelName: string;

	@Column({
		comment: '模型类型',
		type: 'varchar'
	})
	modelType: ModelType;

	@Column({
		comment: '模型描述',
		nullable: true,
	})
	description: string;
}
