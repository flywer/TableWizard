import {getCurrentInstance, onUnmounted, toRaw} from 'vue'
import CommonResult from "@common/CommonResult";
import {cloneDeep} from "lodash";
import {useAppNotificationStore} from "@render/stores/app/appNotification";

// @ts-ignore
const {ipcRenderer} = window

interface IpcInstance {
    send: <T = any>(target: string, ...args: any[]) => Promise<T>
    on: (event: string, callback: (...args: any[]) => void) => void
}

// 拦截响应
const interceptResponse = <T>(response: T): any => {
    //CommonResult 包装，主要是逐渐统一返回格式
    // 判断response是否有code、data、message属性，如果有则认为是CommonResult
    if (response && (response as any).code !== undefined && (response as any).data !== undefined && (response as any).message !== undefined) {
        const result = response as CommonResult<T>

        if (result.code !== 0) {
            // window.$message.error(result.message)
            useAppNotificationStore().addNotification({
                title: '请求错误',
                content: result.message,
                type: 'error',
            })
        }
        return result.data
    } else {
        return response
    }
}

export const ipcInstance: IpcInstance = {
    send: async <T = any>(target: { toString: () => string }, ...args: any[]) => {
        const payloads = cloneDeep(args.map(e => toRaw(e)));
        return new Promise((resolve, reject) => {
            ipcRenderer.invoke(target.toString(), ...payloads).then((response) => {
                resolve(interceptResponse(response))
            }).catch((e) => {
                // window.$message.error(e.message)
                useAppNotificationStore().addNotification({
                    title: '请求错误',
                    content: e.message,
                    type: 'error',
                })
            })
        })
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
