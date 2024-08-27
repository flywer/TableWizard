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
				<n-text code v-text="'eq'"/>
			</td>
			<td>传入两个参数，当两个参数相等时，返回true，否则返回false</td>
			<td>
				<n-text code>
					<DoubleCurlyBrackets content="eq tableName tableName"/>
				</n-text>
			</td>
		</tr>
		<tr>
			<td>
				<n-text code v-text="'newlineToSpace'"/>
			</td>
			<td>将字符串中的换行符替换为空格</td>
			<td>
				<n-text code>
					<DoubleCurlyBrackets content="#newlineToSpace"/>
					<DoubleCurlyBrackets content="fieldName"/>
					<DoubleCurlyBrackets content="/newlineToSpace"/>
				</n-text>
				或者
				<n-text code>
					<DoubleCurlyBrackets content="newlineToSpace fieldName"/>
				</n-text>
			</td>
		</tr>
		<tr>
			<td>
				<n-text code v-text="'underline'"/>
			</td>
			<td>根据大小写转为下划线格式</td>
			<td>
				<n-text code>
					<DoubleCurlyBrackets content="#underline"/>
					<DoubleCurlyBrackets content="fieldName"/>
					<DoubleCurlyBrackets content="/underline"/>
				</n-text>
				或者
				<n-text code>
					<DoubleCurlyBrackets content="underline fieldName"/>
				</n-text>
			</td>
		</tr>
		<tr>
			<td>
				<n-text code v-text="'camel'"/>
			</td>
			<td>根据下划线转换为大小写格式</td>
			<td>
				<n-text code>
					<DoubleCurlyBrackets content="#camel"/>
					<DoubleCurlyBrackets content="fieldName"/>
					<DoubleCurlyBrackets content="/camel"/>
				</n-text>
				或者
				<n-text code>
					<DoubleCurlyBrackets content="camel fieldName"/>
				</n-text>
			</td>
		</tr>
		<tr>
			<td>
				<n-text code v-text="'toUpperCase'"/>
			</td>
			<td>字符串大写</td>
			<td>
				<n-text code>
					<DoubleCurlyBrackets content="#toUpperCase"/>
					<DoubleCurlyBrackets content="fieldName"/>
					<DoubleCurlyBrackets content="/toUpperCase"/>
				</n-text>
				或者
				<n-text code>
					<DoubleCurlyBrackets content="toUpperCase fieldName"/>
				</n-text>
			</td>
		</tr>
		<tr>
			<td>
				<n-text code v-text="'toLowerCase'"/>
			</td>
			<td>字符串小写</td>
			<td>
				<n-text code>
					<DoubleCurlyBrackets content="#toLowerCase"/>
					<DoubleCurlyBrackets content="fieldName"/>
					<DoubleCurlyBrackets content="/toLowerCase"/>
				</n-text>
				或者
				<n-text code>
					<DoubleCurlyBrackets content="toLowerCase fieldName"/>
				</n-text>
			</td>
		</tr>
		<tr>
			<td>
				<n-text code v-text="'trim'"/>
			</td>
			<td>字符串左右去空格</td>
			<td>
				<n-text code>
					<DoubleCurlyBrackets content="#trim"/>
					<DoubleCurlyBrackets content="fieldName"/>
					<DoubleCurlyBrackets content="/trim"/>
				</n-text>
				或者
				<n-text code>
					<DoubleCurlyBrackets content="trim fieldName"/>
				</n-text>
			</td>
		</tr>
		<tr>
			<td>
				<n-text code v-text="'space'"/>
			</td>
			<td>生成空格，可传入空格数量参数，默认为1</td>
			<td>
				<n-text code>
					<DoubleCurlyBrackets content="space 4"/>
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
