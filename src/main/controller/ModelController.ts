import {Controller, IpcHandle} from "@main/framework/windowManager/decorators";
import {ModelApiChannel} from "@common/channels/ModelApiChannel";
import CommonResult from "@common/CommonResult";
import {join} from "path";
import jsonfile from "jsonfile";
import {ProjectService} from "@main/service/ProjectService";
import {GroupMenuOption} from "@render/components/GroupMenu/types";
import {ModelService} from "@main/service/ModelService";
import {FsUtils} from "@common/utils/FsUtils";

@Controller()
export class ModelController {
    constructor(
        private projectService: ProjectService,
        private modelService: ModelService
    ) {
    }

    @IpcHandle(ModelApiChannel.GET_MODELS)
    async getModels(projectId: number) {
        return null
    }

    @IpcHandle(ModelApiChannel.SAVE_DATATABLE)
    async saveDataTable(vo: SaveDataTableVO) {
        let project = await this.projectService.getProjectById(vo.projectId);
        const folderPath = join(project.projectPath, 'models', 'datatable');
        if (vo.parentId) {
            const path = await FsUtils.findFolderPathByName(folderPath, vo.parentId)
            if (path) {
                const savePath = join(path, `${vo.id}.json`);
                jsonfile.writeFileSync(savePath, vo, {spaces: 2});
                return CommonResult.success("保存成功")
            } else {
                return CommonResult.error(`文件夹 ${vo.parentId} 不存在`)
            }
        } else {
            const filePath = join(folderPath, `${vo.id}.json`);
            jsonfile.writeFileSync(filePath, vo, {spaces: 2});
            return CommonResult.success("保存成功")
        }
    }

    @IpcHandle(ModelApiChannel.GET_DATATABLE_MENU)
    async getDataTableMenu(projectId: number): Promise<CommonResult<GroupMenuOption>> {
        const project = await this.projectService.getProjectById(projectId);
        const folderPath = join(project.projectPath, 'models', 'datatable');

        const data = await this.modelService.readModelJsonFiles(folderPath);

        // 为其添加一个根节点
        return CommonResult.success({
            menuType: 'tree',
            type: 'folder',
            label: '根目录',
            key: 'datatable-root',
            hiddenExpandIcon: true,
            children: data
        })
    }

    @IpcHandle(ModelApiChannel.GET_DATATABLE)
    async getDataTable(projectId: number, datatableId: string) {
        let project = await this.projectService.getProjectById(projectId);
        const folderPath = join(project.projectPath, 'models', 'datatable');

        const data = await this.modelService.findDatatableIdFile(folderPath, datatableId);

        return CommonResult.success(data)
    }
}
