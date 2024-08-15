import {ipcInstance} from "@render/plugins";
import {ProjectApiChannel} from "@common/channels/ProjectApiChannel";
import {Project} from "@main/entity/Project";

export class ProjectApi {

	static getProjectPage(pagedParam: PagedParam<string>): Promise<PagedRepsVO<Project>> {
		return ipcInstance.send(ProjectApiChannel.GET_PROJECT_PAGE, pagedParam)
	}

	static getDefaultProjectPath(): Promise<string> {
		return ipcInstance.send(ProjectApiChannel.GET_DEFAULT_PROJECT_PATH)
	}

	static createProject(vo: CreateProjectReqVO) {
		return ipcInstance.send(ProjectApiChannel.CREATE_PROJECT, vo)
	}


	static createIcon(value: string, size: number): Promise<string> {
		return ipcInstance.send(ProjectApiChannel.CREATE_ICON, value, size)
	}

	static getProjectById(projectId: number): Promise<Project> {
		return ipcInstance.send(ProjectApiChannel.GET_PROJECT_BY_ID, projectId)
	}

	static getProjectData(projectId: number): Promise<ProjectData> {
		return ipcInstance.send(ProjectApiChannel.GET_PROJECT_DATA, projectId)
	}
}
