'use strict';

angular.module('myApp.view1', ['ngRoute','ui.bootstrap','ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope','$http','$q',function($scope,$http,$q) {

        $scope.allTotes = [];
        $scope.toteResponse;
        $scope.alertMsg;

        navigator.serviceWorker.addEventListener('message', $scope.messageHandler);

        $scope.messageHandler = function (event) {
            console.log('######################### MSG IN VIEW1 ' + event.data.toteResponse);
            if(event.data.toteResponse) {
                $scope.alertMsg = event.timeStamp + " - " + event.data.toteResponse;
                $scope.toteResponse = event.timeStamp + " - " + event.data.toteResponse;
                $scope.$digest();
            }
        }

        $scope.setToteResponse = function(toteRes){
            $scope.toteResponse = toteRes;
            $scope.allTotes.push($scope.toteResponse);
        }

        $scope.$watch(
            "toteResponse",
            function handleFooChange( newValue, oldValue ) {
                console.log( "toteResponse : ", newValue );
            }
        );

        $scope.$watch(
            "alerts",
            function handleFooChange( newValue, oldValue ) {
                console.log( "alerts : ", newValue );
            }
        );

      $scope.toteLabel = ""

      $scope.toteDetails = function() {
          //$scope.alerts = [];
        $http({
          method: 'GET',
          url: "/tote/" + $scope.toteLabel
        }).then(function successCallback(response) {
          //$scope.toteResponse = response.data;
          //  $scope.allTotes.push($scope.toteResponse);
          //  var t = typeof $scope.toteResponse;
          //  console.log("--------- Size -- " + $scope.allTotes.length + ", " + t + ", " )
          //  $scope.addAlert();
        }, function errorCallback(response) {
          console.log(response)
        });
      };


    }]);


/*{"task_id":"18539","putlist_details":{"storage_area":"store","floor_no":"1","storage_zone":"inward_bulk",
"tote_ageging":1458302646,"assigned_to":"sawrav.roy","putitem_details":[{"wid":"A10262","wsn":null,"quantity_put":0,
"quantity_remaining":8}],"is_fragile":false,"is_dangerous":false,"total_qty":8},"picklist_details":null}
 */