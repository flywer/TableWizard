import {Controller, IpcHandle} from "@main/framework/windowManager/decorators";
import {join} from "node:path";
import {TemplateApiChannel} from "@common/channels/TemplateApiChannel";
import {ProjectService} from "@main/service/ProjectService";
import {ensureDirSync} from "fs-extra";
import {TemplateService} from "@main/service/TemplateService";
import CommonResult from "@common/CommonResult";
import log from "electron-log/main";

@Controller()
export class TemplateController {
	constructor(
		private projectService: ProjectService,
		private templateService: TemplateService
	) {
	}

	private TEMPLATE_FOLDER_NAME = join('templates') // 默认模板路径

	// 获取所有方言模板
	@IpcHandle(TemplateApiChannel.GET_TEMPLATES)
	async getTemplates(projectId: number) {
		const project = await this.projectService.getProjectById(projectId);
		const folderPath = join(project.projectPath, this.TEMPLATE_FOLDER_NAME);
		ensureDirSync(folderPath);

		const data = this.templateService.getTemplates(folderPath);

		return CommonResult.success(data)
	}

	/**
	 * 获取模板
	 **/
	@IpcHandle(TemplateApiChannel.GET_TEMPLATE)
	async getTemplate(projectId: number, dialect: string, templateType: string) {
		const project = await this.projectService.getProjectById(projectId);
		const folderPath = join(project.projectPath, this.TEMPLATE_FOLDER_NAME);
		ensureDirSync(folderPath);
		this.templateService.ensureTemplateExists(folderPath, dialect, templateType);

		const template = this.templateService.getTemplate(folderPath, dialect, templateType);

		if (!template) {
			log.scope(this.constructor.name).warn(`数据库方言 ${dialect} 的 ${templateType} 模板不存在`)
			return CommonResult.error(`数据库方言 ${dialect} 的 ${templateType} 模板不存在`)
		}
		return CommonResult.success(template)
	}
}
