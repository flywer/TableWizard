/**
 * 错误码
 **/
export default class ErrorCode {

	/**
	 * 错误码
	 */
	private code: number

	/**
	 * 错误提示
	 */
	private msg: string

	constructor(code: number, message: string) {
		this.code = code;
		this.msg = message;
	}

	/**
	 * 获取错误码
	 */
	public getCode(): number {
		return this.code;
	}

	/**
	 * 获取错误提示
	 */
	public getMessage(): string {
		return this.msg;
	}
}
