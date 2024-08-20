import {languages, Thenable} from "monaco-editor";
import IMonarchLanguage = languages.IMonarchLanguage;

export const monarchDefinition : IMonarchLanguage | Thenable<IMonarchLanguage> = {

    base: "sql",
    tokenPostfix: ".sql",

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
        "UNION", "INTERSECT", "EXCEPT"
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
            [/[a-z_$][\w$]*/, {
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
