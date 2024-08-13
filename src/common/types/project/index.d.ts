declare interface CreateProjectReqVO {
	projectName: string
	description: string
	icon: string
}

// 表字段属性
declare interface TableField {
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
