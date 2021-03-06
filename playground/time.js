const { months } = require('moment');
var moment = require('moment');


var date = moment();
date.add(1,'years');
console.log(date.format('MMM do YYYY h:mm:ss a'));