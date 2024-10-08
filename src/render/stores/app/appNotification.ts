import {defineStore} from "pinia";
import {AppNotification} from "@main/entity/app/AppNotification";
import {AppNotificationApi} from "@render/api/app/AppNotificationApi";

export const useAppNotificationStore = defineStore({
    id: 'appNotification',
    state: () => ({
        notificationList: [] as AppNotification[]
    }),
    actions: {
        async notificationListInit() {
            this.notificationList = await AppNotificationApi.getNotifications()
        },
        async readNotification(id: number) {
            await AppNotificationApi.readNotification(id)
            await this.notificationListInit()
        },
        async readAllNotifications() {
            await AppNotificationApi.readAllNotifications()
            await this.notificationListInit()
        },
        async clearAllNotifications() {
            await AppNotificationApi.clearAllNotifications()
            await this.notificationListInit()
        },
        async addNotification(notificationModel: {
            title: string,
            content: string,
            type: "default" | "info" | "success" | "warning" | "error",
            key?: string,
            duration?: number
        }) {
            const notification = new AppNotification()
            notification.title = notificationModel.title
            notification.content = notificationModel.content
            notification.type = notificationModel.type
            notification.key = notificationModel?.key || null
            notification.releaseTime = new Date()

            const result = await AppNotificationApi.addNotification(notification)

            if (result) {
                window.$notification.create({
                    duration: notificationModel?.duration || 3000,
                    title: notificationModel.title,
                    content: notificationModel.content,
                    type: notificationModel.type,
                    onClose: () => {
                        this.readNotification(result.raw)
                    }
                });
                await this.notificationListInit()
            }
        }
    }
})
