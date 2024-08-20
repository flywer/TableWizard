import {Controller, IpcHandle} from "@main/framework/windowManager/decorators";
import {join} from "node:path";
import {TemplateApiChannel} from "@common/channels/TemplateApiChannel";
import {ProjectService} from "@main/service/ProjectService";
import {ensureDirSync} from "fs-extra";
import {TemplateService} from "@main/service/TemplateService";
import CommonResult from "@common/CommonResult";
import log from "electron-log/main";
import {DialectTemplate} from "@common/constants/templates";

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

        const data = await this.templateService.getTemplates(folderPath);

        return CommonResult.success(data)
    }

    @IpcHandle(TemplateApiChannel.GET_TEMPLATE)
    async getTemplate(projectId: number, dialect: string) {
        const project = await this.projectService.getProjectById(projectId);
        const folderPath = join(project.projectPath, this.TEMPLATE_FOLDER_NAME);
        ensureDirSync(folderPath);

        const data = await this.templateService.getTemplates(folderPath);

        const item = data.find(item => item.dialect.toLowerCase() === dialect.toLowerCase());
        if (!item) {
            // 方言不存在
            log.scope(this.constructor.name).warn(`方言 ${dialect} 模板不存在，将使用默认模板`)

            const defaultTemplate = DialectTemplate.find(item => item.dialect.toLowerCase() === dialect.toLowerCase());
            if (defaultTemplate && defaultTemplate.template) {
                return CommonResult.success(defaultTemplate.template)
            } else {
                return CommonResult.error(`方言 ${dialect} 模板不存在`)
            }
        }
        return CommonResult.success(item.template)
    }
}
