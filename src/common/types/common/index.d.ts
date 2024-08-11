/**
 * 分页查询参数
 **/
declare interface PagedParam<T> {
	// 所在页码
	pageNo: number,
	// 每页行数
	pageSize: number,
	// 查询参数
	searchParam?: T

	// 其他参数
	[key: string]: any;
}

declare interface PagedRepsVO<T> {
	pageNo: number,
	pageSize: number,
	data: T[],
	total: number
}
