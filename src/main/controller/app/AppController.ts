import {Controller, IpcHandle} from "@main/framework/windowManager/decorators"
import {app, dialog, shell} from "electron";
import {AppApiChannel} from "@common/channels/app/AppApiChannel";
import {AppConstant} from "@common/constants/app/AppConstant";
import log from "electron-log";
import Path from "path";
import {FsUtils} from "@common/utils/FsUtils";
import {autoUpdater} from "electron-updater";
import CommonResult from "@common/CommonResult";

@Controller()
export class AppController {
	constructor() {
	}

	/**
	 * 应用重启
	 **/
	@IpcHandle(AppApiChannel.RELAUNCH)
	public relaunch() {
		app.relaunch()
		app.exit(0)
	}

	/**
	 * 打开默认浏览器
	 **/
	@IpcHandle(AppApiChannel.OPEN_DEFAULT_BROWSER)
	public handleOpenDefaultBrowser(link: string) {
		shell.openExternal(link).catch(error => {
		});
	}

	@IpcHandle(AppApiChannel.OPEN_PATH)
	public handleOpenPath(path: string) {
		shell.openPath(path).catch(e => {
			log.error(e)
		})
	}

	@IpcHandle(AppApiChannel.GET_APP_NAME)
	public handleGetAppName() {
		return AppConstant.APP_NAME
	}

	@IpcHandle(AppApiChannel.GET_APP_VERSION)
	public handleGetAppVersion() {
		return autoUpdater.currentVersion.version
	}

	@IpcHandle(AppApiChannel.GET_APP_RESOURCE_PATH)
	public handleGetAppResourcePath() {
		return AppConstant.APP_RESOURCE_PATH
	}

	@IpcHandle(AppApiChannel.GET_APP_DATA_PATH)
	public handleGetAppDataPath() {
		return AppConstant.APP_DATA_PATH
	}

	@IpcHandle(AppApiChannel.GET_APP_TEMP_DATA_PATH)
	public handleGetAppTempDataPath() {
		return AppConstant.APP_TEMP_DATA_PATH
	}

	@IpcHandle(AppApiChannel.GET_APP_LOG_PATH)
	public handleGetAppLogPath() {
		return Path.join(AppConstant.APP_TEMP_DATA_PATH, 'logs')
	}

	@IpcHandle(AppApiChannel.GET_APP_CACHE_PATH)
	public handleGetAppCachePath() {
		return Path.join(AppConstant.APP_DATA_PATH, 'cache')
	}

	@IpcHandle(AppApiChannel.GET_FOLDER_SIZE)
	public async handleGetFolderSize(path: string) {
		return new Promise<string>((resolve, reject) => {
			FsUtils.calculateSize(path, (error, size) => {
				if (error)
					reject(error)
				resolve(FsUtils.formatBytes(size))
			})
		})
	}

	@IpcHandle(AppApiChannel.SELECT_FILE_PATH)
	public async handleSelectFilePath() {
		return new Promise<string>((resolve, reject) => {
			dialog.showOpenDialog({
				properties: ['openFile']
			}).then(result => {
				if (result.canceled) {
					reject('未选择文件')
				} else {
					resolve(result.filePaths[0])
				}
			}).catch(error => {
				reject(error)
			})
		})
	}

	@IpcHandle(AppApiChannel.SELECT_FOLDER_PATH)
	public async handleSelectFolderPath() {
		return new Promise<CommonResult<any>>((resolve, reject) => {
			dialog.showOpenDialog({
				properties: ['openDirectory']
			}).then(result => {
				if (result.canceled) {
					reject(CommonResult.error('未选择文件夹'))
				} else {
					// 判断此文件夹为空
					if (!FsUtils.isEmptyDir(result.filePaths[0])) {
						reject(CommonResult.error('文件夹不为空'))
					}
					resolve(CommonResult.success(result.filePaths[0]))
				}
			}).catch(error => {
				reject(CommonResult.error(error.message))
			})
		})
	}

}
