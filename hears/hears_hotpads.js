// hears.js
// all the things mearsebot can hear

/*
*
* https://hotpads.com/node/api/v2/area/byResourceId?resourceId=san-francisco-ca
*
* https://hotpads.com/node/api/v2/listing/byQuads?components=basic,useritem,quality,model&limit=4&quads=023010203102,023010203103,023010203112,023010203113,023010212002,023010212003,023010212012,023010203120,023010203121,023010203130,023010203131,023010212020,023010212021,023010212030,023010203122,023010203123,023010203132,023010203133,023010212022,023010212023,023010212032,023010203300,023010203301,023010212210,023010203302,023010203303,023010212212,023010203320,023010203321,023010212230,023010203322,023010203323,023010212232,023010221100,023010221101,023010230010,023010221102,023010221103,023010230012,023010221120,023010221121,023010221130,023010221131,023010230020,023010230021,023010230030,023010221122,023010221123,023010221132,023010221133,023010230022,023010230023,023010230032,023010221300,023010221301,023010221310,023010221311,023010230200,023010230201,023010230210&bedrooms=0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8plus&bathrooms=0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8plus&lowPrice=0&includeVaguePricing=false&listingTypes=rental,sublet,room&propertyTypes=house,divided,condo,townhouse,medium,large,land,garden&minPhotos=0&maxCreated=&visible=new,viewed,favorite,inquiry,note&pets=
*
 * */
var util = require('util');
var utils = require('../lib/utils.js');
var hotpadsWrapper = require('../lib/hotpadsWrapper.js');
var urljoin = require('url-join');
var http = require('http');
var axios = require('axios');
var Summary = require('../hotpads/Summary');
var hotpads = 'http://hotpads.com';

