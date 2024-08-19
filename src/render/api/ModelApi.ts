import {ModelApiChannel} from "@common/channels/ModelApiChannel";
import {ipcInstance} from "@render/plugins";
import {GroupMenuOption} from "@render/components/GroupMenu/types";

export class ModelApi {
    static saveDatatable(vo: SaveDataTableVO) {
        return ipcInstance.send(ModelApiChannel.SAVE_DATATABLE, vo)
    }

    static getDataTableMenu(projectId: number): Promise<GroupMenuOption> {
        return ipcInstance.send(ModelApiChannel.GET_DATATABLE_MENU, projectId)
    }

    static getDataTable(projectId: number, datatableId: string): Promise<SaveDataTableVO> {
        return ipcInstance.send(ModelApiChannel.GET_DATATABLE, projectId, datatableId)
    }
}
