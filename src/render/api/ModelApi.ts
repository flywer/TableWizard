import {ModelApiChannel} from "@common/channels/ModelApiChannel";
import {ipcInstance} from "@render/plugins";
import {PrettyTreeMenuOption} from "@render/components/PrettyTreeMenu";

export class ModelApi {
    static saveDatatable(vo: SaveDataTableVO) {
        return ipcInstance.send(ModelApiChannel.SAVE_DATATABLE, vo)
    }

    static getDataTableMenu(projectId: number): Promise<PrettyTreeMenuOption[]> {
        return ipcInstance.send(ModelApiChannel.GET_DATATABLE_MENU, projectId)
    }

    static getDataTable(projectId: number, datatableId: string): Promise<SaveDataTableVO> {
        return ipcInstance.send(ModelApiChannel.GET_DATATABLE, projectId, datatableId)
    }
}
