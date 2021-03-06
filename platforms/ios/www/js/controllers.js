var optid = 2;
angular.module('starter.controllers', ['ngAnimate'])

.controller('AppCtrl', function ($scope, $ionicPopover, $timeout, $ionicScrollDelegate, $location, $ionicModal ) {
	$scope.changestatus = 0;
	$scope.demo = "";
	
//	open create attach modal
	 $ionicModal.fromTemplateUrl('templates/post.html', {
        id: '3',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal3 = modal;
    });
	
	$scope.openCreate = function(){
		$scope.oModal3.show();
	}
	
	$scope.closeModal = function(){
		$scope.oModal3.hide();
	}
	
	
//	open upload $ionicPopover element
	
    $ionicPopover.fromTemplateUrl('templates/upload.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });
	
	
	$scope.options = [
		{
			id: 1,
			text: "",
			status: false
		},{
			id: 2,
			text: "",
			status: false
		}
	];
	
	$scope.opt = {
			text: "",
			status: false
		};
	$scope.onChangeAdd = function(index){
		console.log("index is");
		console.log(index);
		if($scope.options.length - 1 == index){
			console.log("id is");
			console.log($scope.options.length + 1);
			$scope.options.push({
				id:$scope.options.length + 1,
			text: "",
			status: false
		});
		}
		console.log($scope.options);
	}
	
	$scope.openUploadElements = function(){
		$scope.popover.show();
	}
	
})
.controller('DashCtrl', function ($scope, $ionicPopover, $timeout, $ionicScrollDelegate, $location, $ionicModal) {
	
    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
	

    $scope.feeds = [
        {
            id: 1,
            name: "Justin Taylor",
            nameat: "@JustinGraphitas",
            image: "img/Spring-Lamb.-Image-shot-2-011.jpg",
            more: false,
            height: 0,
            series: [{
                name: 'Jane',
                data: [1, 0, 4]
            }, {
                name: 'John',
                data: [5, 7, 3]
            }]
        },
        {
            id: 2,
            name: "Other",
            nameat: "@JustinGraphitas",
            image: "img/Spring-Lamb.-Image-shot-2-011.jpg",
            more: false,
            height: 0,
            series: [{
                name: 'Jane',
                data: [1, 0, 4]
            }, {
                name: 'John',
                data: [5, 7, 3]
            }]
        }
    ];
    $scope.changemore = function (feed, index) {
        var indexno = index;
        var idtomove = "more";
        feed.more = !feed.more;
        if (feed.more) {
            var height = $("ion-item").eq(indexno).children(".contentright").children(".more").children(".more-content").height();
            feed.height = height;
            console.log(height);
        } else {
            idtomove = "item"
            feed.height = 0;
        }

        $timeout(function () {
            $ionicScrollDelegate.resize();
            $location.hash(idtomove + index);
            console.log($location.hash());
            $ionicScrollDelegate.anchorScroll(true, 4000);
        }, 1000)
    };
    $scope.opendetail = function (id) {
        $location.url("/tab/dash/" + id);
    }
})

.controller('LoginCtrl', function ($scope) {})

.controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('DashDetailCtrl', function ($scope, $stateParams, Chats, $ionicPopover) {
    $scope.chat = Chats.get($stateParams.chatId);
    $scope.feed = {
        id: 1,
        name: "Justin Taylor",
        nameat: "@JustinGraphitas",
        image: "img/Spring-Lamb.-Image-shot-2-011.jpg",
        more: false,
        height: 0,
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
            }, {
            name: 'John',
            data: [5, 7, 3]
            }]
    };

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
});