// all the hears go here
function hears(controller){

    controller.hears(['zillow (.*)'], 'ambient,direct_message,direct_mention,mention', function(bot, message){
        var matches = message.text.match(/zillow (.*)/i);
        var name = matches[1];
            name = name.replace(/\s/ig, '+');
        bot.reply(message, 'https://www.google.com/#q=zillow+' + name + '&btnI');
    });

    controller.hears(['help'], 'direct_message,direct_mention,mention', function(bot, message){

        var sentences = {
            intro: [
                'Okay, let\'s help you find a place.',
                'First off, where are we looking?',
                'Say, san francisco or brooklyn, ny'
            ],
            howMuch: [
                'Okay, how much are we willing to spend?',
                'Say, 500, 1000, 1250 (just a number)'
            ],
            beds: [
                'About how many bedrooms?',
                'Say, studio, one, two, etc.'
            ],
            recap: [
                'I think I got it.'
            ],
            results: [
                'Here\'s some search results!'
            ]
        };

        var allListings = [];

        var intro = function(response, convo) {

            convo.on('end',function(convo) {

                var res = convo.extractResponses();
                console.log('conversation end======================');

                if (convo.status=='completed') {
                    // do something useful with the users responses
                    console.log('responses', util.inspect(res, {depth: 3, colorize: true}));

                } else {
                    // something happened that caused the conversation to stop prematurely
                }

            });

            convo.ask(sentences.intro.join('\n'), function(response, convo) {
                convo.say('Cool, you said: ' + response.text);
                howMuch(response, convo);
                convo.next();
            }, { key: 'where'} );
        };

        var howMuch = function(response, convo) {
            convo.ask(sentences.howMuch.join('\n'), function(response, convo) {
                convo.say('Awesome. I\'ll set a max of $'+ response.text);
                beds(response, convo);
                convo.next();
            }, { key: 'price'});
        };

        var beds = function(response, convo) {
            convo.ask(sentences.beds.join('\n'), function(response, convo) {
                convo.say('"' + response.text + '"' + ' got it.');
                recap(response, convo);
                convo.next();
            }, { key: 'beds'});
        };

        var recap = function(response, convo) {

            var where = convo.extractResponse('where');

            var answers = util.format(
                'Looking in %s\n' +
                'Max price: %s\n' +
                'Bed(s): %s'
                ,
                convo.extractResponse('where'),
                convo.extractResponse('price'),
                convo.extractResponse('beds')
            );

            console.log('-------------where', answers);
            var post = {
                'username': 'hotbot',
                'text': 'Okay!',
                'attachments': [
                    {
                        'title': 'Here are your answers.',
                        'text': answers,
                        'color': '#7CD197'
                    }
                ]
            };

            convo.say(post);
            confirm(response, convo);
            convo.next();

        };

        var confirm = function(response, convo) {
            convo.ask('Shall we proceed Say YES, NO or DONE to quit.',[
                {
                    pattern: 'done',
                    callback: function(response,convo) {
                        convo.say('OK you are done!');
                        convo.next();
                    }
                },
                {
                    pattern: bot.utterances.yes,
                    callback: function(response,convo) {
                        convo.say('Great! Gimme a second to look for some places that match.');
                        getPlaces(convo.extractResponses());
                        convo.next();

                    }
                },
                {
                    pattern: bot.utterances.no,
                    callback: function(response,convo) {
                        convo.say('Perhaps later.');
                        // do something else...
                        convo.next();
                    }
                },
                {
                    default: true,
                    callback: function(response,convo) {
                        // just repeat the question
                        convo.repeat();
                        convo.next();
                    }
                }
            ]);
        };


        var getPlaces = function(responses) {

            console.log('getting places');
            var where = responses.where;

            if(typeof where !== 'undefined') {
                hotpadsWrapper.autoComplete(encodeURIComponent(where))
                    .then(function(result){

                        console.log('==========get places result', result[0]);

                        var id = result[0].id;
                        hotpadsWrapper.byAreaId(id)
                            .then(function(areaObj){
                                console.log('area obj--------------', areaObj);
                                var params = {
                                    minLat: areaObj.minLat,
                                    minLon: areaObj.minLon,
                                    maxLat: areaObj.maxLat,
                                    maxLon: areaObj.maxLon,
                                    price: responses.price,
                                    beds: responses.beds
                                };
                                hotpadsWrapper.byCoords(params)
                                    .then(function(listings){
                                        allListings = listings;
                                        console.log('----------got listings', listings.length);
                                        bot.startConversation(message, showHelpResults);
                                    });
                            });

                    });
            } else {
                //say something
            }

        };

        var showHelpResults = function(response, convo){
            console.log("in help results");
            convo.say('Here\'s a result.\n' + 'http://hotpads.com' + allListings[0].uriBuilding);
        };

        // start a conversation to handle this response.
        bot.startConversation(message, intro);


    });

    controller.hears(['[places|rentals|apartments] in (.*)'], 'direct_message,direct_mention,mention', function(bot, message){

        console.log('whoohoo rentals in');
        var matches = message.text.match(/in (.*)/i);
        var name = matches[1];

        hotpadsWrapper.autoComplete(encodeURIComponent(name))
            .then(function(suggestedAreas){

                var areas = [];

                if (typeof suggestedAreas !== 'undefined') {

                    suggestedAreas.map(function(area) {
                        //console.log('---------', hotpads, util.inspect(area, depth=3, colorize=true));
                        areas.push('<' + urljoin(hotpads, area.resourceId, 'apartments-for-rent') + '|'+ area.name
                            + ' , ' + area.city + ' , ' + area.state + '>\n');
                    });

                    var post = {
                        'username': 'HotBot' ,
                        'text': 'OK, Here\'s some places matching ' + '"' + name + '"',
                        'attachments': [
                            {
                                'text': areas.join(''),
                                'color': '#7CD197'
                            }
                        ]
                    };

                    bot.reply(message, post);
                } else {
                    bot.reply(message, 'Sorry, couldn\'t find any apartments that matched :confused:');
                }

            });

    });

    controller.hears(['how much are places in (.*)'], 'ambient,direct_message,direct_mention,mention', function(bot, message){
        bot.say(message, 'lemme find out...');
    });

    controller.hears([
        'list apartments',
        'show apartments',
        'suggest apartments',
        'new apartments'
    ],'ambient,direct_message,direct_mention,mention',function(bot, message) {

        var hotpads = 'http://hotpads.com';

        hotpadsWrapper.byQuads([])
            .then(function(results){
                if(typeof results !== 'undefined') {
                    bot.reply(message, ':thinking_face: here\'s a couple listings...\n' +
                        hotpads + results[0].uriV2 + '\n' + hotpads + results[1].uriV2);
                } else {
                    bot.reply(message, 'Sorry, couldn\'t find any apartments that matched :confused:');
                }
            });

    });
}

module.exports =  hears;