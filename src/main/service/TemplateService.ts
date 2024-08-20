import {Injectable} from "@main/framework/windowManager/decorators";
import {join} from "node:path";
import fs from "fs-extra";

@Injectable()
export class TemplateService {

    async getTemplates(folderPath: string) {
        const result: DialectTemplate[] = [];
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            const filePath = join(folderPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile() && file.endsWith('.handlebars')) {
                const fileContent = fs.readFileSync(filePath);

                const item = {
                    dialect: file.split('.')[0],
                    template: fileContent.toString()
                }
                result.push(item);
            }
        }
        return result;
    }

}
