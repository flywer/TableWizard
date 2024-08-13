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
    type: string
    length: number
    scale: string // 小数位数
    primaryKey: boolean
    notNull: boolean
    defaultValue: string
    autoIncrement: boolean
    hideInGraph: boolean
}
