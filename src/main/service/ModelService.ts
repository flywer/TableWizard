import {Injectable} from "@main/framework/windowManager/decorators";
import {GroupMenuOption} from "@render/components/GroupMenu/types";
import {join} from "path";
import jsonfile from "jsonfile";
import fs from "fs-extra";

@Injectable()
export class ModelService {

    /**
     * 读取 JSON 文件并构建 GroupMenuOption 结构
     **/
    async readModelJsonFiles(folderPath: string): Promise<GroupMenuOption[]> {
        const result: GroupMenuOption[] = [];
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            const filePath = join(folderPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                // 递归处理子文件夹
                const children = await this.readModelJsonFiles(filePath);
                result.push({
                    menuType: 'tree',
                    type: 'folder',
                    label: file,
                    key: filePath,
                    children,
                });
            } else if (stats.isFile() && file.endsWith('.json')) {
                // 使用 jsonfile 读取 JSON 文件内容
                try {
                    const fileContent = await jsonfile.readFile(filePath);

                    // 将 JSON 文件内容转换为 GroupMenuOption 对象
                    const menuOption: GroupMenuOption = {
                        menuType: 'tree',
                        type: 'datatable',
                        label: fileContent.tableName,
                        key: fileContent.id
                    };
                    result.push(menuOption);
                } catch (error) {
                    console.error(`读取 JSON 文件 ${filePath} 失败:`, error);
                }
            }
        }

        return result;
    }

    /**
     * 递归查找指定 datatableId 的 JSON 文件
     **/
    async findDatatableIdFile(folderPath: string, datatableId: string): Promise<any | null> {
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            const filePath = join(folderPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                // 递归查找子文件夹
                const result = await this.findDatatableIdFile(filePath, datatableId);
                if (result) {
                    return result;
                }
            } else if (
                stats.isFile() &&
                file === `${datatableId}.json`
            ) {
                // 找到文件，读取并返回 JSON 数据
                try {
                    return await jsonfile.readFile(filePath);
                } catch (error) {
                    console.error(`读取文件 ${filePath} 失败:`, error);
                    return null;
                }
            }
        }

        // 未找到文件
        return null;
    }
}
