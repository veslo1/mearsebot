// utils.js
// basic utils for mearsebot

module.exports = {

    randomPicker: function randomPicker(arr) {
        if(typeof arr !== 'undefined' && arr.length) {
            return arr[Math.floor(Math.random() * arr.length)];
        } else {
            return '!@#%@#%'
        }

    },
    formatUptime : function formatUptime(uptime) {
        var unit = 'second';
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'minute';
        }
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'hour';
        }
        if (uptime != 1) {
            unit = unit + 's';
        }

        uptime = uptime + ' ' + unit;
        return uptime;
    }

};