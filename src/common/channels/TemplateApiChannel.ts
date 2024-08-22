import {StringUtils} from "@common/utils/StringUtils";

export class TemplateApiChannel {
	private static channelsPrefix = 'template'

	// 获取模板列表
	static readonly GET_TEMPLATES = StringUtils.joinPaths(TemplateApiChannel.channelsPrefix, 'getTemplates')
	// 获取模板
	static readonly GET_TEMPLATE = StringUtils.joinPaths(TemplateApiChannel.channelsPrefix, 'getTemplate')
}
