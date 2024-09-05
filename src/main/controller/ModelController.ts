import {Controller, IpcHandle} from "@main/framework/windowManager/decorators";
import {ModelApiChannel} from "@common/channels/ModelApiChannel";
import CommonResult from "@common/CommonResult";
import {join} from "path";
import jsonfile from "jsonfile";
import {ProjectService} from "@main/service/ProjectService";
import {ModelService} from "@main/service/ModelService";
import {FsUtils} from "@common/utils/FsUtils";
import {ensureDirSync} from "fs-extra";
import {isEmpty} from "lodash";

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
		ensureDirSync(folderPath)
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

	/**
	 * 获取数据表菜单项
	 **/
	@IpcHandle(ModelApiChannel.GET_DATATABLE_MENU)
	async getDataTableMenu(projectId: number): Promise<CommonResult<any>> {
		const project = await this.projectService.getProjectById(projectId);
		const folderPath = join(project.projectPath, 'models', 'datatable');

		ensureDirSync(folderPath);

		const data = await this.modelService.readModelJsonFiles(folderPath);

		if (isEmpty(data)) {
			return CommonResult.success(null)
		} else {
			// 为其添加一个根节点
			return CommonResult.success(data)
		}
	}

	@IpcHandle(ModelApiChannel.GET_DATATABLE)
	async getDataTable(projectId: number, datatableId: string) {
		const project = await this.projectService.getProjectById(projectId);
		const folderPath = join(project.projectPath, 'models', 'datatable');
		ensureDirSync(folderPath);

		const data = await this.modelService.findDatatableFile(folderPath, datatableId);

		return CommonResult.success(data)
	}
}
