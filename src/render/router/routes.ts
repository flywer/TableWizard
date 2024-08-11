import {RouteRecordRaw} from 'vue-router'
import App from "@render/App.vue"
import MainWindow from "@render/windows/MainWindow.vue";
import SettingWindow from "@render/windows/SettingWindow.vue";
import {RouteName} from "@common/constants/app/RouteName";
import Home from "@render/views/mainWindow/Index.vue";
import Project from "@render/views/mainWindow/pages/project/Index.vue";
import ProjectModelManager from "@render/views/mainWindow/pages/project/modelManager/Index.vue";
import ProjectTypeManager from "@render/views/mainWindow/pages/project/typeManager/Index.vue";

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: RouteName.app,
		component: App,
		children: [
			{
				name: RouteName.mainWindow,
				path: RouteName.mainWindow,
				component: MainWindow,
				children: [
					{
						name: RouteName.home,
						path: '/' + RouteName.home,
						component: Home
					},
					{
						name: RouteName.project,
						path: '/' + RouteName.project,
						component: Project,
						children: [
							{
								name: RouteName.modelManager,
								path: '/' + RouteName.modelManager,
								component: ProjectModelManager
							},
							{
								name: RouteName.typeManager,
								path: '/' + RouteName.typeManager,
								component: ProjectTypeManager
							}
						]
					}
				]
			},
			{
				name: RouteName.settingWindow,
				path: RouteName.settingWindow,
				component: SettingWindow,
			}
		]
	}
]
