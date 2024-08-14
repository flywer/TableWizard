declare interface CreateProjectReqVO {
	projectName: string
	description: string
	icon: string
}

declare interface Entity {
	name: string; // 表名
	comment?: string; // 表注释
	fields: EntityField[]; // 字段信息数组
	engine?: string; // 数据库引擎
	charset?: string; // 字符集
	collation?: string; // 校对规则
}

// 表字段属性
declare interface EntityField {
	id: string
	defKey: string
	defName: string
	primaryKey: boolean
	notNull: boolean
	autoIncrement: boolean
	type: string
	length: number
	scale: number // 小数位数
	defaultValue: string
	hideInGraph: boolean
}
