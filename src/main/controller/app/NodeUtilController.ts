import {Controller, IpcHandle} from "@main/framework/windowManager/decorators";
import {NodeUtilApiChannel} from "@common/channels/app/NodeUtilApiChannel";
import {join} from "node:path";
import CommonResult from "@common/CommonResult";

@Controller()
export class NodeUtilController {
	constructor() {
	}

	@IpcHandle(NodeUtilApiChannel.JOIN)
	public join(args: string[]) {
		return CommonResult.success(join(...args))
	}
}
