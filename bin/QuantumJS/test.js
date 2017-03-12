/**
 * Created by mkrooted on 3/8/2017.
 */

require("./../network_manager")(function (err, data) {
    if(err)throw err;
    console.log(require('util').inspect(data, {depth: null}));
});