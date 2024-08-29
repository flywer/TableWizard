import {StringUtils} from "@common/utils/StringUtils"

export class TypeApiChannel {
    private static channelsPrefix = 'type'

    // 保存数据类型
    static readonly SAVE_DATA_TYPE = StringUtils.joinPaths(TypeApiChannel.channelsPrefix, 'saveDataType')
    // 获取数据类型
    static readonly GET_DATA_TYPE = StringUtils.joinPaths(TypeApiChannel.channelsPrefix, 'getDataType')
    // 获取数据类型菜单
    static GET_DATA_TYPE_MENU = StringUtils.joinPaths(TypeApiChannel.channelsPrefix, 'getDataTypeMenu')
}
