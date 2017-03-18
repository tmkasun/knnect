/**
 * Created by tmkasun on 2/12/17.
 */
var services = require('./services');
function registerHandlers() {
    $(document).on('click', '#current-session', function (event) {
        var sp_service = new services.SpatialActivityService();
        var data = $(this).parents().siblings().closest('.marker-data').data();
        var promised_history = sp_service.getHistory(data.id);
        promised_history.then(
            (response, id = data.id) => {
                let status = response.status;
                let history_data = response.body;
                currentSpatialObjects[id].drawPath(history_data);
            }
        );
    });
}
module.exports.registerHandlers = registerHandlers;