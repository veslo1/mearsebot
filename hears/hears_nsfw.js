// hears.js
// all the things mearsebot can hear

var utils = require('../lib/utils.js');
var tumblrWrapper = require('../lib/tumblrWrapper');
var Personas = require('../personas');
var http = require('http');

// init personas
var Persona = new Personas({});
Persona.init(function(err){
    if (err) throw err;
    console.log('Personas initialized', Persona.getPersonas());
});

// all the hears go here
function hears(controller){

    controller.hears(['nipslip'], 'ambient,direct_message,direct_mention,mention', function(bot, message){

        tumblrWrapper.nipslip(function(err, photo){
            if(err) {
                console.log('err', err);
                bot.reply(message, 'whoops!');
            } else {
                console.log('data',  photo);
                bot.reply(message, photo + ' whoops!');
            }
        });

    });

    controller.hears(['how large and hairless is kenny\'s scrotum'], 'ambient,direct_message,direct_mention,mention', function(bot, message){
        bot.reply(message, 'UUUUUuugge!' + 'https://www.youtube.com/watch?v=3I8VQYgR8Kk' )
    });

    controller.hears(['boobies'],'direct_message,direct_mention,mention',function(bot, message) {

        controller.storage.users.get(message.user,function(err, user) {
            if (user && user.name) {
                bot.reply(message,'http://49.media.tumblr.com/5c65a542b9af21ad65a30a11c9ea40db/tumblr_o237guI7Pm1qbs5lqo1_500.gif');
            } else {
                bot.reply(message,'http://49.media.tumblr.com/5c65a542b9af21ad65a30a11c9ea40db/tumblr_o237guI7Pm1qbs5lqo1_500.gif');
            }
        });
    });

}

module.exports =  hears;