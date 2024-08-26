import Handlebars from "handlebars";

export const handlebarsRegisterDefaultHelper = () => {
	// 注册 Handlebars 默认 helper

	// 判断是否相等
	Handlebars.registerHelper('eq', function (arg1, arg2) {
		return (arg1 === arg2);
	});

	// 字段类型格式化
	Handlebars.registerHelper('typeFormat', function (type, toUpperCase) {
		if (!type) {
			return ''
		}

		let formattedType = type;

		// 如果 toUpperCase 为 true，则将类型转换为大写
		if (toUpperCase) {
			formattedType = formattedType.toUpperCase();
		}

		return formattedType;
	});

	// 字段长度格式化
	Handlebars.registerHelper('lengthFormat', function (length) {
		if (length) {
			return `(${length})`;
		}
		return '';
	});

	// 字段默认值格式化
	Handlebars.registerHelper('underline', function (fieldName, toUpperCase) {
		// 将下划线和首字母后的字符转换为大写
		const camelCase = fieldName.replace(/_([a-z])/g, function (g) {
			return g[1].toUpperCase();
		});

		// 将大写字母前添加短横线
		const camelBar = camelCase.replace(/([A-Z])/g, function (g) {
			return '_' + g[0].toLowerCase();
		});

		if (toUpperCase) {
			return camelBar.toUpperCase();
		} else {
			return camelBar;
		}
	});

	// 判断是否不相等
	Handlebars.registerHelper('isValid', function (value) {
		return value && value != '';
	});

	// 去除字符串多余空格
	Handlebars.registerHelper('removeExtraSpaces', function (text, options) {
		// 如果是块级调用
		if (options && options.fn) {
			// 处理块级内容，去除多余空格
			let content = options.fn(this);
			// 将 SafeString 转换为字符串
			content = content.toString();
			return content.replace(/\s{2,}/g, ' ').trim();
		} else {
			// 否则作为内联函数处理
			return text.replace(/\s{2,}/g, ' ').trim();
		}
	});

}
