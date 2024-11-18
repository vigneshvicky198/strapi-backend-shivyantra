"use strict";

module.exports = {
    routes:[
        {
            method:"POST",
            path:"/product/:paymentId/payment",
            handler:"custom.payment",
            config: {
                policies:[], 
            },
        },
        {
            method:"POST",
            path:"/get/delivery/:state/:userId",
            handler:"custom.calculateDeliveryCharge",
            config: {
                policies:[], 
            },
        },
    ]
}
