<template>
	<n-flex vertical>
		<span>
			官方文档：
			<n-a
				type="info"
				v-text="`https://handlebarsjs.com/zh/guide`"
				@click="AppApi.openDefaultBrowser('https://handlebarsjs.com/zh/guide')"
			/>
		</span>
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
					<n-text code>
						<DoubleCurlyBrackets content=" "/>
					</n-text>
				</td>
				<td>Handlebars 表达式是一些以双花括号
					<n-text code>
						<DoubleCurlyBrackets content=""/>
					</n-text>
					括起来的内容
				</td>
				<td>
					若传入的参数包含
					<n-text code v-text="`tableName`"/>
					，则可使用
					<n-text code>
						<DoubleCurlyBrackets content="tableName"/>
					</n-text>
					获取表名值
				</td>
			</tr>
			<tr>
				<td>
					<n-text code>
						<DoubleCurlyBrackets content="table.name"/>
					</n-text>
				</td>
				<td>若table对象存在一个name属性，则可以这样获取name值</td>
				<td>
					现有
					<n-text code>
						{table: {name: 'table_name'}}
					</n-text>
					则使用
					<n-text code>
						<DoubleCurlyBrackets content="table.name"/>
					</n-text>
					获取
				</td>
			</tr>
			<tr>
				<td>
					<n-text code>
						<DoubleCurlyBrackets content="../config"/>
					</n-text>
				</td>
				<td>
					在一些情况下，需要获取父级上下文的值，比如当在循环fields时，此时的上下文是field对象，而需要获取config对象的值，则可使用
				</td>
				<td>
					<n-text code>
						<DoubleCurlyBrackets content="#each fields"/>
						<DoubleCurlyBrackets content="../config"/>
						<DoubleCurlyBrackets content="/each"/>
					</n-text>
				</td>
			</tr>
			<tr>
				<td>
					<n-text code>~</n-text>
				</td>
				<td>空格控制，使用在某一侧，则清除某一侧所有空格，直到第一个位于同一侧的 Handlebars 表达式或非空格字符出现</td>
				<td>
					<n-text code>
						<DoubleCurlyBrackets content="#each fields"/>
						<DoubleCurlyBrackets content="id ~"/>&nbsp;&nbsp;&nbsp;&nbsp;
						<DoubleCurlyBrackets content="fieldName"/>
						<DoubleCurlyBrackets content="/each"/>
					</n-text>
					如此使用，将会清除id和fieldName之间的空格
				</td>
			</tr>
			<tr>
				<td>
					<n-text code v-text="'#if'"/>
				</td>
				<td>使用 if 来根据条件渲染代码块。如果其参数返回 false、undefined、null、""、 0 或者 []，Handlebars
					将不会渲染
				</td>
				<td>
					<n-text code>
						<DoubleCurlyBrackets content="#if tableComment"/>
						COMMENT = '
						<DoubleCurlyBrackets content="tableComment"/>
						'
						<DoubleCurlyBrackets content="/if"/>
					</n-text>
				</td>
			</tr>
			<tr>
				<td>
					<n-text code v-text="'#unless'"/>
				</td>
				<td>unless 与 if 相反</td>
				<td>
					<n-text code>
						<DoubleCurlyBrackets content="#each fields"/>
						<DoubleCurlyBrackets content="#unless id"/>
						error
						<DoubleCurlyBrackets content="/each"/>
					</n-text>
				</td>
			</tr>
			<tr>
				<td>
					<n-text code v-text="'#each'"/>
				</td>
				<td>使用内置的 each 遍历列表，
					可以使用 this 来引用被迭代的元素，也可以在表达式内使用
					<n-text code v-text="'@data'"/>
					，还可以使用
					<n-text code v-text="'@index'"/>
					获取当前索引，
					<n-text code v-text="'@first'"/>
					获取第一个元素，
					<n-text code v-text="'@last'"/>
					获取最后一个元素，
					嵌套的每个块都可以通过基于深度的路径来访问迭代变量。例如，要访问父级的索引，可以使用
					<n-text code>
						<DoubleCurlyBrackets content="@../index"/>
					</n-text>
				</td>
				<td>
					<n-text code>
						<DoubleCurlyBrackets content="#each fields"/>
						<DoubleCurlyBrackets content="@index"/>
						<DoubleCurlyBrackets content="/each"/>
					</n-text>
				</td>
			</tr>
			<tr>
				<td>
					<n-text code v-text="'#with'"/>
				</td>
				<td>with 允许你更改 template-part 的上下文表达式</td>
				<td>
					<n-text code>
						<DoubleCurlyBrackets content="#with config"/>
						<DoubleCurlyBrackets content="fieldUnderline"/>
						<DoubleCurlyBrackets content="/with"/>
					</n-text>
				</td>
			</tr>
			</tbody>
		</n-table>
	</n-flex>
</template>

<script setup lang="ts">
import {AppApi} from "@render/api/app/AppApi";
import DoubleCurlyBrackets from "@render/components/TemplateEditor/components/DoubleCurlyBrackets.vue";
</script>

<style scoped lang="less">

</style>
