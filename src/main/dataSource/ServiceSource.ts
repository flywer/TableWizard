import {DataSource} from "typeorm";
import {join} from "node:path";
import {AppConstant} from "@common/constants/app/AppConstant";
import {Project} from "@main/entity/Project";
import {Model} from "@main/entity/Model";
import {ModelVersionHistory} from "@main/entity/ModelVersionHistory";

export const ServiceSource = new DataSource({
	/*type: "mysql",
	host: process.env["ALIYUN_HOST"],
	port: 3600,
	username: process.env["ALIYUN_USERNAME"],
	password: process.env["ALIYUN_PWD"],
	database: "electron_app_template",
	synchronize: false,
	logging: true,*/

	type: "sqlite",
	database: join(AppConstant.APP_DATA_PATH, '/cache/cache.lite'),
	synchronize: true,
	logging: false,
	entities: [Project, Model, ModelVersionHistory],
})
