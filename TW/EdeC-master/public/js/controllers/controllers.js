angular.module('EDeC')
    .config(function($datepickerProvider) {
        angular.extend($datepickerProvider.defaults, {
            dateFormat: 'dd-mm-yyyy',
            startWeek: 1
        });
    })
    .controller('LoginCtrl', ['$scope', '$routeParams', '$http', 'Login', function($scope, $routeParams, $http, Login) {
        Login.post()
        .success(function(data) { 
        });
    }])
    .controller('HomepageCtrl', ['$scope', '$routeParams', '$rootScope', '$location', '$timeout', '$filter', '$http', 'Homepage', function($scope, $routeParams, $rootScope, $location, $timeout, $filter, $http, Homepage) {

        $('document').ready(function() {
            $('.homepage-slider').bxSlider({
                pager: false
            });
        });

        $scope.HomepageProducts = [];

        Homepage.get().success(function(data){
        	if (data.username == 0 && typeof $rootScope.username === 'undefined') {
        		$rootScope.username == '';
        	} else {
        		$rootScope.username = data.username;
        	}

            data.randomProducts.forEach(function(item) {
                var temp = {};
                temp.description = item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description;
                temp.image = item.image;
                temp.name = item.name;
                temp.id_product = item.id_product;
                $scope.HomepageProducts.push(temp);
            })
        });
    }])
    .controller('CommentsCtrl', ['$scope', '$routeParams', '$filter', '$http', 'Comments', function($scope, $routeParams, $filter, $http, Comments) {

        $scope.Product;
        $scope.Comments = [];
        $scope.Pager = parseInt($routeParams.pager) - 1;
        $scope.PagerNext = parseInt($routeParams.pager) + 1;

        Comments.get()
        .success(function(data) {
            var product = data.productData[0];
            var temp = {};
            temp.id_product = product.id_product;
            temp.name = product.name;
            temp.weight = product.weight;
            temp.stock = product.stock;
            temp.price = product.price;
            temp.description = product.description;
            temp.positiveRating = Math.round(product.rating);
            temp.negativeRating = 5 - temp.positiveRating;
            temp.image = product.image;

            $scope.Product = temp;
            data.productComments.forEach(function(comment) {
                var temp = {};
                temp.positiveRating = Math.round(comment.rating);
                temp.negativeRating = 5 - temp.positiveRating;
                temp.comm = comment.comm;
                temp.username = comment.username;
                temp.postDate = comment.postDate;
                temp.id_usercomm = comment.id_comm;
                $scope.Comments.push(temp);
            });
        });
    }])
    .controller('FriendProfileCtrl', ['$scope', '$routeParams', '$filter', '$http', 'FriendProfile', function($scope, $routeParams, $filter, $http, FriendProfile) {

    $scope.GoodComments = [];
    $scope.BadComments = [];
    $scope.FriendsList = [];
    $scope.FriendInfo;

    FriendProfile.get()
    .success(function(data) {
        console.log(data);
         data.GoodCommData.forEach(function(comment) {
            var temp = {};
            temp.id_comm = comment.id_comm;
            temp.id_user = comment.id_user;
            temp.id_product = comment.id_product;
            temp.postDate = comment.postDate;
            temp.comm = comment.comm;
            temp.positiveRating = Math.round(comment.rating);
            temp.negativeRating = 5 - temp.positiveRating;
            temp.name= comment.name;
            console.log(temp.id_product);

            $scope.GoodComments.push(temp);
        });
        data.BadCommData.forEach(function(comment) {
            var temp2 = {};
            temp2.id_comm = comment.id_comm;
            temp2.id_user = comment.id_user;
            temp2.id_product = comment.id_product;
            temp2.postDate = comment.postDate;
            temp2.comm = comment.comm;
            temp2.positiveRating = Math.round(comment.rating);
            temp2.negativeRating = 5 - temp2.positiveRating;
            temp2.name= comment.name;

            $scope.BadComments.push(temp2);
        });

        var profile = data.FriendData[0];
        var temp3 = {};
            temp3.id_users = profile.id_users;
            temp3.username = profile.username;
            temp3.mail = profile.mail;
            temp3.name = profile.name;
            temp3.lastname = profile.lastname;
            temp3.gender = profile.gender;
            temp3.birthday = profile.birthday;
            temp3.address = profile.address;

            $scope.FriendInfo = temp3; 


          data.ListFriends.forEach(function(friend) {
            var temp4 = {};
            temp4.id_friend = friend.id_friend;
            temp4.username = friend.username;

            $scope.FriendsList.push(temp4);   
        });
      });
    }])
    .controller('ProductCtrl', ['$scope', '$routeParams', '$filter', '$http', 'Product', function($scope, $routeParams, $filter, $http, Product) {

        $scope.Product;
        $scope.Comments = [];

        Product.post().success(function(data){});  

        Product.get()
        .success(function(data) {
            console.log(data);
            var product = data.productData[0];
            var temp = {};
            temp.id_product = product.id_product;
            temp.name = product.name;
            temp.weight = product.weight;
            temp.stock = product.stock;
            temp.price = product.price;
            temp.description = product.description;
            temp.positiveRating = Math.round(product.rating);
            temp.negativeRating = 5 - temp.positiveRating;
            temp.image = product.image;

            $scope.Product = temp;
            data.productComments.forEach(function(comment) {
                var temp = {};
                temp.positiveRating = Math.round(comment.rating);
                temp.negativeRating = 5 - temp.positiveRating;
                temp.comm = comment.comm;
                temp.username = comment.username;
                temp.postDate = comment.postDate;
                console.log(temp.postDate);
                $scope.Comments.push(temp);
            });
        });
    }])
    .controller('ProductsCtrl', ['$scope', '$routeParams', '$filter', '$http', 'Products', function($scope, $routeParams, $filter, $http, Products) {

        $scope.Products = [];
        $scope.Pager = parseInt($routeParams.pager) - 1;
        $scope.PagerNext = parseInt($routeParams.pager) + 1;

        Products.get()
        .success(function(data) {
            data.forEach(function(product) {
                var temp = {};
                temp.id_product = product.id_product;
                temp.name = product.name;
                temp.description = product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description;
                temp.positiveRating = Math.round(product.rating);
                temp.negativeRating = 5 - temp.positiveRating;
                temp.image = product.image;

                $scope.Products.push(temp);
            })
        });
    }])
    .controller('ProfileCtrl', ['$scope', '$routeParams', '$http', 'Profile', function($scope, $routeParams, $http, Profile) {
        $scope.Profile;
        $scope.ProfileFriends = [];
        $scope.errorCode = $routeParams.error;

        Profile.get()
        .success(function(data) {
            var profile = data.UserData[0];
            var temp = {};
            temp.id_users = profile.idUser;
            temp.username = profile.username;
            temp.mail = profile.mail;
            temp.name = profile.name;
            temp.lastname = profile.lastname;
            temp.gender = profile.gender;
            temp.birthday = profile.birthday;
            temp.address = profile.address;
            $scope.Profile = temp; 

            data.FriendData.forEach(function(friends) {
                var temp2 = {}; 
                temp2.id_friend = friends.id_friend;
                temp2.username = friends.username;
                $scope.ProfileFriends.push(temp2);
                console.log(temp2);

            });
        });

        Profile.post()
        .success(function(data) {})
    }])
    .controller('RegisterCtrl', ['$scope', '$routeParams', '$http', 'Register', function($scope, $routeParams, $http, Register) {
        $scope.errorCode = $routeParams.error;
        Register.get()
        .success(function(data) {
        });

        Register.post()
        .success(function(data) { 
        });
    }])
    .controller('StatisticCtrl', ['$scope', '$window', '$routeParams', '$filter', '$http', 'Statistic', function($scope, $window, $routeParams, $filter, $http, Statistic) {
        $scope.Product;

        Statistic.get()
            .success(function(data) {
                console.log(data);
                var product = data.product[0];
                var temp = {};
                temp.id_product = product.id_product;
                temp.name = product.name;
                temp.weight = product.weight;
                temp.stock = product.stock;
                temp.price = product.price;
                temp.description = product.description;
                temp.positiveRating = Math.round(product.rating);
                temp.negativeRating = 5 - temp.positiveRating;
                temp.image = product.image;
                $scope.Product = temp;

                $window.comments = data.comments;
        });
    }])
    .controller('StatisticsCtrl', ['$scope', '$routeParams', '$filter', '$http', 'Statistics', function($scope, $routeParams, $filter, $http, Statistics) {

        $scope.Statistics = [];
        $scope.Pager = parseInt($routeParams.pager) - 1;
        $scope.PagerNext = parseInt($routeParams.pager) + 1;

        Statistics.get()
            .success(function(data) {
                console.log(data);
                $scope.Statistics = data;
        });
    }]);