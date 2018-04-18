/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var ClientApp = angular.module('clientApp', ['ngRoute', 'ui.bootstrap']);

ClientApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
                when('/Login', {
                    templateUrl: 'login.html',
                    controller: 'LoginController'
                }).
                when('/searchApp', {
                    templateUrl: 'searchApp.html',
                    controller: 'searchAppController'
                }).
                otherwise({
                    redirectTo: '/Login'
                });

    }]);

ClientApp.controller('ClientController', ClientControllerObject);
function ClientControllerObject($scope, getAndSendData)
{










}



ClientApp.controller('LoginController', LoginControllerObject);
function LoginControllerObject($scope, getAndSendData, $location)
{
    var promise = getAndSendData.getAndSendDataFromServer('https://swapi.co/api/people/', 0);
    promise.then(function (response) {
        console.log(response)
        $scope.loginAuth = response.results;
        console.log("----------------data-------------------------------")
        console.log($scope.loginAuth)

// login module start from here//
        $scope.loginAuthFunction = function (username, password)
        {

            localStorage.removeItem('userName')
            localStorage.removeItem('TimeStamp')
            localStorage.removeItem('countClick')

            var count = 0
            for (var i = 0; $scope.loginAuth.length > i; i++)
            {

                if ($scope.loginAuth[i].name == username && $scope.loginAuth[i].birth_year == password)
                {
                    count++
                    angular.element('#warningAlert1').removeClass('alert-warning')
                    angular.element('#warningAlert1').addClass('alert-success')
                    angular.element(".loadingspinner").css('display', 'block');
                    //set user name in local storage 
                    if (typeof (Storage) !== "undefined")
                    {
                        var reDate = new Date();
                        var recordTime = reDate.getTime()
                        localStorage.setItem("userName", $scope.loginAuth[i].name);
                        localStorage.setItem("TimeStamp", recordTime);
                        localStorage.setItem("countClick", 0);

                        // get string

                    } else
                    {
                        // Sorry! No Web Storage support..
                    }
                    $location.url('/searchApp');

                }


            }
            if (count == 0)
            {
                Error(' Plese Enter Valid User Name and Password', 'block')
                setTimeout(function ()
                {
                    angular.element('.alertMsg').css('display', 'none');
                }, 3000)

                return true;
            }
            else
            {
                //do nothing
            }

            //login module End//
        }

// login module start from here/
    }, function (err) {
        console.log("Error occured: " + err);
    });
    function Error(msg, css)
    {
        $('.alertMsg').css('display', css);

        $('.alertMsgSet').text(msg);
    }
}

//searching module controller start 
ClientApp.controller('searchAppController', searchAppControllerObject);
function searchAppControllerObject($scope, getAndSendData)
{
    setTimeout(function ()
    {
        angular.element(".loadingspinner").css('display', 'none');
    }, 1500)

    var aValue = localStorage.getItem('userName');
    var getTimeStamp = localStorage.getItem('TimeStamp');
    var clickCount = localStorage.getItem('countClick');
    document.getElementById('usernm').innerHTML = aValue;
    document.getElementById('useNN').innerHTML = aValue;

    //check username for number of searches in a mintus 
    $scope.disableSeach = false;

    $scope.searchCount = function ()
    {
        localStorage.setItem("countClick", clickCount++);
        console.log(clickCount)
        var reDate = new Date();
        var recordTime = reDate.getTime()
        console.log((recordTime - getTimeStamp) / 1000)
        if (aValue == 'Luke Skywalker')
        {
            //more than 15 click allow in 1min
        }
        else
        {
            // block user search in a one min 
            if ((recordTime - getTimeStamp) / 1000 > 60)
            {
                console.log('jhjh')
                $scope.disableSeach = true;
            }
            else
            {
                if (clickCount == 15)
                {
                    angular.element('#expr').css('display', 'block')
                    $scope.disableSeach = true;
                }
            }
        }

    };

    $scope.searchCount()
    var promise = getAndSendData.getAndSendDataFromServer('https://swapi.co/api/planets/', 0);
    promise.then(function (response) {
        console.log(response)
        $scope.planateDetail = response.results;
        console.log("----------------data-------------------------------")
        console.log($scope.planateDetail)


    }, function (err) {
        console.log("Error occured: " + err);
    });




    $scope.$watchCollection('planateDetail', function (items) {
        $scope.maxPoint = -1; // assuming we won't have negative values
        angular.forEach(items, function (item) {
            if (parseInt(item.population) > $scope.maxPoint) {
                $scope.maxPoint = item.population;
            }
        });
    });
    function Error(msg, css)
    {
        $('.alertMsg').css('display', css);

        $('.alertMsgSet').text(msg);
    }

    $scope.planetDetailsFunction = function (url)

    {
        var promise = getAndSendData.getAndSendDataFromServer(url, 0);
        promise.then(function (response) {
            $('#myModal').modal('show')
            console.log(response)
            $scope.planateDetailView = response;
            console.log("----------------data-------------------------------")
            console.log($scope.planateDetailView)


        }, function (err) {
            console.log("Error occured: " + err);
        });


    }


}
//searching module controller End 


//common angularjs service for get data and set data///
ClientApp.service('getAndSendData', ['$http', '$q', '$location', function ($http, $q, $location) {
        this.getAndSendDataFromServer = function (url, jsonData, loc)
        {
            loading(1);
            console.log(url);
            var data = [];
            var msgContent = "";
            var def = $q.defer();
            if (jsonData == 0)
            {
                $http.get(url).success(function (arr) {
                    console.log(JSON.stringify(arr));
                    data = angular.fromJson(arr);

                    if (data)
                    {
//                        alertwarning("" + msgContent.Result);
                    }
                    def.resolve(data);
                    loading(0);

                })
                        .error(function (err) {
                            console.log(err);
                            if (err.length === 1088)
                            {
                                location.reload();
                            }
                            def.reject(err);
                            loading(0);
//                            alertwarning("Error");
                        });
            }
            else if (jsonData == 1)
            {
                $http.get(url).success(function (rs) {
                    console.log(JSON.stringify(rs));
                    data = angular.fromJson(rs);
                    msgContent = data.MsgContent;
                    if (data)
                    {
//                        alertwarning("" + msgContent.Result);
                    }
                    else
                    {
                        $location.url(loc);
                        def.resolve("OK");
                        alertSucess("Successfully Saved");
                    }
                    def.resolve(data);
                    loading(0);
                })
                        .error(function (err) {
                            console.log("Error occured: " + err);
                            console.log(err.length);
                            def.reject(err);
//                            alertwarning("Error");
                            loading(0);
                        });

            }

            return def.promise;
        };
    }]);




