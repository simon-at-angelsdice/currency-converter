'use strict';

/* Controllers */

function JSON_CALLBACK(data) {
    // returning from async callbacks is (generally) meaningless
}

function CurrenciesCtrl($scope, $http, Currencies){
	var todayDate = new Date();
	todayDate = todayDate.getFullYear() + "-" + ('0'+todayDate.getMonth()+1).slice(-2) + "-" + ('0'+todayDate.getDate()).slice(-2);
	if (window.localStorage.getItem("today") !== null && todayDate == window.localStorage.getItem("today"))
	{
		$scope.exchangeRates = JSON.parse(window.localStorage.getItem("todaysRates"));
		$scope.exchangeRates1year = JSON.parse(window.localStorage.getItem("weekRates"));
		$scope.exchangeRates1Week = JSON.parse(window.localStorage.getItem("yearRates"));		
		$scope.disclaimer = window.localStorage.getItem("disclaimer");
		$scope.license = window.localStorage.getItem("license");
	}
	else
	{
		//$scope.getNewData();
		$scope.exchangeRates = Currencies.getTodayRates(function(exchangeRates){
			$scope.isComplete();
		});
		$scope.exchangeRates1year = Currencies.get1YearRates(function(exchangeRates1year){
			$scope.isComplete();
		});
		$scope.exchangeRates1Week = Currencies.get1WeekRates(function(exchangeRates1Week){
			$scope.isComplete();
		});
	}
	$http.get('data/currencies.json').success(function(data) {
		$scope.currencies = data;
	});

	$scope.getNewData = function(){
		$scope.exchangeRates = Currencies.getTodayRates(function(exchangeRates){
			$scope.isComplete();
		});
		$scope.exchangeRates1year = Currencies.get1YearRates(function(exchangeRates1year){
			$scope.isComplete();
		});
		$scope.exchangeRates1Week = Currencies.get1WeekRates(function(exchangeRates1Week){
			$scope.isComplete();
		});

	};

	$scope.serviceCounter = 0;
	$scope.numberOfServices = 3;

	$scope.howMuch = 1;
	$scope.selectedFromCode = "GBP";
	$scope.selectedToCode = "EUR";

	$scope.$watch('howMuch', function() {
		//$scope.howMuch = $scope.howMuch.replace(/[^\d.]+/g, '');//parseInt($scope.howMuch);
		$scope.setTotals();
		resizeFont($("#exchangeTodayCopy"), $("#exchangeToday"), $("#exchangeResults"));
	});

	$scope.isComplete = function(){
		$scope.serviceCounter = $scope.serviceCounter+1;
		if ($scope.serviceCounter >= $scope.numberOfServices)
		{
			$scope.setTotals();
			var storedDate = new Date();
			storedDate = storedDate.getFullYear() + "-" + ('0'+storedDate.getMonth()+1).slice(-2) + "-" + ('0'+storedDate.getDate()).slice(-2);
			window.localStorage.clear();
			window.localStorage.setItem("today", storedDate);
			window.localStorage.setItem("todaysRates", JSON.stringify($scope.exchangeRates));
			window.localStorage.setItem("weekRates", JSON.stringify($scope.exchangeRates1Week));
			window.localStorage.setItem("yearRates", JSON.stringify($scope.exchangeRates1year));

			var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
			$scope.disclaimer = $scope.exchangeRates.disclaimer.replace(exp, "<a href='$1' target='_blank'>$1</a>");
			$scope.license = $scope.exchangeRates.license.replace(exp, "<a href='$1' target='_blank'>$1</a>");


			window.localStorage.setItem("disclaimer", $scope.disclaimer);
			window.localStorage.setItem("license", $scope.license);
			resizeFont($("#exchangeTodayCopy"), $("#exchangeToday"), $("#exchangeResults"));

		}
	};


	$scope.setTotals = function(){

		//if ($scope.serviceCounter >= $scope.numberOfServices){
			$scope.todayTotal = parseFloat($scope.exchangeRates.rates[$scope.selectedToCode] * (1/$scope.exchangeRates.rates[$scope.selectedFromCode]) * $scope.howMuch).toFixed(2) + " " + $scope.selectedToCode;
			$scope.weekTotal = parseFloat($scope.exchangeRates1Week.rates[$scope.selectedToCode] * (1/$scope.exchangeRates1Week.rates[$scope.selectedFromCode]) * $scope.howMuch).toFixed(2) + " " + $scope.selectedToCode;
			$scope.yearTotal = parseFloat($scope.exchangeRates1year.rates[$scope.selectedToCode] * (1/$scope.exchangeRates1year.rates[$scope.selectedFromCode]) * $scope.howMuch).toFixed(2) + " " + $scope.selectedToCode;
		//}

		resizeFont($("#exchangeTodayCopy"), $("#exchangeToday"), $("#exchangeResults"));
	};

	var resizeFont = function(theTextCopy, theText, theContainer){
		var fontsize = 100;
		theTextCopy.css({"font-size": fontsize+"px", "line-height": fontsize+"px"});
		if (theTextCopy.outerWidth(true) > theContainer.width()-40){
			for (var i=fontsize; i>=12; i--){
				theTextCopy.css({"font-size": i+"px", "line-height": i+"px"});
				if (theTextCopy.outerWidth(true) <= theContainer.width()-40){
					theText.css({"font-size": i+"px", "line-height": i+"px"});
					return;
				}
			}
		}
	};

	$scope.setFromCode = function(code){
		$scope.selectedFromCode = code;
		$scope.setTotals();
	};

	$scope.setToCode = function(code){
		$scope.selectedToCode = code;
		$scope.setTotals();
	};

	$scope.getCurrencyNameFull= function(symbol) {
		if ($scope.currencies) {
			return symbol + ' - ' + $scope.currencies[symbol];
		}
		else {
			return false;
		}
	};

	resizeFont($("#exchangeTodayCopy"), $("#exchangeToday"), $("#exchangeResults"));

}