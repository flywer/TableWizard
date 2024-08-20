import {TemplateApiChannel} from "@common/channels/TemplateApiChannel";
import {ipcInstance} from "@render/plugins";

export class TemplateApi {
    static getTemplate(projectId: number, dialect: string): Promise<string> {
        return ipcInstance.send(TemplateApiChannel.GET_TEMPLATE, projectId, dialect)
    }
}
