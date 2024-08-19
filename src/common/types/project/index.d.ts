declare interface CreateProjectReqVO {
	projectName: string
	description: string
	icon: string
	projectPath: string
}

declare interface ModelTreeNode {
	id: string
	label: string
	type: string
	children?: ModelTreeNode[]
}

// 在这里定义所有模型数据的类型
declare type ModelDataType = DataTableType

// 一种模型的所有数据及其关系
declare interface ModelTreeData {
	treeRelation: ModelTreeNode,
	data: ModelDataType[]
}

declare interface ModelDataTable {
	treeRelation: ModelTreeNode,
	data: DataTableType[]
}

declare interface ModelTypes {
	treeRelation: ModelTreeNode,
	data: DataTableType[]
}

declare interface ProjectData {
	models: {
		datatable: ModelDataTable,
	}
}

declare interface DataTableType {
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
	fieldName: string
	fieldComment: string
	primaryKey: boolean
	notNull: boolean
	autoIncrement: boolean
	type: string
	length: number
	scale: number // 小数位数
	defaultValue: string
	hideInGraph: boolean
}
