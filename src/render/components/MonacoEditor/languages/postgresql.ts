import * as monaco from 'monaco-editor';
import {monarchDefinition} from "@render/components/MonacoEditor/languages/pgsql.monarch";

export const registerPgSql = () => {
    // 注册 PostgreSQL 语言
    monaco.languages.register({id: "postgresql"});

    // 设置 PostgreSQL 语言的语法解析器
    monaco.languages.setMonarchTokensProvider('postgresql', monarchDefinition);

    // 定义一个 PostgreSQL 主题
    monaco.editor.defineTheme("pgsqlTheme", {
        base: "vs",
        inherit: true, // 继承默认主题
        rules: [
            {token: "keyword", foreground: "0000FF"}, // 关键字颜色
            {token: "operator", foreground: "FF0000"}, // 运算符颜色
            {token: "string", foreground: "A31515"},   // 字符串颜色
            {token: "comment", foreground: "008000"},  // 注释颜色
        ],
        colors: {
            "editor.foreground": "#000000",             // 编辑器默认字体颜色
        },
    });

    // 注册 PostgreSQL 自动补全
    monaco.languages.registerCompletionItemProvider("postgresql", {
        provideCompletionItems: (model, position) => {
            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn,
            };

            // 定义 PostgreSQL 关键字补全
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

            // 可以根据需要添加更多 PostgreSQL 语法元素的自动补全，
            // 例如函数、数据类型、表名、列名等。

            return {suggestions: suggestions};
        },
    });
}
