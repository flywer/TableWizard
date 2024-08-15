<template>
	<div class="h-full p-3">
		<n-flex vertical>
			<n-flex justify="space-between">
				<n-h3 class="font-bold select-none">项目管理</n-h3>
				<n-flex justify="end">
					<n-button secondary size="small" @click="handleCreate">
						<template #icon>
							<div class="i-material-symbols:add"/>
						</template>
						创建项目
					</n-button>
				</n-flex>
			</n-flex>

			<n-flex justify="center">
				<n-input v-model:value="pageParams.searchParam" style="width: 60%;" placeholder="搜索项目">
					<template #prefix>
						<div class="i-material-symbols:search-rounded w-5 h-5"/>
					</template>
				</n-input>
			</n-flex>

			<n-infinite-scroll class="mt-4" style="height: calc(100vh - 200px) " :distance="10" @load="handleLoad">
				<n-grid cols="2 600:3 1200:6 1800:8" x-gap="10" y-gap="10">
					<n-gi v-for="project in projectList" :key="project.id">
						<n-card
							hoverable
							class="cursor-pointer h-30"
							:content-style="{padding:'10px'}"
							@click="useTopMenu.addMenuItem({name: project.projectName, key: project.id})"
						>
							<n-thing>
								<template #avatar>
									<n-image :src="project.icon" :preview-disabled="true" class="w-12"/>
								</template>
								<template #header>
									{{ project.projectName }}
								</template>
								<template #description>
									{{ project.description }}
								</template>
								<template #action>
									<n-flex justify="end" class="mt-6" :size="2">
										<n-button quaternary size="tiny" @click.stop="handleOpenPath(project.projectPath)">
											<template #icon>
												<div class="i-material-symbols:folder-managed-outline-rounded"/>
											</template>
										</n-button>
										<n-button quaternary size="tiny" @click.stop="handleEdit">
											<template #icon>
												<div class="i-tabler:pencil-minus"/>
											</template>
										</n-button>
										<n-button quaternary size="tiny" @click.stop="handleDelete">
											<template #icon>
												<div class="i-tabler:trash"/>
											</template>
										</n-button>
									</n-flex>
								</template>
							</n-thing>
						</n-card>
					</n-gi>
				</n-grid>
			</n-infinite-scroll>
		</n-flex>

		<CreateProjectModal
			v-model:show="createProjectModalOpt.show"
			v-model:save-flag="createProjectModalOpt.saveFlag"
			:title="createProjectModalOpt.title"
		/>
	</div>
</template>

<script setup lang="ts">
import CreateProjectModal from "@render/components/project/CreateProjectModal.vue";
import {onMounted, reactive, watch} from "vue";
import {ProjectApi} from "@render/api/ProjectApi";
import {Project} from "@main/entity/Project";
import {useTopMenuStore} from "@render/stores/useTopMenu";
import {AppApi} from "@render/api/app/AppApi";

defineOptions({name: "Home"})

const useTopMenu = useTopMenuStore()

const projectList = reactive<Project[]>([])

const pageParams = reactive<PagedParam<string>>({
	pageNo: 1,
	pageSize: 100,
	searchParam: '',
	count: null
})

const createProjectModalOpt = reactive({
	show: false,
	saveFlag: false,
	title: '创建项目',
})

const handleCreate = () => {
	createProjectModalOpt.show = true
	createProjectModalOpt.saveFlag = false
}

const projectListLoad = () => {
	ProjectApi.getProjectPage(pageParams).then(res => {
		projectList.push(...res.data)
		pageParams.count = res.total
	})
}

// 滚动加载函数
const handleLoad = () => {
	if (projectList.length >= pageParams.count) {
		return
	}
	pageParams.pageNo += 1
	projectListLoad()
}

const handleEdit = () => {
}

const handleDelete = () => {
}

const handleOpenPath = (path: string) => {
	AppApi.openPath(path)
}

watch(() => createProjectModalOpt.saveFlag, async (newValue) => {
	if (newValue) {
		pageParams.pageNo = 1
		pageParams.count = null
		// 清空projectList
		projectList.splice(0, projectList.length)
		projectListLoad()
	}
})

onMounted(() => {
	projectListLoad()
})

</script>

<style scoped lang="less">

</style>
