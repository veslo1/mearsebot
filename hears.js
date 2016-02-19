// hears.js
// all the things mearsebot can hear

var utils = require('./lib/utils.js');
var tumblrWrapper = require('./tumblrWrapper');
var http = require('http');
var Personas = require('./Personas');

// init personas
var Persona = new Personas({});
Persona.init(function(err){
    if (err) throw err;
    console.log('Personas initialized', Persona.getPersonas());
});

// all the hears go here
function hears(controller){
    controller.hears(['what do you think (about|of) (.*)(\\?|$)'], 'ambient,direct_message,direct_mention,mention', function(bot, message){
        var matches = message.text.match(/what do you think (about|of) (.*)(\\?$|$)/i);
        var noun = matches[2];
        console.log(matches);
        var adjective = '';
        if(/(.*)s$/.test(noun)){
            adjective = utils.randomPicker(['blow', 'rock', 'are so so' , 'rule', 'oh!, sat dudge!', 'are great']);
        } else {
            adjective = utils.randomPicker(['blows', 'rocks', 'is so so' , 'rules', 'oh!, sat dudge!', 'is great']);
        }
        bot.reply(message, noun + ' ' + adjective);
    });

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

    controller.hears(['highly'], 'ambient,direct_message,direct_mention,mention', function(bot, message){
        bot.reply(message, 'HIGHLY intelligent!');
    });

    controller.hears(['you suck mearsebot', 'why do you suck so much mearsebot'], 'ambient,direct_message,direct_mention,mention', function(bot, message){
        bot.reply(message, 'always dissin me...');
    });

    controller.hears(['hey mearsebot'], 'ambient,direct_message,direct_mention,mention', function(bot, message){
        var noun = utils.randomPicker(['sucka', 'fool', 'player', 'pimp', 'amigo']);
        bot.reply(message, 'wassup ' + noun);
    });

    controller.hears(['are you amir\'s first born'],'direct_message,direct_mention,mention',function(bot, message) {

        bot.api.reactions.add({
            timestamp: message.ts,
            channel: message.channel,
            name: 'robot_face',
        },function(err, res) {
            if (err) {
                bot.botkit.log('Failed to add emoji reaction :(',err);
            }
        });

        bot.reply(message,'I dunno.');
    });

    controller.hears(['hello','hi$'],'direct_message,direct_mention,mention',function(bot, message) {

        bot.api.reactions.add({
            timestamp: message.ts,
            channel: message.channel,
            name: 'robot_face',
        },function(err, res) {
            if (err) {
                bot.botkit.log('Failed to add emoji reaction :(',err);
            }
        });


        controller.storage.users.get(message.user,function(err, user) {
            if (user && user.name) {
                bot.reply(message,'Hello ' + user.name + '!!');
            } else {
                bot.reply(message,'Hello.');
            }
        });
    });

    controller.hears(['call me (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
        var matches = message.text.match(/call me (.*)/i);
        var name = matches[1];
        controller.storage.users.get(message.user,function(err, user) {
            if (!user) {
                user = {
                    id: message.user,
                };
            }
            user.name = name;
            controller.storage.users.save(user,function(err, id) {
                bot.reply(message,'Got it. I will call you ' + user.name + ' from now on.');
            });
        });
    });

    controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot, message) {

        controller.storage.users.get(message.user,function(err, user) {
            if (user && user.name) {
                bot.reply(message,'Your name is ' + user.name);
            } else {
                bot.reply(message,'I don\'t know yet!');
            }
        });
    });

    controller.hears(['a hippie'],'direct_message,direct_mention,mention',function(bot, message) {

        controller.storage.users.get(message.user,function(err, user) {
            if (user && user.name) {
                bot.reply(message,'Yes, an angry one ' + user.name);
            } else {
                bot.reply(message,'Very much so.');
            }
        });
    });

    controller.hears(['do you agree'],'direct_message,direct_mention,mention',function(bot, message) {

        controller.storage.users.get(message.user,function(err, user) {
            if (user && user.name) {
                bot.reply(message,'Yes ' + user.name);
            } else {
                bot.reply(message,'Yep.');
            }
        });
    });

    controller.hears(['do you like the nationals'],'direct_message,direct_mention,mention',function(bot, message) {

        controller.storage.users.get(message.user,function(err, user) {
            if (user && user.name) {
                bot.reply(message,'No, ' + user.name + ' but this guy does. ' + 'http://farm5.static.flickr.com/4077/4771789326_04b71c12f4_m.jpg');
            } else {
                bot.reply(message,'Yep.' + 'But not as much as this guy. ' + 'http://farm5.static.flickr.com/4077/4771789326_04b71c12f4_m.jpg');
            }
        });
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

    controller.hears(['what is a mearse'],'direct_message,direct_mention,mention',function(bot, message) {

        controller.storage.users.get(message.user,function(err, user) {
            if (user && user.name) {
                bot.reply(message,'A mearse is when you pee a little bit when laughing, ' + user.name);
            } else {
                bot.reply(message,'A mearse is when you pee a little bit when laughing.');
            }
        });
    });

    controller.hears(['shutdown'],'direct_message,direct_mention,mention',function(bot, message) {

        bot.startConversation(message,function(err, convo) {

            convo.ask('Are you sure you want me to shutdown?',[
                {
                    pattern: bot.utterances.yes,
                    callback: function(response, convo) {
                        convo.say('Bye!');
                        convo.next();
                        setTimeout(function() {
                            process.exit();
                        },3000);
                    }
                },
                {
                    pattern: bot.utterances.no,
                    default: true,
                    callback: function(response, convo) {
                        convo.say('*Phew!*');
                        convo.next();
                    }
                }
            ]);
        });
    });

    controller.hears(['uptime','identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {

        var hostname = os.hostname();
        var uptime = utils.formatUptime(process.uptime());

        bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');

    });

    controller.hears(['starwars (.*)'],'direct_message,direct_mention',function(bot,message) {

        var searchTerm = message.text.match(/starwars (.*)/i)[1];

        http.get('http://starwars.wikia.com/api/v1/Search/List?query='+ searchTerm +'&limit=1&minArticleQuality=10&batch=1&namespaces=0%2C14', function(res) {
            if (res.statusCode !== 200) {
                bot.reply(message, "Sorry, couldn't find anything about that. :confused:");
            } else {
                var body = "";
                res.on('data', function(chunk) {
                    body += chunk;
                });
                res.on('end',function() {
                    var firstResult = JSON.parse(body).items[0];
                    if (firstResult !== null) {
                        if (firstResult.quality > 75) {
                            bot.reply(message, "Got it! :grin:\r\n" + firstResult.url);
                        }
                        else {
                            bot.reply(message, "Is this what you're after? " + firstResult.url + ' :thinking_face:');
                        }
                    }
                    else {
                        bot.reply(message, "Sorry, couldn't find anything about " + searchTerm + ' :confused:');
                    }
                });
            }
        }).on('error', function(e) {
            console.log("error: ", e);
        });
    });

    controller.hears(['what would (.*) say'],'direct_message,direct_mention,mention',function(bot, message) {

        var person = message.text.match(/what would (.*) say/i)[1];

        if(Persona.getPersonas().length > 0 && Persona.getPersonas().indexOf(person) > -1){
            Persona.getPersona(person, function(response){
                var quote = utils.randomPicker(response);
                console.log('saying quote', quote);
                bot.reply(message, person + ' would say, "' + quote + '"');
            });
        }

    });
}

module.exports =  hears;