<template>
	<n-table :bordered="false" :single-line="false" size="small">
		<thead>
		<tr>
			<th>表达式</th>
			<th>含义</th>
			<th>用例</th>
		</tr>
		</thead>
		<tbody>
		<tr>
			<td>
				<n-text code v-text="'removeExtraSpaces'"/>
			</td>
			<td>去除字符串中多余空格</td>
			<td>
				<n-text code>
					<DoubleCurlyBrackets content="#removeExtraSpaces"/>
					<DoubleCurlyBrackets content="fieldName"/>
					<DoubleCurlyBrackets content="/removeExtraSpaces"/>
				</n-text>
				或者
					<n-text code>
					<DoubleCurlyBrackets content="#removeExtraSpaces fieldName"/>
				</n-text>
			</td>
		</tr>

		</tbody>
	</n-table>
</template>

<script setup lang="ts">

import DoubleCurlyBrackets from "@render/components/TemplateEditor/components/DoubleCurlyBrackets.vue";
</script>

<style scoped lang="less">

</style>
