import {StringUtils} from "@common/utils/StringUtils";

export class ModelApiChannel {

	private static channelsPrefix = 'model'

	// 分页获取项目列表
	static readonly GET_MODELS = StringUtils.joinPaths(ModelApiChannel.channelsPrefix, 'getModels')
	// 创建数据表
	static SAVE_DATATABLE = StringUtils.joinPaths(ModelApiChannel.channelsPrefix, 'saveDataTable')
    static GET_DATATABLES = StringUtils.joinPaths(ModelApiChannel.channelsPrefix, 'getDataTables')
	static GET_DATATABLE = StringUtils.joinPaths(ModelApiChannel.channelsPrefix, 'getDataTable')
	static GET_DATATABLE_MENU = StringUtils.joinPaths(ModelApiChannel.channelsPrefix, 'getDataTableMenu')
}
