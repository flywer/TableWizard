import {StringUtils} from "@common/utils/StringUtils";

export class DatabaseChannel {
    private static channelsPrefix = 'database'

    static readonly GET_DATABASE_LIST = StringUtils.joinPaths(DatabaseChannel.channelsPrefix, 'getDatabaseList')
    static GET_DATABASE = StringUtils.joinPaths(DatabaseChannel.channelsPrefix, 'getDatabase')
}
