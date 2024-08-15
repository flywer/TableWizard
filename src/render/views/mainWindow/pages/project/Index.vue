<template>
	<div class="flex h-full">
		<div v-if="project != undefined">
			<div class="absolute left-0 top-0 w-20 h-full" :style="{backgroundColor:useThemeVars().value.dividerColor}">
				<LeftSiderMenu :projectId="projectId"/>
				<n-divider class="absolute top-0 -right-2" vertical style="height: 100%"/>
			</div>
			<div class="absolute left-20 right-0 h-full">
				<router-view/>
			</div>
		</div>
		<n-flex v-else
						class="select-none relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" justify="center"
						align="center"
						vertical>
			<n-spin v-if="isLoading" :size="'large'"/>
			<div v-else class="w-100 select-none" draggable="false">
				<img src="@render/assets/404.svg" alt="" draggable="false"/>
			</div>
		</n-flex>
	</div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed, onMounted, ref, watch} from "vue";
import {Project} from "@main/entity/Project";
import {ProjectApi} from "@render/api/ProjectApi";
import {toNumber} from "lodash";
import LeftSiderMenu from "@render/components/project/LeftSiderMenu.vue";
import {useProjectPageStore} from "@render/stores/useProjectPage";
import {useThemeVars} from "naive-ui";

defineOptions({name: 'Project'})

const useProjectPage = useProjectPageStore()

// 获取传入的参数
const route = useRoute();
const projectId = computed(() => toNumber(route.query.projectId))
const project = ref<Project>(undefined)

const isLoading = ref(false)

// 因路由跳转,更新当前项目ID
watch(projectId, async (value) => {
	if (value) {
		project.value = (await ProjectApi.getProjectById(toNumber(value)))
		if (project.value) {
			if (!useProjectPage.projectStateMap.has(projectId.value)) {
				useProjectPage.initProjectState(projectId.value)
				await useProjectPage.initProjectData(project.value.projectPath)
			}
			await useProjectPage.siderMenuRouteTo(project.value.id)
		}
	}
})

onMounted(async () => {
	isLoading.value = true
	project.value = (await ProjectApi.getProjectById(projectId.value))
	if (project.value) {
		if (!useProjectPage.projectStateMap.has(projectId.value)) {
			useProjectPage.initProjectState(projectId.value)
			await useProjectPage.initProjectData(project.value.projectPath)
		}
		await useProjectPage.siderMenuRouteTo(project.value.id)
	}
	isLoading.value = false
})
</script>

<style>

</style>
