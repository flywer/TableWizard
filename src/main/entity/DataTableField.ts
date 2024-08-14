import {BaseDO} from "@main/entity/do/BaseDO";
import {Column, Entity} from "typeorm";

/**
 * 模型类型为datatable时，存储模型字段信息
 **/
@Entity()
export class DataTableField extends BaseDO {

	@Column({
		unique: true,
		comment: '模型ID',
	})
	modelId: number;

	@Column({
		comment: '字段代码',
	})
	defKey: string

	@Column({
		comment: '字段名称',
	})
	defName: string

	@Column({
		comment: '是否主键',
	})
	primaryKey: boolean

	@Column({
		comment: '是否非空',
	})
	notNull: boolean

	@Column({
		comment: '是否自增',
	})
	autoIncrement: boolean

	@Column({
		comment: '字段类型',
	})
	type: string

	@Column({
		comment: '字段长度',
	})
	length: number

	@Column({
		comment: '小数位数',
	})
	scale: number

	@Column({
		comment: '默认值',
	})
	defaultValue: string

	@Column({
		comment: '是否隐藏',
	})
	hideInGraph: boolean
}
