import {Controller, IpcHandle} from "@main/framework/windowManager/decorators";
import {ProjectService} from "@main/service/ProjectService";
import {TemplateService} from "@main/service/TemplateService";
import {TypeApiChannel} from "@common/channels/TypeApiChannel";
import CommonResult from "@common/CommonResult";
import {join} from "path";
import {TypeService} from "@main/service/TypeService";
import {ensureDirSync} from "fs-extra";
import {FsUtils} from "@common/utils/FsUtils";
import {GroupMenuOption} from "@render/components/GroupMenu/types";
import {isEmpty} from "lodash";

@Controller()
export class TypeController {
    constructor(
        private typeService: TypeService,
        private projectService: ProjectService,
        private templateService: TemplateService
    ) {
    }

    @IpcHandle(TypeApiChannel.SAVE_DATA_TYPE)
    async saveDataType(vo: SaveDataTypeVO) {
        const project = await this.projectService.getProjectById(vo.projectId);
        const folderPath = join(project.projectPath, 'types', 'datatype');
        ensureDirSync(folderPath);
        if (vo.parentId) {
            const path = await FsUtils.findFolderPathByName(folderPath, vo.parentId);
            if (path) {
                const savePath = join(path, `${vo.id}.json`);
                await this.typeService.saveDataTypeFile(savePath, vo);
                return CommonResult.success("保存成功")
            } else {
                return CommonResult.error(`文件夹 ${vo.parentId} 不存在`)
            }
        } else {
            const filePath = join(folderPath, `${vo.id}.json`);
            await this.typeService.saveDataTypeFile(filePath, vo);
            return CommonResult.success("保存成功")
        }
    }

    @IpcHandle(TypeApiChannel.GET_DATA_TYPE)
    async getTypeData(projectId: number, typeId: string): Promise<CommonResult<any>> {
        const project = await this.projectService.getProjectById(projectId);

        const folderPath = join(project.projectPath, 'types', 'datatype');

        const data = await this.typeService.findDataTypeFile(folderPath, typeId);

        return CommonResult.success(data);
    }


    @IpcHandle(TypeApiChannel.GET_DATA_TYPE_MENU)
    async getDataTypeMenu(projectId: number): Promise<CommonResult<GroupMenuOption>> {
        const project = await this.projectService.getProjectById(projectId);
        const folderPath = join(project.projectPath, 'types', 'datatype');

        ensureDirSync(folderPath);

        const data = await this.typeService.readTypeJsonFiles(folderPath);

        if (isEmpty(data)) {
            return CommonResult.success(null)
        } else {
            // 为其添加一个根节点
            return CommonResult.success({
                menuType: 'tree',
                type: 'folder',
                label: '根目录',
                key: 'datatype-root',
                hiddenExpandIcon: true,
                children: data
            })
        }
    }
}
