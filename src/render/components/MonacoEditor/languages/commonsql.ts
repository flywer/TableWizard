import * as monaco from 'monaco-editor';
import IMonarchLanguage = monaco.languages.IMonarchLanguage;

const monarchDefinition: IMonarchLanguage | monaco.Thenable<IMonarchLanguage> = {
	tokenPostfix: ".sql",
	// 关键字
	keywords: [
		"SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE",
		"CREATE", "TABLE", "ALTER", "DROP", "VIEW", "SEQUENCE",
		"GRANT", "REVOKE", "INDEX", "UNIQUE", "PRIMARY KEY",
		"FOREIGN KEY", "CHECK", "CONSTRAINT",
		"AS", "BEGIN", "END", "DECLARE",
		"IF", "ELSE", "THEN", "CASE", "WHEN",
		"IS", "NOT", "NULL", "TRUE", "FALSE",
		"AND", "OR", "JOIN", "ON", "INNER", "LEFT", "RIGHT", "OUTER",
		"GROUP BY", "ORDER BY", "ASC", "DESC",
		"LIMIT", "OFFSET",
		"LIKE", "ILIKE", "SIMILAR TO", "BETWEEN", "IN",
		"EXISTS", "ANY", "ALL",
		"UNION", "INTERSECT", "EXCEPT",
		"COMMENT", "COLUMN", "TABLE", "DATABASE", "SCHEMA",
		"PRIMARY", "KEY", "SERIAL", "DEFAULT"
	],
	operators: [
		"=", ">", "<", "!", "~", "!", "%", "^", "&", "|", "-", "+", "*", "/",
		"<>", "<=", ">=", "LIKE", "ILIKE", "SIMILAR TO",
		"BETWEEN", "IN", "IS NULL", "IS NOT NULL"
	],
	builtinFunctions: [
		"COUNT", "SUM", "AVG", "MAX", "MIN",
		"LENGTH", "SUBSTRING", "COALESCE", "NULLIF",
		"ABS", "CEIL", "FLOOR", "ROUND",
		"UPPER", "LOWER", "INITCAP", "TRIM",
		"NOW", "DATE", "EXTRACT",
		"CAST", "CONVERT"
	],
	datatypes: [
		"BOOLEAN", "INTEGER", "BIGINT", "SMALLINT",
		"REAL", "DOUBLE PRECISION", "DECIMAL", "NUMERIC",
		"VARCHAR", "TEXT", "CHAR", "CHARACTER",
		"DATE", "TIMESTAMP", "TIME",
		"UUID", "JSON", "JSONB", "XML"
	],
	tokenizer: {
		root: [
			[/\-\-.*$/, "comment"],
			[/\/\*[\s\S]*?\*\//, "comment"],
			[/[a-zA-Z_$][\w$]*/, {
				cases: {
					"@keywords": "keyword",
					"@operators": "operator",
					"@builtinFunctions": "predefined",
					"@datatypes": "type.identifier",
					"@default": "identifier"
				}
			}],
			[/\d+/, "number"],
			[/\s+/, "white"],
			[/[;,.]/, "delimiter"],
			[/'[^']*'/, "string"],
			[/".*?"/, "string"]
		]
	}
};

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
