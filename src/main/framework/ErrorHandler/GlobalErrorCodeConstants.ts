import ErrorCode from "@main/framework/ErrorHandler/ErrorCode";

/**
 * 全局错误码常量 通常为1000_0 下换线的后一位是错误级别，影响着什么情况下展示错误信息
 **/
export const GlobalErrorCodeConstants = {
	SUCCESS: () => new ErrorCode(0, "成功"),

	// ==============0-1000 通用错误码================


	// ==============1001-2000 应用级别相关错误码 ================

	// 未选择文件夹
	NOT_CHOOSE_FOLDER: () => new ErrorCode(1001_3, "未选择文件夹"),

	// ==============2001-3000 项目相关错误码 ================

}

export default GlobalErrorCodeConstants;
