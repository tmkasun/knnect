/**
 * Created by tmkasun on 2/12/17.
 */
var services = require('./services');
function registerHandlers() {
    $(document).on('click', '#current-session', function (event) { /* TODO: change current-session id used in marker popup */
        var sp_service = new services.SpatialActivityService();
        var data = $(this).parents().siblings().closest('.marker-data').data();
        var promised_history = sp_service.getSessionPath(data.id);
        promised_history.then(
            (response, id = data.id) => {
                let status = response.status;
                let history_data = response.body;
                currentSpatialObjects[id].drawPath(history_data);
            }
        );
    });
    $('#history-modal').modal({
        ready: function () {
            var sp_service = new services.SpatialActivityService();
            var object_id = $("#object-control-panel").data().object_id;
            var history_dates = sp_service.getHistoryDates(object_id);
            history_dates.then(
                function (response) {
                    var data = JSON.parse(response.body);
                    data.forEach(function (element) {
                        var date = new Date(element._id);
                        date.setHours(0, 0, 0, 0);
                        var epoch_time = date.getTime();
                        $('.picker__day[data-pick="' + epoch_time + '"]').addClass("history-available");
                    });
                }
            );
        }
    }).on("click", ".modal-action", function (event) {
        event.preventDefault();
        var start_date = $("#start_date").val();
        // var end_date = $("#end_date").val();
        var object_id = $("#object-control-panel").data().object_id;
        var sp_service = new services.SpatialActivityService();
        var promised_history = sp_service.getHistory(object_id, start_date);
        /* TODO: need to get object ID */
        promised_history.then(
            function (response) {
                var object_id = $("#object-control-panel").data().object_id;
                var this_object = currentSpatialObjects[object_id];
                this_object.drawPath(response.body);
            }
        );
    });
}
module.exports.registerHandlers = registerHandlers;