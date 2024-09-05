import {ipcInstance} from "@render/plugins";
import {DatabaseChannel} from "@common/channels/DatabaseChannel";

export class DatabaseApi {
    static getDatabaseList(projectId: number): Promise<any> {
        return ipcInstance.send(DatabaseChannel.GET_DATABASE_LIST, projectId)
    }

    static getDatabase(projectId: number, id: string): Promise<any> {
        return ipcInstance.send(DatabaseChannel.GET_DATABASE, projectId, id)
    }
}
