"use strict";

module.exports = {
    routes:[
        {
            method:"POST",
            path:"/auth/verifyOTP",
            handler:"custom.verifyOTP",
            config: {
                policies:[], 
            },
        },
        {
            method:"POST",
            path:"/auth/resendOtp",
            handler:"custom.resendOtp",
            config: {
                policies:[], 
            },
        },
    ]
}
