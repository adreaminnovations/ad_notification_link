/** @odoo-module **/

import { OutOfFocusService, outOfFocusService } from "@mail/core/common/out_of_focus_service";
import { notificationService } from "@web/core/notifications/notification_service";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";

patch(notificationService, {
    start(env, services) {
        const result = super.start(...arguments);
        const originalAdd = result.add;
        result.add = (message, options = {}) => {
            if (options.res_model && options.res_id && !options.buttons) {
                options.buttons = [{
                    name: _t("View Record"),
                    icon: "fa-external-link",
                    primary: true,
                    onClick: () => {
                        env.services.action.doAction({
                            type: "ir.actions.act_window",
                            res_model: options.res_model,
                            res_id: options.res_id,
                            views: [[false, "form"]],
                            target: "current",
                        });
                    },
                }];
            }
            return originalAdd.call(result, message, options);
        };
        return result;
    }
});


patch(OutOfFocusService.prototype, {
    /**
     * @override
     */
    async notify(message, thread) {
        this._lastThreadInfo = thread || message.thread;
        return super.notify(...arguments);
    },

    /**
     * @override
     */
    sendOdooNotification(message, options) {
        const thread = this._lastThreadInfo;
        if (thread && thread.model && thread.id && thread.model !== 'discuss.channel') {
            options.res_model = thread.model;
            options.res_id = thread.id;
        }
        return super.sendOdooNotification(message, options);
    },

    /**
     * @override
     */
    sendNativeNotification(title, message, icon, { sound = true } = {}) {
        const thread = this._lastThreadInfo;
        const notification = new Notification(title, {
            body: message,
            icon,
        });
        notification.addEventListener("click", ({ target: notification }) => {
            window.focus();
            notification.close();
            if (thread && thread.model && thread.id && thread.model !== 'discuss.channel') {
                this.env.services.action.doAction({
                    type: "ir.actions.act_window",
                    res_model: thread.model,
                    res_id: thread.id,
                    views: [[false, "form"]],
                    target: "current",
                });
            }
        });
        if (sound) {
            this._playSound();
        }
    }
});

