'use strict';

var gaPlugin;
var isConnected = true;
var userLocale = "";

function initialize() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function checkLocale() {
	navigator.globalization.getLocaleName(
		function (locale) {
			userLocale=locale.value;
		},
		function () {
			userLocale = "en_US";
		}
	);
}

function checkConnection() {
	var networkState = navigator.connection.type;

	var states = {};
	states[Connection.UNKNOWN]  = true;
	states[Connection.ETHERNET] = true;
	states[Connection.WIFI]     = true;
	states[Connection.CELL_2G]  = true;
	states[Connection.CELL_3G]  = true;
	states[Connection.CELL_4G]  = true;
	states[Connection.NONE]     = false;

	isConnected = states[networkState];
}



function goingAway() {
	gaPlugin.exit(nativePluginResultHandler, nativePluginErrorHandler);
}

function nativePluginResultHandler (result) {

}

function nativePluginErrorHandler (error) {
}

function onDeviceReady() {
	checkConnection();
	checkLocale();
	angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'currencyServices', 'ngSanitize']).
	 config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	    $routeProvider
		    .when('/', {templateUrl: 'partials/partial1.html', controller: CurrenciesCtrl})
		    .otherwise({redirectTo: '/'});
	  }]);
	angular.bootstrap(document, ['myApp']);
	
	//loaded();
    gaPlugin = window.plugins.gaPlugin;
    gaPlugin.init(gaSuccess, nativePluginErrorHandler, "UA-37773225-2", 10);
}

function trackPageSuccess(){
	gaPlugin.setVariable(nativePluginResultHandler, nativePluginErrorHandler, "Device info", device.name + '|' + device.platform + '|' + device.version, 2);
}

function gaSuccess(){
	gaPlugin.trackPage(trackPageSuccess, nativePluginErrorHandler, "index.html");
}
	
	


