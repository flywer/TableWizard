<template>
	<div class="flex h-full">
		<div v-if="project">
			<div class="absolute left-0 top-0 w-20 h-full" :style="{backgroundColor:useThemeVars().value.dividerColor}">
				<LeftSiderMenu/>
				<n-divider class="absolute top-0 -right-2" vertical style="height: 100%"/>
			</div>
			<div class="absolute left-20 right-0 h-full">
				<router-view/>
			</div>
		</div>
		<n-flex v-else vertical align="center">
			<div class="w-100 select-none" draggable="false">
				<img src="@render/assets/404.svg" alt="" draggable="false"/>
			</div>
			<n-text strong class="text-3xl select-none">项目不存在</n-text>
		</n-flex>
	</div>
</template>

<script setup lang="ts">
import {useAppNotificationStore} from "@render/stores/app/appNotification";
import {useRoute} from "vue-router";
import {computed, onMounted, ref, watch} from "vue";
import {Project} from "@main/entity/Project";
import {ProjectApi} from "@render/api/ProjectApi";
import {toNumber} from "lodash";
import LeftSiderMenu from "@render/components/project/LeftSiderMenu.vue";
import {useProjectPageStore} from "@render/stores/useProjectPage";
import {router} from "@render/router";
import {RouteName} from "@common/constants/app/RouteName";
import {useThemeVars} from "naive-ui";

defineOptions({name: 'Project'})

const useProjectPage = useProjectPageStore()

// 获取传入的参数
const route = useRoute();
const projectId = computed(() => route.query.projectId)
const project = ref<Project>(null)
// 因路由跳转,更新当前项目ID
watch(projectId, async (value) => {
	if (value) {
		project.value = (await ProjectApi.getProjectById(toNumber(value))).data
		await useProjectPage.routeTo(project.value.id)
	}
})

onMounted(async () => {
	project.value = (await ProjectApi.getProjectById(toNumber(route.query.projectId))).data

	await useProjectPage.routeTo(project.value.id)
})
</script>

<style>

</style>
