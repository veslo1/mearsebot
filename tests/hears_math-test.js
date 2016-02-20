// hears.js
// all the things mearsebot can hear

var sinon = require('sinon');
var assert = require('assert');

describe('hears math test', function(){

    var hearsMath = require('../hears/hears_math');

    var EventEmitter = require('events').EventEmitter;
    var util = require('util');

    var callback = function(bot, message){
        console.log('callback')
    };

    function MockController(){
        // Super constructor
        EventEmitter.call( this );
        return( this );
    }

    util.inherits(MockController, EventEmitter);

    var mockController = new MockController();


    it('should hear a natural math expression', function(){

        var bot = {
            reply: function(message, reply){
                console.log('bot reply', reply);
                assert(bot.reply.calledOnce);
            }
        };

        var test = '5 x 5';

        sinon.spy(bot, 'reply');

        mockController.hears = function(keywords, events, callback){

            if (typeof(keywords) == 'string') {
                keywords = [keywords];
            }
            if (typeof(events) == 'string') {
                events = events.split(/\,/g);
            }

            var match;
            for (var k = 0; k < keywords.length; k++) {
                var keyword = keywords[k];
                for (var e = 0; e < events.length; e++) {
                    (function(keyword) {
                        mockController.on(events[e], function(bot, message) {
                            if (message.text) {
                                if (match = message.text.match(new RegExp(keyword, 'i'))) {
                                    console.log('I HEARD ', keyword);
                                    message.match = match;
                                    cb.apply(this, [bot, message]);
                                    return false;
                                }
                            }
                        });
                    })(keyword);
                }
            }


        };

        hearsMath(mockController);

    });

});

//controller.hears(['\d(.*)\d'],'direct_message,direct_mention,mention',function(bot, message) {
//
//    //var response = utils.randomPicker(['I\'m all set, thanks. :grin:', 'You go ahead with out me, pal :grin:', 'nah.', '...um.  not really']);
//    bot.reply(message, ':thinking_face: thinking mathy thoughts...');
//
//});