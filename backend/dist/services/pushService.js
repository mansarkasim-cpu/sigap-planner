"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushNotify = void 0;
async function pushNotify(userId, message) {
    // stub: integrate FCM/APNs or push gateway
    console.log(`pushNotify -> user:${userId} msg:${message}`);
}
exports.pushNotify = pushNotify;
