// hears.js
// all the things mearsebot can hear

var utils = require('../lib/utils.js');
var http = require('http');
var math = require('mathjs');

// all the hears go here
function hears(controller){

    //console.log(controller.hears());

    controller.hears(['\\d(.*)\\d'],'direct_message,direct_mention,mention',function(bot, message) {

        //var response = utils.randomPicker(['I\'m all set, thanks. :grin:', 'You go ahead with out me, pal :grin:', 'nah.', '...um.  not really']);
        bot.reply(message, ':thinking_face: thinking mathy thoughts...');

    });

    controller.hears(['that shit?'],'direct_message,direct_mention,mention',function(bot, message) {

        var response = utils.randomPicker(['Man, Fuck dat shit! :grin:']);
        bot.reply(message, response);

    });
}

module.exports =  hears;