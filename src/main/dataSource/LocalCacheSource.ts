import {DataSource} from "typeorm";
import {join} from "node:path";
import {AppConstant} from "@common/constants/app/AppConstant";
import {AppSettings} from "@main/entity/app/AppSettings";
import {AppNotification} from "@main/entity/app/AppNotification";

export const LocalCacheSource = new DataSource({
    type: "sqlite",
    database: join(AppConstant.APP_DATA_PATH, '/cache/cache.lite'),
    synchronize: true,
    logging: false,
    entities: [AppSettings,AppNotification],
})
