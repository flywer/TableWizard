import ErrorCode from "@main/framework/ErrorHandler/ErrorCode";

/**
 * 全局错误码常量
 **/
export const GlobalErrorCodeConstants = {
    SUCCESS: () => new ErrorCode(0, "成功")
}

export default GlobalErrorCodeConstants;
