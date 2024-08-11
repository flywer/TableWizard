<template>
	<div>
		<n-dropdown
			:size="'small'"
			:options="dropdownOptions"
			placement="bottom-start"
			trigger="click"
			@select="onDropdownSelect"
		>
			<n-button quaternary size="small" class="w-8 h-7">
				<template #icon>
					<div class="i-fluent:more-vertical-16-regular"/>
				</template>
			</n-button>
		</n-dropdown>
	</div>
</template>

<script setup lang="ts">
import {
	Settings20Regular,
	WeatherSunny20Regular,
	WeatherMoon20Regular,
	Power20Regular
} from '@vicons/fluent'
import {onMounted, ref, watch} from "vue";
import {DropdownOption} from "naive-ui";
import {renderIcon} from "@render/utils/common/renderIcon";
import {AppSettingsApi} from "@render/api/app/AppSettingsApi";
import {AppSettingsConstant} from "@common/constants/app/AppSettingsConstant";
import {AppSettingsApiChannel} from "@common/channels/app/AppSettingsApiChannel";
import {useIpc} from "@render/plugins";
import {AppApi} from "@render/api/app/AppApi";

// region 下拉菜单

// 当前应用主题模式
const theme = ref<'light' | 'dark'>(null)

const onThemeModeUpdate = async () => {
	const themeMode = await AppSettingsApi.getAppSettingByName(AppSettingsConstant.THEME_MODE)
	if (themeMode === null || themeMode.settingValue === 'light') {
		theme.value = 'light'
	} else {
		theme.value = 'dark'
	}
}

onMounted(() => {
	onThemeModeUpdate()
})

const dropdownOptions = ref<DropdownOption[]>([])

const dropdownOptionsInit = () => {
	dropdownOptions.value = [
		{
			label: '浅色模式',
			key: 'toLightMode',
			icon: renderIcon(WeatherSunny20Regular),
			show: theme.value === 'dark'
		},
		{
			label: '深色模式',
			key: 'toDarkMode',
			icon: renderIcon(WeatherMoon20Regular),
			show: theme.value === 'light'
		},
		{
			key: 'divider1',
			type: 'divider'
		},
		{
			label: '设置',
			key: 'appSettings',
			icon: renderIcon(Settings20Regular)
		},
		{
			key: 'divider2',
			type: 'divider'
		},
		{
			label: '重启应用',
			key: 'reboot',
			icon: renderIcon(Power20Regular)
		},
	]
}

watch([theme], () => {
	dropdownOptionsInit()
})


const ipc = useIpc()

ipc.on(AppSettingsApiChannel.THEME_MODE_UPDATED, () => {
	onThemeModeUpdate()
})

const onDropdownSelect = (key: string | number, option: DropdownOption) => {
	switch (key) {
		case 'toLightMode':
			AppSettingsApi.setAppSettingByName(AppSettingsConstant.THEME_MODE, 'light')
			theme.value = 'light'
			break
		case 'toDarkMode':
			AppSettingsApi.setAppSettingByName(AppSettingsConstant.THEME_MODE, 'dark')
			theme.value = 'dark'
			break
		case 'appSettings':
			AppSettingsApi.createAppSettingWindow()
			break
		case 'reboot':
			AppApi.relaunch()
			break
	}

}

// endregion

</script>

<style scoped lang="less"></style>
