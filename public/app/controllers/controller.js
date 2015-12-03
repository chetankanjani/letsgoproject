var userController = angular.module("userController", []);

userController.controller("HomeController", ['$scope', '$http', '$localStorage', function ($scope, $http, $localStorage) {

    $http.get("/api/getusers").success(function (data) {

        $scope.userdata = data;

    });




}]);
userController.controller("LoginController", ['$scope', '$http', '$localStorage','$facebook','$location', function ($scope, $http, $localStorage,$facebook,$location) {


$scope.fblogin=function(){




    $facebook.login().then(

        function(res){

           console.log(res);
            if (res.status === "connected") {
               $facebook.api('/me').then(function(res) {
                   console.log(res);
                   $http.get("/api/getfbuseridweb", {params: {fbid: res.id}}).success(function (data) {

                       console.log(data);

                       $localStorage.current_userid=data.userid;


                   });
                   })


                $location.path('/main');
            }
        }
    );

}

}]);

userController.controller("ProfileController", ['$scope', '$http', '$localStorage','$location', function ($scope, $http, $localStorage,$location) {



    $scope.openevent = function (data) {


        console.log("open event");
        console.log(data);

        $localStorage.onclickeventid = data;
        $location.path('/singleevent');


    }
    $http.get("/api/getfavourites", {params: {userid: $localStorage.current_userid}}).success(function (data) {

        console.log(data);
        $scope.data=data;
    });
    $http.get("/api/getrecent", {params: {userid: $localStorage.current_userid}}).success(function (data) {

        console.log(data);
        $scope.data1=data;
    });
    $http.get("/api/getuser", {params: {userid: $localStorage.current_userid}}).success(function (data) {

        console.log(data);
        $scope.data2=data;
    });




}]);


userController.controller("EventController", ['$scope', '$rootScope', '$location', '$http', '$localStorage', function ($scope, $rootScope, $location, $http, $localStorage) {

    // $location.path('/singleevent');


    $scope.postcomment = function () {


        //console.log($scope.user);
        $scope.user.eventid=$localStorage.onclickeventid;
            $scope.user.userid=$localStorage.current_userid;

        $http.post('/api/addcomment', $scope.user).success(function (data) {


                //if (data.success ==true) {
                $location.path('/singleevent');



        });
    }


    $http.get("/api/getevent", {params: {eventid: $localStorage.onclickeventid}}).success(function (data) {

        $scope.places = data;

        console.log(data);

        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(40.0000, -98.0000),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        $scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (info) {
            console.log(info.lat);
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.name
            });
            marker.content = '<div class="infoWindowContent">' + info.rating.value + '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });

            $scope.markers.push(marker);

        }

        for (i = 0; i < 1; i++) {
            createMarker($scope.places);
        }

        $scope.openInfoWindow = function (e, selectedMarker) {
            e.preventDefault();

            console.log("inside openinfowindow");
            google.maps.event.trigger(selectedMarker, 'click');
        }

    });

    $http.get("/api/getevent", {params: {eventid: $localStorage.onclickeventid}}).success(function (data) {


        console.log('inside  event controller');
        //console.log(data);
        console.log(data);
        $scope.data = data;

    });

    //$scope.data1.eventid=$localStorage.onclickeventid;
    //$scope.data1.userid=$localStorage.current_userid;
    $http.post('/api/addrecent', $scope.user).success(function (data) {

    });



    $scope.addtofav = function () {

        console.log('add fav');

        $http.post('/api/addfavourites', $scope.user).success(function (data) {


            $location.path('/eventfeed');
        });


    }





}]);


userController.controller("MainHomeController", ['$scope', '$rootScope', '$location', '$http', '$localStorage', function ($scope, $rootScope, $location, $http, $localStorage) {


    $scope.sendmessage = function () {

        $http.post('/api/email', $scope.user).success(function (data) {


            if (data.message == 'email sent') {
                // $location.path('/main');
            }
            else {

            }


        });
    }


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


userController.controller("EventfeedController", ['$scope', '$rootScope', '$location', '$http', '$localStorage', '$window', function ($scope, $rootScope, $location, $http, $localStorage, $window) {

    $http.get("/api/eventfeed", {params: {userid: $localStorage.current_userid}}).success(function (data) {


        console.log(data[0].name);
        $scope.userdata = data;

    });

    $scope.openevent = function (data) {


        console.log("open event");
        console.log(data);

        $localStorage.onclickeventid = data;
        $location.path('/singleevent');

    }

}]);

