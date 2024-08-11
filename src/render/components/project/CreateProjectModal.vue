<template>
	<n-modal
		v-model:show="_show"
		:title="title"
		preset="card"
		:mask-closable="true"
		:closable="true"
		:size="'small'"
		:style="{width: '400px'}"
		:segmented="{content: true}"
	>
		<template #header>
			<n-text class="select-none">{{ title }}</n-text>
		</template>
		<template #default>
			<n-scrollbar style="max-height: calc(100vh - 350px)">
				<n-form
					ref="formRef"
					:model="formModel"
					:rules="formRules"
					:size="'small'"
					:label-placement="'left'"
					:label-width="95"
					:label-align="'left'"
				>
					<n-grid :cols="1" :x-gap="4">
						<n-form-item-gi label="" path="projectName">
							<n-flex justify="center" class="w-full">
								<n-image :src="pngIcon"/>
							</n-flex>
						</n-form-item-gi>
						<n-form-item-gi label="" path="projectName">
							<n-input class="text-center" v-model:value="formModel.projectName" placeholder="项目名称"/>
						</n-form-item-gi>
						<n-form-item-gi label="" path="description">
							<n-input type="textarea" v-model:value="formModel.description" placeholder="项目描述"/>
						</n-form-item-gi>
					</n-grid>
				</n-form>
			</n-scrollbar>
		</template>
		<template #action>
			<n-flex :justify="'end'">
				<n-button type="primary" :size="'small'" @click="handleCreate" :loading="isSaving">创建</n-button>
			</n-flex>
		</template>
	</n-modal>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import {FormInst} from "naive-ui";
import {ProjectApi} from "@render/api/ProjectApi";
import {random} from "lodash-es";

const props = defineProps({
	show: {
		type: Boolean,
		required: true,
		default: false
	},
	title: {
		type: String,
		default: ''
	},
	saveFlag: {
		type: Boolean,
		required: true,
		default: false
	}
})

const emit = defineEmits(['update:show', 'update:saveFlag'])
const _show = ref(false)

watch(() => props.show, async (v) => {
	if (!v) {
		_show.value = v
		forModelInit()
	} else {
		handleChangeIcon()
		_show.value = v
	}
})
watch(_show, async (v) => {
	emit('update:show', v)
})

const pngIcon = ref('');

const formRef = ref<FormInst | null>(null);
let formModel = reactive({
	projectName: null,
	description: null
})
const formRules = reactive({
	projectName: {
		required: true,
		trigger: ['input'],
		message: '项目名称不能为空'
	}
})

const isSaving = ref(false)

const forModelInit = () => {
	formModel = reactive({
		projectName: null,
		description: null
	})
}

const handleCreate = () => {
	formRef.value?.validate(async (errors) => {
		if (!errors) {
			isSaving.value = true
			ProjectApi.createProject({
				projectName: formModel.projectName,
				description: formModel.description,
				icon: pngIcon.value
			})
				.then((res) => {
					emit('update:saveFlag', true)
					_show.value = false
				})
				.catch(() => window.$message.error('项目创建失败'))
				.finally(() => isSaving.value = false)
		}
	})
}

const handleChangeIcon = () => {
	ProjectApi.createIcon(random(0, 10000).toString(), 100).then(res => {
		pngIcon.value = `data:image/png;base64,${res.data}`
	})
}
</script>

<style scoped lang="less">

</style>
