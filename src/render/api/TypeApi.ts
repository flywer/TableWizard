import {ipcInstance} from "@render/plugins";
import {TypeApiChannel} from "@common/channels/TypeApiChannel";

export class TypeApi {
	static saveDataType(vo: SaveDataTypeVO) {
		return ipcInstance.send(TypeApiChannel.SAVE_DATA_TYPE, vo)
	}

	static getTypeData(projectId: number, id: string) {
		return ipcInstance.send(TypeApiChannel.GET_DATA_TYPE, projectId, id)
	}

	static async getDataTypeMenu(projectId: number) {
		return ipcInstance.send(TypeApiChannel.GET_DATA_TYPE_MENU, projectId)
	}
}
