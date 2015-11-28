var userController = angular.module("userController", []);

userController.controller("HomeController", ['$scope', '$http', '$localStorage', function ($scope, $http, $localStorage) {

    $http.get("/api/getusers").success(function (data) {

        $scope.userdata = data;

    });




}]);


userController.controller("LoginController", ['$scope', '$rootScope', '$location', '$http', '$localStorage', function ($scope, $rootScope, $location, $http, $localStorage) {


}])


userController.controller("MainController", ['$scope', '$rootScope', '$location', '$http', '$localStorage', function ($scope, $rootScope, $location, $http, $localStorage) {


}]);
userController.controller("LocalLoginController", ['$scope', '$rootScope', '$location', '$http', '$localStorage', function ($scope, $rootScope, $location, $http, $localStorage) {

    $scope.signin = function(){

        console.log('inside sigin functuon');

        $http.post('/api/login', $scope.user).success(function(data){


            if (data.message == "Successfully login") {
                console.log('In success state');
                $rootScope.authenticated = true;
                // $rootScope.current_userid = data.user._id;
                $rootScope.current_userid = data.userid;
                // console.log($rootScope.current_userid);
                $localStorage.current_userid = $rootScope.current_userid;
                //console.log($localStorage.current_userid);
                //$rootScope.current_userFirstChar = data.user.username.charAt(0);
                //$localStorage.current_userFirstChar = $rootScope.current_userFirstChar;
                //console.log($rootScope.current_userFirstChar);

                $location.path('/main');
            } else {
                $scope.error_message = 'login request for ' + $scope.user.username;
            }
        })
    };


}]);
userController.controller("SignupController", ['$scope', '$rootScope', '$location', '$http', '$localStorage', function ($scope, $rootScope, $location, $http, $localStorage) {

    $scope.signup = function () {

        console.log('inside signup functuon');

        $http.post('/api/signup', $scope.user).success(function (data) {


            if (data.success == true) {
                console.log('In success state');
                $rootScope.authenticated = true;
                // $rootScope.current_userid = data.user._id;
                //$rootScope.current_userid = data.userid;
                // console.log($rootScope.current_userid);
                //$localStorage.current_userid = $rootScope.current_userid;
                //console.log($localStorage.current_userid);
                //$rootScope.current_userFirstChar = data.user.username.charAt(0);
                //$localStorage.current_userFirstChar = $rootScope.current_userFirstChar;
                //console.log($rootScope.current_userFirstChar);

                $location.path('/login');
            } else {
                $scope.error_message = 'login request for ' + $scope.user.username;
            }
        })
    };



}]);


userController.controller("EventController", ['$scope', '$rootScope', '$location', '$http', '$localStorage', function ($scope, $rootScope, $location, $http, $localStorage) {

    $http.get("/api/eventfeed", {params: {userid: $localStorage.current_userid}}).success(function (data) {

        $scope.userdata = data;

    });


    $http.get("/api/getgeojson").success(function (data) {


        $scope.places = data;

        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(40.0000, -98.0000),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        $scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (info) {

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.city
            });
            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });

            $scope.markers.push(marker);

        }

        for (i = 0; i < $scope.places.length; i++) {
            createMarker($scope.places[i]);
        }

        $scope.openInfoWindow = function (e, selectedMarker) {
            e.preventDefault();

            console.log("inside openinfowindow");
            google.maps.event.trigger(selectedMarker, 'click');
        }

    });


}]);

