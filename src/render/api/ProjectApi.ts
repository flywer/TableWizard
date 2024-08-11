import {ipcInstance} from "@render/plugins";
import {ProjectApiChannel} from "@common/channels/ProjectApiChannel";
import CommonResult from "@common/CommonResult";
import {Project} from "@main/entity/Project";

export class ProjectApi {

	static createProject(vo: CreateProjectReqVO) {
		return ipcInstance.send(ProjectApiChannel.CREATE_PROJECT, vo)
	}

	static getProjectPage(pagedParam: PagedParam<string>): Promise<CommonResult<PagedRepsVO<Project>>> {
		return ipcInstance.send(ProjectApiChannel.GET_PROJECT_PAGE, pagedParam)
	}

	static createIcon(value: string, size: number) {
		return ipcInstance.send(ProjectApiChannel.CREATE_ICON, value, size)
	}

	static updateIconSize(size: number) {
		return ipcInstance.send(ProjectApiChannel.UPDATE_ICON_SIZE, size)
	}

	static getProjectById(id: number): Promise<CommonResult<Project>> {
		return ipcInstance.send(ProjectApiChannel.GET_PROJECT_BY_ID, id)
	}
}
