import {StringUtils} from "@common/utils/StringUtils";

export class ProjectApiChannel {
	private static channelsPrefix = 'project'

	// 分页获取项目列表
	static readonly GET_PROJECT_PAGE = StringUtils.joinPaths(ProjectApiChannel.channelsPrefix, 'getProjectPage')
	// 创建项目
	static readonly CREATE_PROJECT = StringUtils.joinPaths(ProjectApiChannel.channelsPrefix, 'createProject')
	// 创建图标
	static CREATE_ICON = StringUtils.joinPaths(ProjectApiChannel.channelsPrefix, 'createIcon')
	// 更新图标
	static UPDATE_ICON_SIZE = StringUtils.joinPaths(ProjectApiChannel.channelsPrefix, 'updateIconSize')
	// 根据id获取项目
	static GET_PROJECT_BY_ID = StringUtils.joinPaths(ProjectApiChannel.channelsPrefix, 'getProjectById')
	// 根据项目路径获取项目数据
	static GET_PROJECT_DATA = StringUtils.joinPaths(ProjectApiChannel.channelsPrefix, 'getProjectData')
}
