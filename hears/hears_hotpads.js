// hears.js
// all the things mearsebot can hear

/*
*
* https://hotpads.com/node/api/v2/area/byResourceId?resourceId=san-francisco-ca
*
* https://hotpads.com/node/api/v2/listing/byQuads?components=basic,useritem,quality,model&limit=4&quads=023010203102,023010203103,023010203112,023010203113,023010212002,023010212003,023010212012,023010203120,023010203121,023010203130,023010203131,023010212020,023010212021,023010212030,023010203122,023010203123,023010203132,023010203133,023010212022,023010212023,023010212032,023010203300,023010203301,023010212210,023010203302,023010203303,023010212212,023010203320,023010203321,023010212230,023010203322,023010203323,023010212232,023010221100,023010221101,023010230010,023010221102,023010221103,023010230012,023010221120,023010221121,023010221130,023010221131,023010230020,023010230021,023010230030,023010221122,023010221123,023010221132,023010221133,023010230022,023010230023,023010230032,023010221300,023010221301,023010221310,023010221311,023010230200,023010230201,023010230210&bedrooms=0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8plus&bathrooms=0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8plus&lowPrice=0&includeVaguePricing=false&listingTypes=rental,sublet,room&propertyTypes=house,divided,condo,townhouse,medium,large,land,garden&minPhotos=0&maxCreated=&visible=new,viewed,favorite,inquiry,note&pets=
*
 * */

var utils = require('../lib/utils.js');
var http = require('http');
var axios = require('axios');
var Summary = require('../hotpads/Summary');

// all the hears go here
function hears(controller){

    //console.log(controller.hears());
    controller.hears(['help me find a place'], 'direct_message,direct_mention,mention', function(bot, message){

    });

    controller.hears([
        'list apartments',
        'show apartments',
        'suggest apartments',
        'new apartments'
    ],'ambient,direct_message,direct_mention,mention',function(bot, message) {

        var hotpads = 'http://hotpads.com';
        var url = 'http://hotpads.com/node/api/v2/listing/byQuads?components=basic,useritem,quality,model&limit=4&quads=023010203102,023010203103,023010203112,023010203113,023010212002,023010212003,023010212012,023010203120,023010203121,023010203130,023010203131,023010212020,023010212021,023010212030,023010203122,023010203123,023010203132,023010203133,023010212022,023010212023,023010212032,023010203300,023010203301,023010212210,023010203302,023010203303,023010212212,023010203320,023010203321,023010212230,023010203322,023010203323,023010212232,023010221100,023010221101,023010230010,023010221102,023010221103,023010230012,023010221120,023010221121,023010221130,023010221131,023010230020,023010230021,023010230030,023010221122,023010221123,023010221132,023010221133,023010230022,023010230023,023010230032,023010221300,023010221301,023010221310,023010221311,023010230200,023010230201,023010230210&bedrooms=0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8plus&bathrooms=0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8plus&lowPrice=0&includeVaguePricing=false&listingTypes=rental,sublet,room&propertyTypes=house,divided,condo,townhouse,medium,large,land,garden&minPhotos=0&maxCreated=&visible=new,viewed,favorite,inquiry,note&pets='
        var listings = [];
        var listing;

        console.log('get apartments');

        axios.get(url)
            .catch(function(err){
                console.log("error: ", err);
            })
            .then(function(res){
                if (res.status !== 200) {
                    bot.reply(message, "Sorry, couldn't find any apartments.:confused:");
                } else {
                    console.log('res.end');
                    var result = res.data;
                    var processedListing;
                    var quadCountHash = {};

                    console.log('result.success', result.success);
                    if (result.success && result.data.length > 0) {
                        console.log('result.data.length', result.data.length);
                        result.data.forEach(function(listingByQuad) {
                            quadCountHash[listingByQuad.name] = {
                                totalInQuad: listingByQuad.numTotal,
                                cachedInQuad: listingByQuad.totalIncluded
                            };
                            if (listingByQuad.listingsGroup.length > 0) {
                                listingByQuad.listingsGroup.forEach(function(listingByMaloneLot) {
                                    if (listingByMaloneLot[0] && listingByMaloneLot[0].active) {
                                        processedListing = Summary.create(listingByMaloneLot[0]);
                                        if (processedListing.maloneLotIdEncoded) {
                                            listings.push(processedListing);
                                        }
                                    }
                                });
                            }
                        });
                        console.log(listings[0].uriV2, listings[1].uriV2);
                        bot.reply(message, ':thinking_face: here\'s a couple listings...\n' +
                            hotpads + listings[0].uriV2 + '\n' + hotpads + listings[1].uriV2);
                    }else {
                        console.log('res.statusCode', res.statusCode);
                        bot.reply(message, 'Sorry, couldn\'t find any apartments that matched :confused:');
                    }
                }
            })
            .catch(function(err){
                console.log("error: ", err);
            });
    });
}

module.exports =  hears;