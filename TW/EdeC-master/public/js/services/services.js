angular.module('EDeC')
	.factory('Comments', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			get : function() {
				return $http.get('/api/product/' + $routeParams.idProduct + '/comments/' + $routeParams.pager);
			}
		}
	}])
	.factory('FriendProfile', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			get : function() {
				return $http.get('/api/friendProfile/' + $routeParams.idUser);
			}
		}
	}])
	.factory('Homepage', ['$http', function($http) {
		return {
			get : function() {
				return $http.get('/api/homepage');
			}
		}
	}])
	.factory('Login', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			get : function() {
				return $http.get('/api/login');
			},
			post : function() {
				return $http.post('/api/login');
			}
		}
	}])
	.factory('Product', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			get : function() {
				return $http.get('/api/product/' + $routeParams.idProduct);
			},
			post : function() {
				return $http.get('/api/product/' + $routeParams.idProduct);
			}
		}
	}])
	.factory('Products', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			get : function() {
				return $http.get('/api/products/' + $routeParams.pager);
			}
		}
	}])
	.factory('Profile', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			get : function() {
				return $http.get('/api/profile');
			},
			post : function() {
				return $http.post('/api/profile');
			}
		}
	}])
	.factory('Register', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			get : function() {
				return $http.get('/api/register');
			},
			post : function() {
				return $http.post('/api/register');
			}
		}
	}])
	.factory('Statistic', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			get : function() {
				return $http.get('/api/statistic/' + $routeParams.idProduct);
			}
		}
	}])
	.factory('Statistics', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			get : function() {
				return $http.get('/api/statistics/' + $routeParams.pager);
			}
		}
	}]);