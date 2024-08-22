import {Injectable} from "@main/framework/windowManager/decorators";
import {join} from "node:path";
import fs from "fs-extra";
import DialectDefaultTemplates from "@common/constants/templates/DialectDefaultTemplates";

@Injectable()
export class TemplateService {

	/**
	 * 确保默认模板存在
	 **/
	ensureDefaultTemplates(folderPath: string) {
		fs.ensureDirSync(folderPath);
		for (const dialectTemplate of DialectDefaultTemplates) {
			dialectTemplate.templates.forEach(template => {
				this.ensureTemplateExists(folderPath, dialectTemplate.dialect, template.type);
			})
		}
	}

	/**
	 * 确保此方言的其模板项存在
	 **/
	ensureTemplateExists(folderPath: string, dialect: string, templateType: string) {
		const filePath = join(folderPath, `${dialect}.json`);
		// 1.判断文件是否存在
		if (!fs.existsSync(filePath)) {
			// 不存在则创建
			// 判断此方言是否存在默认模板中
			const dialectTemplate = DialectDefaultTemplates.find(item => item.dialect.toLowerCase() === dialect.toLowerCase())
			if (dialectTemplate) {
				// 存在则创建
				fs.writeJSONSync(filePath, dialectTemplate.templates);
			} else {
				// 不存在则创建空模板
				fs.writeJSONSync(filePath, [{label: templateType, type: templateType, template: ''}]);
			}
		} else {
			// 文件存在，判断模板是否存在
			const dialectTemplate: DialectTemplateItemType[] = fs.readJSONSync(filePath);
			const template = dialectTemplate.find(item => item.type === templateType);
			if (!template) {
				// 模板不存在则创建
				const defaultTemplate = DialectDefaultTemplates.find(item => item.dialect.toLowerCase() === dialect.toLowerCase());
				if (defaultTemplate) {
					// 判断默认模板是否存在
					const defaultTemplateItem = defaultTemplate.templates.find(item => item.type === templateType);
					if (defaultTemplateItem) {
						dialectTemplate.push(defaultTemplateItem);
						fs.writeJSONSync(filePath, dialectTemplate);
					}
				} else {
					// 不存在此方言的此模板的默认模板
					// 则创建空模板
					dialectTemplate.push({label: templateType, type: templateType, template: ''});
				}
			}
		}
	}

	getTemplate(folderPath: string, dialect: string, templateType: string) {
		this.ensureTemplateExists(folderPath, dialect, templateType);
		const filePath = join(folderPath, `${dialect}.json`);
		const dialectTemplate: DialectTemplateItemType[] = fs.readJSONSync(filePath);
		return dialectTemplate.find(item => item.type === templateType)?.template;
	}

	getTemplates(folderPath: string) {
		this.ensureDefaultTemplates(folderPath)
		const templates: DialectTemplate[] = [];
		const files = fs.readdirSync(folderPath);
		for (const file of files) {
			const filePath = join(folderPath, file);
			const stats = fs.statSync(filePath);
			if (stats.isFile() && file.endsWith('.json')) {
				const fileContent: DialectTemplateItemType[] = fs.readJSONSync(filePath);
				const dialectTemplate: DialectTemplate = {
					dialect: file.split('.')[0],
					templates: fileContent
				}
				templates.push(dialectTemplate);
			}
		}
		return templates;
	}

}
