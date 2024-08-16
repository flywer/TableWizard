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
	public async getModelsData(projectPath: string): Promise<CommonResult<any>> {
		try {
			const modelsFolderPath = join(projectPath, 'models');
			const modelSubFolders = ['datatable']
			const modelsData: Record<string, ModelTreeData> = {}; // 使用 Record 类型定义 modelsData 结构

			for (const subFolder of modelSubFolders) {
				// 初始化 modelsData 中的子文件夹数组
				modelsData[subFolder] = {
					data: [],
					treeRelation: null
				};

				// 构建子文件夹路径
				const subFolderPath = join(modelsFolderPath, subFolder);

				try {
					// 检查子文件夹是否存在
					await fs.access(subFolderPath);

					// 定义递归读取函数
					const readModelsData = async (folderPath: string) => {
						const files = await fs.readdir(folderPath);
						for (const file of files) {
							const filePath = join(folderPath, file);
							const stat = await fs.stat(filePath);
							if (stat.isDirectory()) {
								// 如果是文件夹，递归读取
								// await readModelsData(filePath);
							} else if (file === 'treeRelation.json') {
								// 读取 treeRelation.json
								// ... 根据 treeConfigData 中的结构读取数据文件，并将数据添加到 modelsData[subFolder] 中
								modelsData[subFolder].treeRelation = await jsonfile.readFile(filePath);
							} else if (file.endsWith('.json')) {
								// 如果是其他 json 文件，直接读取数据
								const modelData = await jsonfile.readFile(filePath);
								modelsData[subFolder].data.push(modelData);
							}
						}
					};

					// 从子文件夹开始递归读取
					await readModelsData(subFolderPath);
				} catch (err) {
					// 子文件夹不存在，跳过
					console.warn(`子文件夹 ${subFolder} 不存在`);
				}
			}

			return CommonResult.success(modelsData);
		} catch (error) {
			log.error(`获取 models 数据失败: ${error.message}`);
			return CommonResult.error(error.message);
		}
	}
}
