import GlobalErrorCodeConstants from "@main/framework/ErrorHandler/GlobalErrorCodeConstants";

export default class CommonResult<T> {

	public code: number
	public data: T
	public message: string

	constructor(code: number, data: T, message: string) {
		this.code = code;
		this.data = data;
		this.message = message;
	}

	static success<T>(data: T): CommonResult<T> {
		return new CommonResult<T>(GlobalErrorCodeConstants.SUCCESS().getCode(), data, "");
	}

	static error<T>(message: string, code?: number): CommonResult<T> {
		return new CommonResult<T>(code ? code : 400, null, message);
	}
}
