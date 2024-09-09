<template>
	<div>
		<ag-grid-vue
			id="pretty-grid"
			style="width: 100%; height: 300px;"
			class="ag-theme-alpine"
			:rowData="rowData"
			:localeText="AG_GRID_LOCALE_CN"
			:defaultColDef="defaultColDef"
			:columnDefs="columnDefs"
			:rowDragManaged="true"
			:row-height="36"
			:scrollbarWidth="12"
			@gridReady="onGridReady"
			@cellClicked="onCellClicked"
			@cellValueChanged="onCellValueChanged"
			@sortChanged="onSortChanged"
		/>
	</div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, PropType, ref, shallowRef, watch} from 'vue';
import {AgGridVue} from "ag-grid-vue3";
import type {ColDef, GridApi} from 'ag-grid-community';
import {AG_GRID_LOCALE_CN} from '@ag-grid-community/locale';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

enum CellEditor {
	agTextCellEditor = 'agTextCellEditor',
	agLargeTextCellEditor = 'agLargeTextCellEditor',
	agSelectCellEditor = 'agSelectCellEditor',
	agNumberCellEditor = 'agNumberCellEditor',
	agDateCellEditor = 'agDateCellEditor',
	agCheckboxCellRenderer = 'agCheckboxCellRenderer'
}

const props = defineProps({
	rowData: {
		type: Array as PropType<EntityField[]>,
		default: () => []
	},
});

watch(() => props.rowData, (newVal) => {
	console.log(newVal.length);
	// gridApi.value?.setRowData(newVal);
})


const gridApi = shallowRef<GridApi>();

const defaultColDef: ColDef = {
	flex: 1,
	editable: true,
	cellEditor: CellEditor.agTextCellEditor,
	resizable: true,
	filter: true,
}

const columnDefs = ref<ColDef[]>([
	{
		headerName: '',
		field: 'prefix',
		editable: false,
		width: 55,
		resizable: false,
		lockPosition: true,
		suppressMovable: true,
		cellStyle: {
			'border': 'none',
			'padding': '0',
		},
		rowDrag: true,
		filter: false
	},
	{headerName: '唯一标识符', field: 'id', hide: true},
	{headerName: '字段名称', field: 'fieldName'},
	{headerName: '显示名称', field: 'fieldComment'},
	{headerName: '主键', width: 100, field: 'primaryKey', cellEditor: CellEditor.agCheckboxCellRenderer},
	{headerName: '不为空', width: 100, field: 'notNull', cellEditor: CellEditor.agCheckboxCellRenderer},
	{headerName: '自增', width: 100, field: 'autoIncrement', cellEditor: CellEditor.agCheckboxCellRenderer},
	{headerName: '字段类型', field: 'type'},
	{headerName: '长度', field: 'length', cellEditor: CellEditor.agNumberCellEditor},
	{headerName: '小数位数', field: 'scale', cellEditor: CellEditor.agNumberCellEditor},
	{headerName: '默认值', field: 'defaultValue'},
]);

const onGridReady = (params) => {
	// 获取gridApi
	gridApi.value = params.api;

	gridApi.value.sizeColumnsToFit();
}

const onCellClicked = (cell) => {
	/*	console.log(cell);
		// 获取选中单元格的数据
		console.log(cell.value);
		// 获取选中单元格所在行号
		console.log(cell.rowIndex);
		// 获取选中单元格所在行的数据
		console.log(cell.data);*/
}

const onCellValueChanged = (params) => {
	console.log(params)
}

const onSortChanged = (params) => {
	// rowData的值并不会改变
	console.log(params)
}


onMounted(() => {
	window.addEventListener('resize', () => {
		gridApi.value.sizeColumnsToFit();
	})
})

onUnmounted(() => {
	window.removeEventListener('resize', () => {
		gridApi.value.sizeColumnsToFit();
	})
})

</script>

<style scoped lang="less">
// region 滚动条样式
.ag-theme-alpine {
	::-webkit-scrollbar {
		width: 12px;
		height: 12px;
	}

	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	::-webkit-scrollbar-thumb {
		background: #ccc;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #bbb;
	}
}

.ag-theme-alpine .ag-body-viewport,
.ag-theme-alpine .ag-body-horizontal-scroll-viewport {
	scrollbar-width: thin;
	scrollbar-color: #888 #f1f1f1;
}

// endregion
// region 边框样式
.ag-theme-alpine{
	--ag-border-color: #eaeaea;
}
// endregion
</style>
