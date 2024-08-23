import {StringUtils} from "@common/utils/StringUtils";

export class NodeUtilApiChannel {
	private static channelsPrefix = 'nodeUtil'

	static readonly JOIN = StringUtils.joinPaths(this.channelsPrefix, 'join')
}
