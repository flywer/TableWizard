import {getCurrentInstance, onUnmounted, toRaw} from 'vue'

// @ts-ignore
const {ipcRenderer} = window

interface IpcInstance {
	send: <T = any>(target: string, ...args: any[]) => Promise<T>
	on: (event: string, callback: (...args: any[]) => void) => void
}

// 拦截响应
const interceptResponse = <T>(response: T): T => {
	if (response && (response as any).code !== 0) {
		// window.$message.error(`Code: ${(response as any).code}, Message: ${(response as any).message}`)
	}
	return response
}

export const ipcInstance: IpcInstance = {
	send: async <T = any>(target: { toString: () => string }, ...args: any[]) => {
		const payloads: any[] = args.map(e => toRaw(e))
		const response = await ipcRenderer.invoke(target.toString(), ...payloads)
		return interceptResponse(response)
	},
	on: (event, callback) => {
		ipcRenderer.on(event.toString(), (e, ...args) => {
			callback(...args)
		})

		// Use tryOnUnmounted if you use @vueuse https://vueuse.org/shared/tryOnUnmounted/
		if (getCurrentInstance()) {
			onUnmounted(() => {
				ipcRenderer.removeAllListeners(event.toString())
			})
		}
	},
}

export function useIpc() {
	return ipcInstance
}
