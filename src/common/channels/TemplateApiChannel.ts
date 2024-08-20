import {StringUtils} from "@common/utils/StringUtils";

export class TemplateApiChannel {
    private static channelsPrefix = 'template'

    // 获取模板列表
    static readonly GET_TEMPLATES = StringUtils.joinPaths(TemplateApiChannel.channelsPrefix, 'getTemplates')
    static GET_TEMPLATE = StringUtils.joinPaths(TemplateApiChannel.channelsPrefix, 'getTemplate')
}
