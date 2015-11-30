var app = angular.module("app",["xeditable"]);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});


app.controller('CustomerController', function($scope,$http) {
	$scope.init = function () {
		$http({
			method : "GET",
			url : '/customer/getProfilePageDetails',             //gets only details
			data : {
			}
		}).success(function(data) {
				if (data.statusCode === 200) {
					$scope.customer = {
							FirstName: data.firstname,
							LastName: data.lastname,
							Email: data.email,
							Contact: data.contact,
							Address: data.address,
							City: data.city,
							CardNumber:data.cardnumber,
							State: data.state,
							CardCVV: data.cardcvv,
							ZipCode: data.zipcode,
							Zip: data.cardzip,
							Password: data.password,
							Expiry: data.cardexpiry,
							Rating:data.rating
					};
				}
			}).error(function(error) {
					
			});
	};

	
	$scope.saveChangesToDB = function() {
    	$http({
			method : "POST",
			url : '/customer/updateProfile',
			data : {
				"FirstName" : $scope.customer.FirstName,
				"LastName" : $scope.customer.LastName,
				"Email" : $scope.customer.Email,
				"Contact" : $scope.customer.Contact,
				"Address" : $scope.customer.Address,
				"City" : $scope.customer.City,
				"CardNumber" : $scope.customer.CardNumber,
				"State" : $scope.customer.State,
				"CardCVV" : $scope.customer.CardCVV,
				"ZipCode" : $scope.customer.ZipCode,
				"CardZIP" : $scope.customer.Zip,
				"CardPWD" : $scope.customer.Password,
				"CardEXP" : $scope.customer.Expiry
			}
		}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode === 200) {
					window.location.assign("/customer/viewProfile");
				}
			}).error(function(error) {
					
			});
	};
	
	$scope.loadCustomerPageForView = function() {
				    window.location.assign("/customer/viewProfile");		// calls ViewCustomerProfile.ejs
	};
	
	$scope.loadCustomerPageForEdit = function() {
    			    window.location.assign("/customer/editProfile");		// calls editableform.ejs
	};
	  
});