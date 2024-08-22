import * as monaco from 'monaco-editor';
import {monarchDefinition} from "@render/components/MonacoEditor/languages/commonsql.monarch";

export const registerPgSql = () => {
	const language = {
		id: 'commonsql',
		extensions: ['.sql'],
	};

	// 注册 commonsql 语言
	monaco.languages.register(language);

	// 自定义高亮
	monaco.languages.setMonarchTokensProvider('commonsql', monarchDefinition);

	// 定义一个 commonsql 主题
	monaco.editor.defineTheme("commonsql", {
		base: "vs",
		inherit: true, // 继承默认主题
		rules: [
			{token: "keyword", foreground: "#0F3AB9FF"}, // 关键字颜色
			{token: "operator", foreground: "#FF0000"}, // 运算符颜色
			{token: "predefined", foreground: "#800080"}, // 内置函数颜色
			{token: "type.identifier", foreground: "#2B91AF"}, // 数据类型颜色
			{token: "identifier", foreground: "#000000"},  // 标识符颜色
			{token: "string", foreground: "#A31515"},   // 字符串颜色
			{token: "comment", foreground: "#008000"},  // 注释颜色
		],
		colors: {
			"editor.foreground": "#000000",             // 编辑器默认字体颜色
		},
	});

	// 注册 commonsql 自动补全
	monaco.languages.registerCompletionItemProvider("commonsql", {
		provideCompletionItems: (model, position) => {
			const word = model.getWordUntilPosition(position);
			const range = {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: word.startColumn,
				endColumn: word.endColumn,
			};

			// 定义 commonsql 关键字补全
			const keywords = [
				"SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE",
				"CREATE", "TABLE", "ALTER", "DROP",
				"JOIN", "ON", "INNER", "LEFT", "RIGHT", "OUTER",
				"GROUP BY", "ORDER BY", "ASC", "DESC",
				"LIMIT", "OFFSET",
				"AND", "OR", "NOT", "IN", "LIKE", "BETWEEN"
			];

			const suggestions = keywords.map(keyword => ({
				label: keyword,
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: keyword,
				range: range,
			}));

			// 可以根据需要添加更多 commonsql 语法元素的自动补全，
			// 例如函数、数据类型、表名、列名等。

			return {suggestions: suggestions};
		},
	});
}
