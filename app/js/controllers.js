'use strict';

/* Controllers */

function JSON_CALLBACK(data) {
    // returning from async callbacks is (generally) meaningless
    console.log("callback");
}

function CurrenciesCtrl($scope, $http, Currencies){
	
	var todayDate = new Date();
	todayDate = todayDate.getFullYear() + "-" + ('0'+todayDate.getMonth()+1).slice(-2) + "-" + ('0'+todayDate.getDate()).slice(-2);
	console.log(localStorage.getItem("today") + " - " + todayDate);
	if (todayDate != localStorage.getItem("today")){ console.log("localStorage.getItem('today') != null");}
	if (localStorage.getItem("today") !== null && todayDate == localStorage.getItem("today"))
	{
		console.log(JSON.parse(localStorage.getItem("todaysRates")));
		$scope.exchangeRates = JSON.parse(localStorage.getItem("todaysRates"));
		$scope.exchangeRates1year = JSON.parse(localStorage.getItem("weekRates"));
		$scope.exchangeRates1Week = JSON.parse(localStorage.getItem("yearRates"));		
		$scope.disclaimer = localStorage.getItem("disclaimer");
		$scope.license = localStorage.getItem("license");
	}
	else
	{
		console.log("using remote data");
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
	});

	$scope.isComplete = function(){
		$scope.serviceCounter = $scope.serviceCounter+1;
		if ($scope.serviceCounter >= $scope.numberOfServices)
		{
			$scope.setTotals();
			var storedDate = new Date();
			storedDate = storedDate.getFullYear() + "-" + ('0'+storedDate.getMonth()+1).slice(-2) + "-" + ('0'+storedDate.getDate()).slice(-2);
			localStorage.clear();
			localStorage.setItem("today", storedDate);
			localStorage.setItem("todaysRates", JSON.stringify($scope.exchangeRates));
			localStorage.setItem("weekRates", JSON.stringify($scope.exchangeRates1Week));
			localStorage.setItem("yearRates", JSON.stringify($scope.exchangeRates1year));

			var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
			$scope.disclaimer = $scope.exchangeRates.disclaimer.replace(exp, "<a href='$1'>$1</a>");
			$scope.license = $scope.exchangeRates.license.replace(exp, "<a href='$1'>$1</a>");


			localStorage.setItem("disclaimer", $scope.disclaimer);
			localStorage.setItem("license", $scope.license);
		}
	};


	$scope.setTotals = function(){

		//if ($scope.serviceCounter >= $scope.numberOfServices){
			$scope.todayTotal = parseFloat($scope.exchangeRates.rates[$scope.selectedToCode] * (1/$scope.exchangeRates.rates[$scope.selectedFromCode]) * $scope.howMuch).toFixed(2) + " " + $scope.selectedToCode;
			$scope.weekTotal = parseFloat($scope.exchangeRates1Week.rates[$scope.selectedToCode] * (1/$scope.exchangeRates1Week.rates[$scope.selectedFromCode]) * $scope.howMuch).toFixed(2) + " " + $scope.selectedToCode;
			$scope.yearTotal = parseFloat($scope.exchangeRates1year.rates[$scope.selectedToCode] * (1/$scope.exchangeRates1year.rates[$scope.selectedFromCode]) * $scope.howMuch).toFixed(2) + " " + $scope.selectedToCode;
		//}

		console.log("before resize" + $("#exchangeToday").outerWidth());
		console.log($("#exchangeResults").outerWidth());

		resizeFont($("#exchangeTodayCopy"), $("#exchangeToday"), $("#exchangeResults"));
	};

	var resizeFont = function(theTextCopy, theText, theContainer){
		var fontsize = 100;
		theTextCopy.css({"font-size": fontsize+"px", "line-height": fontsize+"px"});
		if (theTextCopy.outerWidth(true) > theContainer.width()-40){
			console.log("in if");
			for (var i=fontsize; i>=12; i--){
				theTextCopy.css({"font-size": i+"px", "line-height": i+"px"});
				if (theTextCopy.outerWidth(true) <= theContainer.width()-40){
					theText.css({"font-size": i+"px", "line-height": i+"px"});
					return;
				}
			}
		}
		//var i = /*remove unit from integer*/
		// while( /*text overlaps div*/ ){
		//     theText.css("font-size", --i+"px");
		// }
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

}