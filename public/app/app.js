var myApp = angular.module('myApp', [
    'ngRoute',
    'ngStorage',
    'userController'
]);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: '../../public/app/views/pages/home.html',
            controller: 'HomeController'
        })


}]);


myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

        when('/login', {
            templateUrl: '../../public/app/views/pages/login.html',
            controller: 'LoginController'
        })

}]);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

        when('/main', {
            templateUrl: '../../public/app/views/pages/main.html',
            controller: 'MainHomeController'
        })

}]);
myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

        when('/locallogin', {
            templateUrl: '../../public/app/views/pages/locallogin.html',
            controller: 'LocalLoginController'
        })

}]);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

        when('/eventfeed', {
            templateUrl: '../../public/app/views/pages/eventfeed.html',
            controller: 'EventfeedController'
        })

}]);
myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

        when('/login', {
            templateUrl: '../../public/app/views/pages/login.html',
            controller: 'LocalLoginController'
        })


}]);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

        when('/signup', {
            templateUrl: '../../public/app/views/pages/signup.html',
            controller: 'SignupController'
        })

}]);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

        when('/letsgo', {
            templateUrl: '../../public/app/views/pages/letsgo.html',
            controller: 'MainController'
        })

}]);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

        when('/profile', {
            templateUrl: '../../public/app/views/pages/profile.html',
            controller: 'ProfileController'
        })

}]);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

        when('/singleevent', {
            templateUrl: '../../public/app/views/pages/event.html',
            controller: 'EventController'
        })

}]);
myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

        when('/addevent', {
            templateUrl: '../../public/app/views/pages/addevent.html',
            controller: 'AddEventController'
        })

}]);
myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

        when('/adminlogin', {
            templateUrl: '../../public/app/views/pages/adminlogin.html',
            controller: 'AdminController'
        })

}]);




