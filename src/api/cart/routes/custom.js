"use strict";

module.exports = {
    routes:[
        {
            method:"POST",
            path:"/remove/carts",
            handler:"custom.removeCartItem",
            config: {
                policies:[], 
            },
        },
        {
            method:"POST",
            path:"/clear/carts",
            handler:"custom.clearTotalCart",
            config: {
                policies:[], 
            },
        },
        {
            method:"POST",
            path:"/delete/carts",
            handler:"custom.clearOneCart",
            config: {
                policies:[], 
            },
        },
    ]
}
