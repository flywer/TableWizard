import {Controller, IpcHandle} from "@main/framework/windowManager/decorators";
import {ProjectApiChannel} from "@common/channels/ProjectApiChannel";
import {ProjectService} from "@main/service/ProjectService";
import CommonResult from "@common/CommonResult";
import jdenticon from 'jdenticon';
import {promises as fs} from 'fs';
import {join} from 'path';
import jsonfile from 'jsonfile';
import log from "electron-log";
import {FsUtils} from "@common/utils/FsUtils";
import {Project} from "@main/entity/Project";

@Controller()
export class ProjectController {
	constructor(
		private projectService: ProjectService
	) {
	}

	@IpcHandle(ProjectApiChannel.CREATE_PROJECT)
	async createProject(vo: CreateProjectReqVO) {
		const project = await this.projectService.createProject(vo);

		// 在目录下创建基础文件和文件夹
		// 创建项目文件夹
		await fs.mkdir(project.projectPath, {recursive: true});

		// 创建 project.json 文件
		const projectJsonPath = join(project.projectPath, 'project.json');
		const projectJson = {
			name: project.projectName,
			// 添加其他需要的 project.json 信息
		};
		await jsonfile.writeFile(projectJsonPath, projectJson, {spaces: 2});

		// 创建子文件夹
		const subFolders = ['models', 'types', 'scripts', 'templates']; //  子文件夹名称数组
		for (const folderName of subFolders) {
			const folderPath = join(project.projectPath, folderName);
			await fs.mkdir(folderPath);
		}

		log.info(`创建项目成功，项目路径：${project.projectPath}`);

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
	createIcon(value: string, size: number) {
		const buffer = jdenticon.toPng(value, size);
		const base64 = buffer.toString('base64');
		return CommonResult.success(base64)
	}

	@IpcHandle(ProjectApiChannel.UPDATE_ICON_SIZE)
	updateIconSize(size: number) {
		jdenticon.update('canvas', size);
		return CommonResult.success(null)
	}

	@IpcHandle(ProjectApiChannel.GET_PROJECT_BY_ID)
	async getProjectById(id: number) {
		const project = await this.projectService.getProjectById(id);
		return CommonResult.success(project)
	}

	/**
	 * 进入项目时获取项目数据
	 **/
	@IpcHandle(ProjectApiChannel.GET_PROJECT_DATA)
	async getProjectData(projectId: number) {

		const project = await this.projectService.getProjectById(projectId);

		await this.checkProjectFile(project);

		await this.checkModelsFolder(project.projectPath);

		const modelsFolderPath = join(project.projectPath, 'models');

		// 获取 models 文件夹下的所有文件列表
		const modelFiles = await fs.readdir(modelsFolderPath);

		// 构建项目信息对象
		const projectInfo = {
			//...projectData,
			models: modelFiles
		};

		log.info(projectInfo);

		return CommonResult.success(projectInfo)
	}

	/**
	 * 检查 project.json 文件是否存在，不存在则创建
	 **/
	public async checkProjectFile(project: Project) {
		// 检查 project.json 文件是否存在，不存在则创建
		const projectJsonPath = join(project.projectPath, 'project.json');
		if (!await FsUtils.fileOrFolderExists(projectJsonPath)) {
			// 文件不存在，创建文件
			await jsonfile.writeFile(projectJsonPath, project, {spaces: 2});
		}
	}

	/**
	 * 检查 models 文件夹是否存在，不存在则创建
	 **/
	public async checkModelsFolder(projectPath: string) {
		// 检查 models 文件夹是否存在，不存在则创建
		const modelsFolderPath = join(projectPath, 'models');
		if (!await FsUtils.fileOrFolderExists(modelsFolderPath)) {
			// 文件夹不存在，创建文件夹
			await fs.mkdir(modelsFolderPath);
		}
	}
}
