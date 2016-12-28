var ApplicationOptions = {
    colors: {
        states: {
            NORMAL: 'blue',
            WARNING: 'orange',
            OFFLINE: 'grey',
            ALERTED: 'red',
            UNKNOWN: 'black' // TODO: previous color #19FFFF , change this if black is not user friendly ;)
        },
        application: {
            header: 'grey'
        }
    },
    constance:{
        WEB_SOCKET_URL: "ws://geo.knnect.com:9080/ws/data",
        WEB_SOCKET_SERVER: 'aws4.knnect.com', /*TODO: Deprecated */
        WEB_SOCKET_PORT: 9764, /*TODO: Deprecated */
        CEP_WEB_SOCKET_OUTPUT_ADAPTOR_NAME: 'DefaultWebsocketOutputAdaptor', /*TODO: Deprecated */
        CEP_WEB_SOCKET_BUILDER_TOPIC: 'geoDataEndPoint', /*TODO: Deprecated */

        /* Django Static Url */
        STATIC_URL: '/static/',

        SPEED_HISTORY_COUNT: 20,
        NOTIFY_INFO_TIMEOUT: 3000,
        NOTIFY_SUCCESS_TIMEOUT: 4000,
        NOTIFY_WARNING_TIMEOUT: 3000,
        NOTIFY_DANGER_TIMEOUT: 9000
    },
    messages:{
        app:{

        }
    },
    leaflet: {
        iconUrls: {
            normalIcon: '/static/map_system/images/markers/arrow_normal.png',
            alertedIcon: '/static/map_system/images/markers/arrow_alerted.png',
            offlineIcon: '/static/map_system/images/markers/arrow_offline.png',
            warningIcon: '/static/map_system/images/markers/arrow_warning.png',
            defaultIcon: '/static/map_system/images/markers/car/red-top.png',
            resizeIcon: '/static/map_system/images/markers/resize.png'

        }
    },
    locale: {
        type: 'sin',
        sin: {
            websocket:{
                errors:{
                    'connection': 'වෙබ් සොකට් සම්බන්ධතාවය විසන්ඳිවී ඇත කරුණාකර ඔබගේ අන්තර්ජාල සබදතාවය පරීක්ශාකර බලන්න  '
                }
            }
        },
        eng: {
            websockt: {
                errors:{
                    'connection': 'Something went wrong when trying to connect to WebSocket </br> <b>Please check your internet or Network connection<b/>'
                }
            }

        }
    }
};