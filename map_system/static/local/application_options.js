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
        WEB_SOCKET_SERVER: 'aws4.knnect.com',
        WEB_SOCKET_PORT: 9764,
        CEP_WEB_SOCKET_OUTPUT_ADAPTOR_NAME: 'DefaultWebsocketOutputAdaptor',
        CEP_WEB_SOCKET_BUILDER_TOPIC: 'geoDataEndPoint',

        /* Django Static Url */
        STATIC_URL: '/static/',

        SPEED_HISTORY_COUNT: 20,
        NOTIFY_INFO_TIMEOUT: 1000,
        NOTIFY_SUCCESS_TIMEOUT: 1000,
        NOTIFY_WARNING_TIMEOUT: 3000,
        NOTIFY_DANGER_TIMEOUT: 5000
    },
    messages:{
        app:{

        }
    },
    leaflet: {
        iconUrls: {
            normalIcon: '/static/images/markers/arrow_normal.png',
            alertedIcon: '/static/images/markers/arrow_alerted.png',
            offlineIcon: '/static/images/markers/arrow_offline.png',
            warningIcon: '/static/images/markers/arrow_warning.png',
            defaultIcon: '/static/images/markers/default_icons/marker-icon.png',
            resizeIcon: '/static/images/markers/resize.png'

        }
    }
};