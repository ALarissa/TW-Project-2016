angular.module('EDeC', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
	.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
	
		$locationProvider.html5Mode(true);

		$routeProvider
			.when('/homepage', {
				templateUrl: 'views/homepage.html',
				controller: 'HomepageCtrl'
			})
			.when('/register', {
				templateUrl: 'views/register.html',
				controller: 'RegisterCtrl'
			})
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			})
			.when('/about', {
				templateUrl: 'views/aboutUs.html'
			})
			.when('/terms', {
				templateUrl: 'views/termsAndConditions.html'
			})
			.when('/faqs', {
				templateUrl: 'views/faqs.html'
			})
			.when('/privacy', {
				templateUrl: 'views/privacyPolicy.html'
			})
			.when('/products/:pager', {
				templateUrl: 'views/products.html',
				controller: 'ProductsCtrl'
			})
			.when('/product/:idProduct', {
				templateUrl: 'views/product.html',
				controller: 'ProductCtrl'
			})
			.when('/product/:idProduct/comments/:pager', {
				templateUrl: 'views/comments.html',
				controller: 'CommentsCtrl'
			})
			.when('/statistics', {
				templateUrl: 'views/statisticsGeneral.html'
			})
			.when('/statistics/:pager', {
				templateUrl: 'views/statistics.html',
				controller: 'StatisticsCtrl'
			})
			.when('/statistic/:idProduct', {
				templateUrl: 'views/statistic.html',
				controller: 'StatisticCtrl'
			})
			.when('/profile', {
				templateUrl: 'views/profile.html',
				controller: 'ProfileCtrl'
			})
			.when('/friendProfile/:idUser', {
				templateUrl: 'views/friendProfile.html',
				controller: 'FriendProfileCtrl'
			})
		  	.otherwise({
		    	redirectTo: '/homepage'
		  	});
	}])
	.filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i=0; i < total; i++)
                input.push(i);
            return input;
        }
    });
