'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
	value('version', '0.1');



angular.module('currencyServices', ['ngResource']).
	factory('Currencies', function($resource){
		var date = new Date();
		var date1Week = new Date();
		var date1Year = new Date();

		date1Week.setDate(date.getDate()-7);
		date1Year.setFullYear(date.getFullYear() -1);

		var date1WeekString = date1Week.getFullYear() + "-" + ('0'+date1Week.getMonth()+1).slice(-2) + "-" + ('0'+date1Week.getDate()).slice(-2);
		var date1YearString = date1Year.getFullYear() + "-" + ('0'+date1Year.getMonth()+1).slice(-2) + "-" + ('0'+date1Year.getDate()).slice(-2);

		console.log(date1Week + " - " + date1Year);

		return $resource('http://openexchangerates.org/api/:path/:date', {app_id:'6dd6aeea8bc24882b1af4d16316d78a6', callback: 'JSON_CALLBACK'},{
			getTodayRates: {method:'JSONP', params:{path:'latest.json'}},
			get1WeekRates: {method:'JSONP', params:{path:'historical', date:date1WeekString+'.json'}},
			get1YearRates: {method:'JSONP', params:{path:'historical', date:date1YearString+'.json'}},
			getCurrencies: {method:'JSONP', params:{path:'currencies.json'}}
		});
	});


