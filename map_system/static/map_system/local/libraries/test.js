var services = require('./services');

function testStates() {
    var states = new services.LKStates();
    var all = states.getAll();
    all.then(data => {
        console.log(data.body);
    });
}

function sessionPathTest() {
    var spatial_obj = new services.SpatialActivityService();
    var response = spatial_obj.getSessionPath('868443028828427', 10);
    response.then(d => {
        console.log(d.body);
    });
}

testStates();
sessionPathTest();