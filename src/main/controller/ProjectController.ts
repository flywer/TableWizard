import {Controller, IpcHandle} from "@main/framework/windowManager/decorators";
import {ProjectApiChannel} from "@common/channels/ProjectApiChannel";
import {ProjectService} from "@main/service/ProjectService";
import CommonResult from "@common/CommonResult";
import jdenticon from 'jdenticon';

@Controller()
export class ProjectController {
	constructor(
		private projectService: ProjectService
	) {
	}

	@IpcHandle(ProjectApiChannel.CREATE_PROJECT)
	async createProject(vo: CreateProjectReqVO) {
		const project = await this.projectService.createProject(vo);
		return CommonResult.success(project)
	}


	@IpcHandle(ProjectApiChannel.GET_PROJECT_PAGE)
	async getProjectPage(param: PagedParam<string>) {
		const result = await this.projectService.getProjectPage(param);

		return CommonResult.success({
			data: result[0],
			total: result[1],
			...param
		})
	}

	@IpcHandle(ProjectApiChannel.CREATE_ICON)
	async createIcon(value: string, size: number) {
		const buffer = jdenticon.toPng(value, size);
		const base64 = buffer.toString('base64');
		return CommonResult.success(base64)
	}

	@IpcHandle(ProjectApiChannel.UPDATE_ICON_SIZE)
	async updateIconSize(size: number) {
		jdenticon.update('canvas', size);
		return CommonResult.success(null)
	}

	@IpcHandle(ProjectApiChannel.GET_PROJECT_BY_ID)
	async getProjectById(id: number) {
		const project = await this.projectService.getProjectById(id);
		return CommonResult.success(project)
	}
}
