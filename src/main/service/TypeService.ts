import {Injectable} from "@main/framework/windowManager/decorators";
import fs, {ensureDirSync} from "fs-extra";
import {join} from "path";
import {GroupMenuOption} from "@render/components/GroupMenu/types";
import jsonfile from "jsonfile";

@Injectable()
export class TypeService {
    /**
     * 保存数据类型
     **/
    async saveDataTypeFile(filePath: string, vo: SaveDataTypeVO) {
        fs.writeJSONSync(filePath, vo, {spaces: 2});
    }

    /**
     * 获取数据类型
     **/
    getTypeData() {

    }

    async findDataTypeFile(folderPath: string, typeId: string) {
        ensureDirSync(folderPath);
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            const filePath = join(folderPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                // 递归处理子文件夹
                const children = await this.findDataTypeFile(filePath, typeId);
                if (children) {
                    return children;
                }
            } else if (stats.isFile() && file.endsWith('.json')) {
                // 使用 jsonfile 读取 JSON 文件内容
                try {
                    const fileContent = fs.readJSONSync(filePath);
                    if (fileContent.id === typeId) {
                        return fileContent;
                    }
                } catch (error) {
                    console.error(`读取 JSON 文件 ${filePath} 失败:`, error);
                }
            }

        }
    }

    async readTypeJsonFiles(folderPath: string): Promise<GroupMenuOption[]> {
        const result: GroupMenuOption[] = [];
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            const filePath = join(folderPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                // 递归处理子文件夹
                const children = await this.readTypeJsonFiles(filePath);
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
                    const fileContent: SaveDataTypeVO = await jsonfile.readFile(filePath);

                    // 将 JSON 文件内容转换为 GroupMenuOption 对象
                    const menuOption: GroupMenuOption = {
                        menuType: 'tree',
                        type: 'datatype',
                        label: fileContent.typeName,
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
}
