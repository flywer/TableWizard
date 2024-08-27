// 各种数据库方言的默认handlebars模板
export const DialectDefaultTemplates: DialectTemplate[] = [
	{
		dialect: 'MySQL',
		templates: [
			{
				label: '创建表',
				type: 'createTable',
				template: `DROP TABLE IF EXISTS {{toUpperCase tableName}};
CREATE TABLE {{toUpperCase tableName}} (
{{#each fields}}
{{space 3}}{{#trim}}{{#newlineToSpace}}
  {{toUpperCase (underline fieldName)}}
  {{toUpperCase type}}{{#if length}}({{length}}){{/if}}
  {{#if notNull}}NOT NULL{{/if}}
  {{#if autoIncrement}}AUTO_INCREMENT{{/if}}
  {{#if primaryKey}}PRIMARY KEY{{/if}}
  {{#if defaultValue}}
    {{#if (eq type "varchar")}}DEFAULT '{{defaultValue}}'{{/if}}
    {{#unless (eq type "varchar")}}DEFAULT {{defaultValue}}{{/unless}}
  {{/if}}
  {{#if fieldComment}} COMMENT '{{fieldComment}}'{{/if}}{{#unless @last}},{{/unless}}
  {{/newlineToSpace}}{{/trim}}
{{/each}}
) {{#if tableComment}}COMMENT = '{{tableComment}}'{{/if}};`
			}
		]
	},
	{
		dialect: 'PostgreSQL',
		templates: [
			{
				label: '创建表',
				type: 'createTable',
				template: `DROP TABLE IF EXISTS {{toUpperCase tableName}};
CREATE TABLE {{toUpperCase tableName}} (
{{#each fields}}
  {{space 3}}{{#trim}}{{#newlineToSpace}}
    {{toUpperCase (underline fieldName)}}
    {{toUpperCase type}}{{#if length}}({{length}}){{/if}}
    {{#if notNull}}NOT NULL{{/if}}
    {{#if primaryKey}}PRIMARY KEY{{/if}}
    {{#if autoIncrement}}SERIAL{{/if}}
    {{#if defaultValue}}
      {{#if (eq type "varchar")}}DEFAULT '{{defaultValue}}'{{/if}}
      {{#unless (eq type "varchar")}}DEFAULT{{defaultValue}}{{/unless}}
    {{/if}}
    {{#unless @last}},{{/unless}}
  {{/newlineToSpace}}{{/trim}}
  {{/each}}
);

{{#if tableComment}}
COMMENT ON TABLE {{toUpperCase tableName}} IS '{{tableComment}}';
{{/if}}
{{#each fields}}{{#if fieldComment}}{{#if fieldComment}}COMMENT ON COLUMN {{toUpperCase ../tableName}}.{{toUpperCase (underline fieldName)}} IS '{{fieldComment}}';
{{/if}}{{/if}}{{/each}}`
			}
		]
	}
]

export default DialectDefaultTemplates
