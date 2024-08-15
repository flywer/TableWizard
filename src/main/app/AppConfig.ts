import config from 'electron-cfg'
import log from "electron-log";
import {AppConstant} from "@common/constants/app/AppConstant";
import {join} from "path";

export class AppConfig {

	// 应用配置存储位置
	static readonly APP_CONFIG_PATH = join(AppConstant.APP_DATA_PATH, 'config', 'app.json')

	public static appConfigInit() {
		config.file(AppConfig.APP_CONFIG_PATH)
		// 设置日志存储位置
		config.logger(log)

		log.scope('AppConfig').info('应用配置模块初始化成功')
	}
}
