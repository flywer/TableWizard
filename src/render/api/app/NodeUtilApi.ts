import {ipcInstance} from "@render/plugins";
import {NodeUtilApiChannel} from "@common/channels/app/NodeUtilApiChannel";

export class NodeUtilApi {

	static join(...args: string[]) {
		return ipcInstance.send(NodeUtilApiChannel.JOIN, args)
	}
}
