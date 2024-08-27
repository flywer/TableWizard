import Handlebars from "handlebars";

export const handlebarsRegisterDefaultHelper = () => {

    /**
     * 获取函数的文本内容
     * @param fun 函数本体
     * @param funArgs 函数参数
     **/
    const getText = (fun: any, funArgs: IArguments) => {
        const args = Array.from(funArgs).slice(0, -1);
        const options = funArgs[funArgs.length - 1];
        if (options.fn) {
            // 块级使用
            return options.fn(fun).toString();
        } else {
            // 内联使用
            if (args.length > 0) {
                return args[0];
            } else {
                return '';
            }
        }
    }

    // 注册 Handlebars 默认 helper
    // 判断是否相等
    Handlebars.registerHelper('eq', function (arg1, arg2) {
        return (arg1 === arg2);
    });

    // 将字符串中的换行符替换为空格
    Handlebars.registerHelper('newlineToSpace', function () {
        let text = getText(this, arguments);
        return text.replace(/\n/g, ' ').replace(/\r/g, '').replace(/\t/g, '').replace(/\s{2,}/g, ' ');
    });

    // 驼峰法转下划线写法
    Handlebars.registerHelper('underline', function () {
        let text = getText(this, arguments);

        // 将下划线和首字母后的字符转换为大写
        const camelCase = text.replace(/_([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });

        // 将大写字母前添加短横线
        return camelCase.replace(/([A-Z])/g, function (g) {
            return '_' + g[0].toLowerCase();
        });
    });

    // 下划线写法转驼峰法
    Handlebars.registerHelper('camel', function () {
        let text = getText(this, arguments);
        return text.replace(/_([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });
    })

    // 字符串大写
    Handlebars.registerHelper('toUpperCase', function () {
        let text = getText(this, arguments);
        return text.toUpperCase();
    })

    // 字符串小写
    Handlebars.registerHelper('toLowerCase', function () {
        let text = getText(this, arguments);
        return text.toLowerCase();
    })

    // 字符串左右去空格
    Handlebars.registerHelper('trim', function () {
        let text = getText(this, arguments);
        return text.trim();
    })

    // 生成空格
    Handlebars.registerHelper('space', function (count) {
        //  判断 count 是否为数字类型
        if (typeof count !== 'number') {
            //  如果不是数字类型， 则将 count 设置为默认值 0
            count = 1;
        }

        //  创建指定数量的空格字符串
        return new Array(count).join(' ');
    });
}
