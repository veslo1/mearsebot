var tumblr = require('tumblr.js');
var utils = require('./utils.js');

var client = new tumblr.Client({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    token: process.env.TUMBLR_TOKEN,
    token_secret: process.env.TUMBLR_SECRET
});

client.userInfo(function (err, data) {
    data.user.blogs.forEach(function (blog) {
        console.log(blog.name);
    });
});

module.exports = {
    nipslip: function nipSlip(cb){
        client.posts('thenippleslipblog', function (err, resp) {
            if(err) {
                console.log(err);
                return cb(err, null);
            } else {


                var post = utils.randomPicker(resp.posts);
                //console.log(post);
                if(post.photos.length){
                    //console.log(post.photos[0]);
                    var photo = post
                        .photos[0]
                        .original_size
                        .url;
                    return cb(null, photo);
                } else {
                    return cb('no photo', null);
                }



            }

        });
    }

};