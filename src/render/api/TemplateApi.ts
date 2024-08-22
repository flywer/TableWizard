import {TemplateApiChannel} from "@common/channels/TemplateApiChannel";
import {ipcInstance} from "@render/plugins";

export class TemplateApi {
	static getTemplate(projectId: number, dialect: string, templateType: string): Promise<string> {
		return ipcInstance.send(TemplateApiChannel.GET_TEMPLATE, projectId, dialect, templateType)
	}

	static getTemplates(projectId: number): Promise<DialectTemplate[]> {
		return ipcInstance.send(TemplateApiChannel.GET_TEMPLATES, projectId)
	}
}
