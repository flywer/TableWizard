declare interface CreateProjectReqVO {
	projectName: string
	description: string
	icon: string
	projectPath: string
}

declare interface SaveDataTableVO {
	id: string
	projectId: number
	parentId: string
	tableName: string
	tableComment: string
	fields: EntityField[]
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
	id: string // 唯一标识符
	fieldName: string // 字段名称
	fieldComment: string // 显示名称
	primaryKey: boolean // 是否为主键
	notNull: boolean // 是否不允许为空
	autoIncrement: boolean // 是否自动递增
	type: string // 字段类型
	length: number // 字段长度
	scale: number // 小数位数
	defaultValue: string // 默认值
	hideInGraph: boolean // 是否在图表中隐藏
}

// 模板项
declare interface DialectTemplateItemType {
	label: string
	type: string
	template: string
}

// 各种数据库方言的默认handlebars模板
declare interface DialectTemplate {
	dialect: string // 方言
	templates: DialectTemplateItemType[]
}

declare interface TemplateCompileParams {
	tableName: string,
	tableComment: string,
	fields: EntityField[],
	config: {
		fieldUnderline: boolean, // 字段名使用下划线
		toUpperCase: boolean // 字段名转大写
	}
}

declare interface DataBaseType {
	databaseId: string
	type: string
}

declare interface SaveDataTypeVO {
	id: string
	projectId: number
	parentId: string
	typeName: string
	typeComment: string
	databaseTypes: DataBaseType[]
}
