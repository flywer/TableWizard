import * as fs from "fs";
import {promisify} from "util";
import path, {join} from "path";

export class FsUtils {

    /**
     * 计算文件路径下文件大小
     **/
    public static calculateSize = async (dirPath: string, callback: (error: any, size: number) => void) => {

        // 使用promisify方法来promise化指定方法
        const stat = promisify(fs.stat)
        const readdir = promisify(fs.readdir)

        let fileSize = 0;
        let error = null

        async function calc(dirPath: string) {
            try {
                const statObj = await stat(dirPath)
                if (statObj.isDirectory()) {
                    const files = await readdir(dirPath)
                    let dirs = files.map(item => {
                        return path.join(dirPath, item)
                    })
                    let index = 0

                    async function next() {
                        if (index < dirs.length) {
                            let current = dirs[index++]
                            await calc(current)
                            await next()
                        }
                    }

                    return await next()
                } else {
                    fileSize += statObj.size
                }
            } catch (err) {
                error = err
            }
        }

        await calc(dirPath)
        callback(error, fileSize)
    }

    /**
     * 字节格式转换
     **/
    public static formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024; // 或者使用 1000，这取决于你希望以1000为基数还是1024为基数
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * 是否是空文件夹
     **/
    public static isEmptyDir = (dirPath: string) => {
        const files = fs.readdirSync(dirPath)
        return files.length === 0
    }

    /**
     * 文件夹是否存在，不存在则创建
     **/
    public static fileOrFolderExists = async (path: string): Promise<boolean> => {
        try {
            await fs.promises.access(path);
            return true; // 文件或文件夹存在
        } catch (error) {
            return false; // 文件或文件夹不存在
        }
    }

    /**
     * 递归查找指定文件夹路径下的文件夹
     **/
    public static async findFolderPathByName(searchPath: string, targetName: string): Promise<string | null> {
        const files = fs.readdirSync(searchPath);

        for (const file of files) {
            const filePath = join(searchPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                // 检查文件夹名是否匹配
                if (file === targetName) {
                    return filePath; // 找到匹配的文件夹，返回绝对路径
                }

                // 递归查找子文件夹
                const result = await this.findFolderPathByName(filePath, targetName);
                if (result) {
                    return result;
                }
            }
        }

        // 未找到
        return null;
    }
}
