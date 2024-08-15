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
import {AppConstant} from "@common/constants/app/AppConstant";

@Controller()
export class ProjectController {
	constructor(
		private projectService: ProjectService,
	) {
	}

	private PROJECT_DEFAULT_PATH = join(AppConstant.APP_DATA_PATH, 'projects') // 默认项目路径
	private PROJECT_FILE_NAME = 'project.json' // 项目配置文件名称
	private subFolders = ['models', 'types', 'scripts', 'templates'] //  子文件夹名称数组

	/**
	 * 获取项目分页数据
	 **/
	@IpcHandle(ProjectApiChannel.GET_PROJECT_PAGE)
	async getProjectPage(param: PagedParam<string>) {
		const result = await this.projectService.getProjectPage(param);

		return CommonResult.success({
			data: result[0],
			total: result[1],
			...param
		})
	}

	@IpcHandle(ProjectApiChannel.GET_DEFAULT_PROJECT_PATH)
	async getDefaultProjectPath() {
		return CommonResult.success(this.PROJECT_DEFAULT_PATH);
	}

	/**
	 * 创建项目
	 **/
	@IpcHandle(ProjectApiChannel.CREATE_PROJECT)
	async createProject(vo: CreateProjectReqVO) {
		const project = await this.projectService.createProject(vo);

		// 创建项目文件夹
		await fs.mkdir(project.projectPath, {recursive: true});

		await this.checkProjectFile(project);
		await this.checkFolders(project.projectPath);

		log.info(`创建项目成功，项目路径：${project.projectPath}`);

		return CommonResult.success(project)
	}

	/**
	 * 创建图标
	 **/
	@IpcHandle(ProjectApiChannel.CREATE_ICON)
	createIcon(value: string, size: number) {
		const buffer = jdenticon.toPng(value, size);
		const base64 = buffer.toString('base64');
		return CommonResult.success(base64)
	}

	/**
	 * 根据id获取项目
	 **/
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

		await this.checkFolders(project.projectPath);

		// 构建项目信息对象
		const projectInfo: ProjectData = {
			models: (await this.getModelsData(project.projectPath)).data,
		};

		log.info(projectInfo);

		return CommonResult.success(projectInfo)
	}

	/**
	 * 检查 project.json 文件是否存在，不存在则创建
	 **/
	public async checkProjectFile(project: Project) {
		// 检查 project.json 文件是否存在，不存在则创建
		const projectJsonPath = join(project.projectPath, this.PROJECT_FILE_NAME);
		if (!await FsUtils.fileOrFolderExists(projectJsonPath)) {
			// 文件不存在，创建文件
			await jsonfile.writeFile(projectJsonPath, project, {spaces: 2});
		}
	}

	/**
	 * 检查子文件夹是否存在，不存在则创建
	 **/
	public async checkFolders(projectPath: string) {
		for (const folderName of this.subFolders) {
			const folderPath = join(projectPath, folderName);
			if (!await FsUtils.fileOrFolderExists(folderPath)) {
				// 文件夹不存在，创建文件夹
				await fs.mkdir(folderPath);
			}
		}
	}

	/**
	 * 获取 models 数据
	 **/
	public async getModelsData(projectPath: string): Promise<CommonResult<any[]>> {
		try {
			const modelsFolderPath = join(projectPath, 'models');
			const modelFiles = await fs.readdir(modelsFolderPath);
			const modelsData = [];

			for (const file of modelFiles) {
				if (file.endsWith('.json')) {
					const filePath = join(modelsFolderPath, file);
					const modelData = await jsonfile.readFile(filePath);
					modelsData.push(modelData);
				}
			}

			return CommonResult.success(modelsData);
		} catch (error) {
			log.error(`获取 models 数据失败: ${error.message}`);
			return CommonResult.error(error.message);
		}
	}
}
