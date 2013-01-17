'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'currencyServices', 'ngSanitize']).
 config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  	$locationProvider.html5Mode(true).hashPrefix('!');
    $routeProvider
	    .when('/app/', {templateUrl: 'partials/partial1.html', controller: CurrenciesCtrl})
	    .otherwise({redirectTo: '/app/'});
  }]);
