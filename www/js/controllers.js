var optid = 2;
//var ref = 0;
angular.module('starter.controllers', ['ngAnimate', 'ngCordova', 'starter.services'])

.controller('AppCtrl', function ($scope, $ionicPopover, $timeout, $ionicScrollDelegate, $location, $ionicModal, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, MyServices, $ionicLoading, $interval) {
    $scope.changestatus = 0;
    $scope.demo = "testing";
    $scope.users = [];
    $scope.pageno = 1;
    $scope.keepscrolling = true;
    $scope.search = {};
    $scope.search.text = '';
    var options = {
        maximumImagesCount: 9,
        width: 800,
        height: 800,
        quality: 80,
        //        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true

    };


    $scope.cameraimage = [];

    //	open create attach modal
    $ionicModal.fromTemplateUrl('templates/post.html', {
        id: '3',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.oModal3 = modal;
    });

    $scope.openCreate = function () {
        $scope.oModal3.show();
    }

    $scope.closeCreate = function () {
        $scope.oModal3.hide();
    }
    $ionicModal.fromTemplateUrl('templates/upload.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.oModal2 = modal;
    });

    $ionicModal.fromTemplateUrl('templates/search.html', {
        id: '4',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.oModal4 = modal;
    });

    $scope.openSearch = function () {
        $scope.oModal4.show();
    }

    $scope.closeSearch = function () {
        $scope.oModal4.hide();
    }

    $scope.closeuploadElements = function () {
        $scope.oModal2.hide();
    }



    $scope.loadUser = function (pageno, search) {
        console.log("calling tring tring");
        if ($scope.search.text != "") {
            MyServices.getalluser(pageno, search).success(function (data, status) {

                if (data.queryresult.length == 0) {
                    $scope.keepscrolling = false;
                } else {
                    $scope.keepscrolling = true;
                    _.each(data.queryresult, function (n) {
                        $scope.users.push(n);
                    });

                }
            });
        } else {
            $scope.keepscrolling = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    $scope.onSearchChange = function (search) {
        console.log(search);
        console.log($scope.pageno);
        $scope.users = [];
        $scope.pageno = 1;
        $scope.loadUser(1, search.text);

    }



    $scope.loadMoreUsers = function () {
        console.log("in load more");
        $scope.loadUser(++$scope.pageno, $scope.search.text);

    }

    $scope.toUser = function (user) {
        $scope.closeSearch();
        $location.url("/tab/dash-userdetails/" + user);
    }

    //	open upload $ionicPopover element

    $ionicPopover.fromTemplateUrl('templates/upload.html', {
        scope: $scope,
    }).then(function (popover1) {
        $scope.popover1 = popover1;
    });


    $scope.options = [{
        id: 1,
        text: "",
        status: false
    }, {
        id: 2,
        text: "",
        status: false
    }];

    $scope.opt = {
        text: "",
        status: false
    };
    $scope.onChangeAdd = function (index) {
        console.log("index is");
        console.log(index);
        if ($scope.options.length - 1 == index) {
            console.log("id is");
            console.log($scope.options.length + 1);
            $scope.options.push({
                id: $scope.options.length + 1,
                text: "",
                status: false
            });
        }
        console.log($scope.options);
    }

    $scope.openUploadElements = function () {
        $scope.oModal2.show();
    }


    //	pick image from gallery
    $scope.picFromGallery = function () {
        console.log("picture");
        $cordovaImagePicker.getPictures(options).then(function (resultImage) {
            // Success! Image data is here
            _.forEach(resultImage, function (n, key) {
                $scope.cameraimage.push({
                    status: false,
                    image: n
                });
            });

            console.log($scope.cameraimage);
        }, function (err) {
            // An error occured. Show a message to the user
        });

    };

    //	camera image

    $scope.clickPhoto = function () {

        $cordovaCamera.getPicture({
            quality: 80,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true
        }).then(function (imageData) {
            $scope.cameraimage.push({
                status: false,
                image: imageData
            });
            console.log($scope.cameraimage);
            $cordovaFileTransfer.upload(adminurl + "imageuploadproduct", imageData, {})
                .then(function (result) {
                    console.log(result);
                    var data = JSON.parse(result.response);
                    callback(data);
                }, function (err) {
                    console.log(err);
                }, function (progress) {
                    console.log("progress");
                });

            console.log(imageData);
        }, function (err) {
            // error
        });

    }




    var stopinterval = 0;

    var checkfb = function (data, status) {
        console.log(data);
        if (data.value == null) {
            console.log("Do nothing");
        } else {
            ref.close();
            if (data.value == "SUCCESS") {
                if (data.type == "Facebook") {
                    $scope.facebookPhoto();
                }
                if (data.type == "Instagram") {
                    $scope.instagramPhoto();
                }
            }
            $interval.cancel(stopinterval);
        }
    }

    var callAtIntervalfb = function () {
        MyServices.checkLogid($scope.facebooklogid).success(checkfb);
    };



    $scope.facebookPhoto = function () {
        console.log("Data");
        $scope.toPushSocial = [];
        $ionicLoading.show({
            template: 'Loading...'
        });

        MyServices.checkLogin("Facebook").success(
            function (data, status) {
                console.log(data);
                if (data.value) {
                    MyServices.getFacebookImages().success(function (data) {
                        console.log(data);
                        $ionicLoading.hide();
                        $scope.socialimages = [];
                        _.each(data, function (n) {
                            $scope.socialimages.push({
                                url: n,
                                status: false
                            });
                        });

                        $scope.showimages = true;
                        //                            $scope.socialimagesrow = partitionarray($scope.socialimages, 3);
                    });
                } else {
                    $ionicLoading.hide();
                    $scope.socialimages = [];
                    $scope.facebooklogid = data.id;
                    $scope.facebookLogin("Facebook");
                }
            }
        );
    };


    $scope.facebookLogin = function (provider) {
        ref = window.open(adminhauth + 'login/' + provider + '?logid=' + $scope.facebooklogid, '_blank', 'location=no');
        stopinterval = $interval(callAtIntervalfb, 1000);
        ref.addEventListener('exit', function (event) {
            $interval.cancel(stopinterval);
        });
    };


    $scope.poll = {};
    $scope.poll.status = true;
    $scope.createAttach = function () {
        $scope.poll.id = $.jStorage.get("user").id;
        $scope.poll.images = $scope.cameraimage;
        if ($scope.poll.status == false) {
            $scope.poll.status = 0;
        } else {
            $scope.poll.status = 1;
        }
        $scope.options.pop();
        $scope.poll.options = $scope.options;
        MyServices.createAttach($scope.poll).success(function (data, status) {
            $scope.closeCreate();
            window.location.reload();
            $location.url("/tab/dash");

        });
    };
})

.controller('DashCtrl', function ($scope, $ionicPopover, $timeout, $ionicScrollDelegate, $location, $ionicModal, MyServices, $cordovaSocialSharing) {

    ion.sound({
        sounds: [
            {
                name: "water_droplet_3"
        }
    ],
        volume: 0.5,
        path: "lib/js/ion-sound/sounds/",
        preload: true
    });

    $scope.feeds = [];
    $scope.isfavactive = false;
    $scope.favactive = "";
    $scope.shownoappliance = false;
    $scope.showloading = true;
    $scope.pageno = 1;
    $scope.keepscrolling = true;
    //		polls(1);

    if (!$.jStorage.get("user")) {
        $location.url("/login");
    }

    $scope.pollRefresh = function (page) {
        if (page == 1) {
            $scope.feeds = [];
        }
        MyServices.getallpolls(page).success(function (data, status) {
            console.log(data.queryresult);
            if (page == 1) {
                ion.sound.play("water_droplet_3");
            }
            if (data.queryresult.length == 0 && $scope.feeds.length == 0) {
                $scope.showloading = false;
                $scope.shownoappliance = true;
                $scope.keepscrolling = false;
            } else if (data.queryresult.length == 0) {
                $scope.keepscrolling = false;
            } else {
                $scope.showloading = false;
                $scope.keepscrolling = true;
                _.each(data.queryresult, function (n) {
                    if (n.favid != 0) {
                        n.isfav = "favactive";
                    } else {
                        n.isfav = "";
                    }
                    if (n.images != null) {
                        n.images = n.images.split(',');
                    }
                    if (n.share != null) {
                        console.log(n.share);
                        n.video = n.name;
                        MyServices.getprofiledetailsshare(n.share).success(function (data, status) {
                            console.log(data);
                            n.user = data.id;
                            n.name = data.name;
                            n.image = data.image;
                        })
                    }

                    $scope.feeds.push(n);
                })


            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');
        });

    }

    $scope.pollRefresh($scope.pageno);
    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
        //        $scope.popover.show($event);

        $cordovaSocialSharing
            .share("testing", "test") // Share via native share sheet
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured. Show a message to the user
            });
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });


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

    $scope.openuserdetail = function (uid) {
        if (uid == $.jStorage.get("user").id) {
            $location.url("/tab/account");
        } else {
            $location.url("/tab/dash-userdetails/" + uid);
        }

    }

    $scope.markasfav = function (feed) {
        if (feed.isfav == "") {
            feed.isfav = "favactive";
            MyServices.addtofavourites(feed.id).success(
                function (data, status) {
                    console.log(data);
                });
        } else {
            feed.isfav = "";
            MyServices.deletefavourites(feed.favid).success(
                function (data, status) {
                    console.log(data);
                });
        }

    };

    $scope.loadMorePolls = function () {
        console.log("loadmore");
        $scope.pollRefresh(++$scope.pageno);
    }

    $scope.sharepoll = function (shareid, pollid) {
        console.log(shareid + "   " + pollid);
        MyServices.shareuserpoll(shareid, pollid).success(
            function (data, status) {
                console.log(data);
                $scope.pollRefresh(1);
            });
    }

})

.controller('LoginCtrl', function ($scope, $location, $interval, MyServices) {

    $.jStorage.flush();

    MyServices.logout().success(function (data, status) {

    });

    var authenticatesuccess = function (data, status) {
        console.log(data);
        if (data != "false") {
            $.jStorage.set("user", data);
            user = data;
            $location.url("/tab/dash");
        } else {
            console.log("stay here");
        };
    };

    //    MyServices.authenticate().success(authenticatesuccess);

    var checktwitter = function (data, status) {
        if (data != "false") {
            console.log("Facebook Login");
            $interval.cancel(stopinterval);
            ref.close();
            MyServices.authenticate().success(authenticatesuccess);
        } else {
            console.log("Do nothing");
        }
    };

    var callAtIntervaltwitter = function () {
        MyServices.authenticate().success(checktwitter);
    };

    $scope.twitterlogin = function () {
        console.log("in twitter");

        ref = window.open(adminhauth + 'login/Twitter', '_blank', 'location=no');
        stopinterval = $interval(callAtIntervaltwitter, 2000);
        ref.addEventListener('exit', function (event) {
            MyServices.authenticate().success(authenticatesuccess);
            $interval.cancel(stopinterval);
        });
        //        $location.url("/tab/dash");
    }
    $scope.instalogin = function () {

        ref = window.open(adminhauth + 'login/Instagram?returnurl=http://www.wohlig.com', '_blank', 'location=no');
        stopinterval = $interval(callAtIntervaltwitter, 2000);
        ref.addEventListener('exit', function (event) {
            MyServices.authenticate().success(authenticatesuccess);
            $interval.cancel(stopinterval);
        });
        //        $location.url("/tab/dash");
    }
    $scope.googlelogin = function () {

        ref = window.open(adminhauth + 'login/Google?returnurl=http://www.wohlig.com', '_blank', 'location=no');
        stopinterval = $interval(callAtIntervaltwitter, 2000);
        ref.addEventListener('exit', function (event) {
            MyServices.authenticate().success(authenticatesuccess);
            $interval.cancel(stopinterval);
        });
        //        $location.url("/tab/dash");
    }
    $scope.fblogin = function () {

        ref = window.open(adminhauth + 'login/Facebook?returnurl=http://www.wohlig.com', '_blank', 'location=no');
        stopinterval = $interval(callAtIntervaltwitter, 2000);
        ref.addEventListener('exit', function (event) {
            MyServices.authenticate().success(authenticatesuccessauthenticatesuccess);
            $interval.cancel(stopinterval);
        });
        //        $location.url("/tab/dash");
    }
})

.controller('ChatsCtrl', function ($scope, MyServices) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    //    $scope.chats = Chats.all();

    $scope.followers = {};

    $scope.remove = function (chat) {
        Chats.remove(chat);
    };

    //    $scope.followers = [{
    //        name: "Sohan"
    //    }, {
    //        name: "Mahesh"
    //    }, {
    //        name: "Vignesh"
    //    }];

    MyServices.userfollowing().success(function (data, status) {
        console.log(data);
        $scope.followers = data;
    })
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, MyServices) {
    $scope.chat = MyServices.get($stateParams.chatId);
})

.controller('DashDetailCtrl', function ($scope, $stateParams, MyServices, $ionicPopover, $location) {

    $scope.comment = {};
    $scope.comments = [];
    $scope.feeds = [];
    $scope.loading = true;
    $scope.per = 0;
    $scope.count = 0;
    $scope.feeddetail = {};
    $scope.reloadFeeds = function () {
        MyServices.getsingleuserpoll($stateParams.chatId).success(function (data, status) {
            console.log(data);
            $scope.feeds = [];
            $scope.count = 0;
            $scope.per = 0;
            if (data.userpolldetail.share != null) {
                data.userpolldetail.video = data.userpolldetail.name;
                MyServices.getprofiledetailsshare(data.userpolldetail.share).success(function (data2, status) {
                    console.log(data2);
                    data.userpolldetail.id = data2.id;
                    data.userpolldetail.name = data2.name;
                    data.userpolldetail.image = data2.image;
                })
            }

            $scope.feeddetail = data;
            _.forEach(data.poll_options, function (n, key) {
                $scope.count = $scope.count + parseInt(n.pollcount.count);
            });

            _.forEach(data.poll_options, function (n, key) {
                $scope.per = (parseInt(n.pollcount.count) / $scope.count) * 100;
                console.log($scope.per);
                if (n.pollcount.count == 0) {
                    $scope.feeds.push({
                        name: n.text,
                        y: 0 + "%"
                    });
                } else {
                    $scope.feeds.push({
                        name: n.text,
                        y: $scope.per + "%"
                    });
                }
            });
            $scope.feeds2 = $scope.feeds;
            console.log($scope.feeds);
        });

        MyServices.getalluserpollcomment($stateParams.chatId).success(function (data, status) {
            console.log("comments");
            console.log(data);
            if (data.queryresult == '') {
                $scope.loading = false;
            } else {
                $scope.loading = NaN;
                $scope.comments = data.queryresult;
            }

        });
    }


    $scope.reloadFeeds();

    $scope.openuserdetail = function (uid) {
        $location.url("/tab/dash-userdetails/" + uid);
    }

    $scope.voteMe = function (but) {
        console.log(but);
        MyServices.vote(but.optionid, $stateParams.chatId).success(function (data, status) {
            console.log(data);
            $scope.reloadFeeds();
        });
    }

    //create comment
    $scope.allvalidation = [];
    $scope.createComment = function () {
        $scope.comment.userpoll = $stateParams.chatId;
        $scope.allvalidation = [{
            field: $scope.comment.content,
            validation: ""
        }];

        var check = formvalidation($scope.allvalidation);
        if (check) {
            MyServices.createuserpollcomment($scope.comment).success(function (data, status) {
                console.log(data);
                if (data) {
                    $scope.comment.hide();
                    $scope.reloadFeeds();
                };
            });
        }
    }

    $scope.feed = [{
        "name": "Microsoft Internet Explorer",
        "y": 96.33,

    }, {
        "name": "Chrome",
        "y": 24.03,

    }, {
        "name": "Firefox",
        "y": 10.38,

    }, {
        "name": "Safari",
        "y": 4.77,

    }, {
        "name": "Opera",
        "y": 0.91,

    }, {
        "name": "Proprietary or Undetectable",
        "y": 0.2,
    }];

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
        //        $scope.popover.show($event);
        $cordovaSocialSharing
            .share("testing", "test") // Share via native share sheet
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured. Show a message to the user
            });
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };


    $ionicPopover.fromTemplateUrl('templates/comment.html', {
        scope: $scope
    }).then(function (comment) {
        $scope.comment = comment;
    });

    $scope.openComment = function ($event) {
        $scope.comment.show($event);
    };
    $scope.closeComment = function () {
        $scope.comment.hide();
    };
})

.controller('AccountCtrl', function ($scope, $ionicPopover, $timeout, $ionicScrollDelegate, $location, $ionicModal, MyServices, $ionicPopup) {

    //get user
    $scope.user = [];
    $scope.demo = "testing";
    $scope.isfavactive = false;
    $scope.favouritefeeds = [];
    $scope.tabvalue = 1;
    $scope.loading = true;
    $scope.loadingpost = true;
    $scope.editFeed = [];
    $scope.editProf = {};
    $scope.pageno = 1;
    $scope.pagenopoll = 1;
    $scope.keepscrolling = true;
    $scope.keepscrollingpolls = true;
    $scope.feeds = [];

    $scope.changetab = function (tab) {
        $scope.tabvalue = tab;
    }

    $scope.editAttach = function (editFeed) {
        editFeed.iduserid = $.jStorage.get("user").id;
        editFeed.pollid = editFeed.id;
        //        editFeed.images = $scope.cameraimage;
        if (editFeed.shouldhaveoption == false) {
            editFeed.status = 0;
        } else {
            editFeed.status = 1;
        }
        MyServices.editPoll(editFeed).success(function (data, status) {
            $scope.comment.hide();
            window.location.reload();

        });
    }

    MyServices.getprofiledetails().success(function (data, status) {
        $scope.user = data;
        $scope.editProf = data;
    });

    MyServices.sharecount().success(function (data, status) {
        console.log("sharecount=" + data.sharecount);
        $scope.sharecount = data.sharecount;
    })

    $scope.getfavs = function (page) {
        console.log(page);
        MyServices.getuserfavourites(page).success(function (data, status) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            console.log(data);
            _.each(data.queryresult, function (n) {
                $scope.favouritefeeds.push(n);
            })

            if (data.queryresult.length == 0 && $scope.favouritefeeds.length == 0) {
                $scope.loading = false;
                $scope.keepscrolling = false;
            } else if (data.queryresult.length == 0) {
                $scope.keepscrolling = false;
            } else {
                $scope.loading = NaN;
                $scope.keepscrolling = true;
            }

            //            if (data.queryresult == '') {
            //                $scope.loading = false;
            //            } else if (data.queryresult.length == 0) {
            //                $scope.keepscrolling = false
            //            } else {
            //                $scope.loading = NaN;
            //            }
        })
    }

    $scope.getfavs($scope.pageno);

    $scope.pollRefresh = function (page) {
        MyServices.getalluserpoll(page).success(function (data, status) {
            if (page == 1)
                $scope.feeds = [];
            $scope.$broadcast('scroll.infiniteScrollComplete');
            _.each(data.queryresult, function (n) {
                if (n.favid != 0) {
                    n.isfav = "favactive";
                } else {
                    n.isfav = "";
                }
                if (n.images != null) {
                    n.images = n.images.split(',');
                }
                if (n.share != null) {
                    console.log(n.share);
                    n.video = n.name;
                    MyServices.getprofiledetailsshare(n.share).success(function (data, status) {
                        console.log(data);
                        n.user = data.id;
                        n.name = data.name;
                        n.image = data.image;
                    })
                }
                $scope.feeds.push(n);
            })

            if (data.queryresult.length == 0 && $scope.feeds.length == 0) {
                $scope.loadingpost = false;
                $scope.keepscrollingpolls = false;
            } else if (data.queryresult.length == 0) {
                $scope.keepscrollingpolls = false;
            } else {
                $scope.loadingpost = NaN;
                $scope.keepscrollingpolls = true;
            }
            console.log($scope.feeds);
        });
    }

    $scope.pollRefresh($scope.pagenopoll);

    $scope.settings = {
        enableFriends: true
    };

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
        //        $scope.popover.show($event);
        $cordovaSocialSharing
            .share("testing", "test") // Share via native share sheet
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured. Show a message to the user
            });
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });

    //	open create attach modal
    $ionicPopover.fromTemplateUrl('templates/editpost.html', {
        scope: $scope
    }).then(function (comment) {
        $scope.comment = comment;
    });

    $scope.openEdit = function (feed) {
        $scope.comment.show();
        console.log(feed);
        $scope.editFeed = feed;
        if (feed.shouldhaveoption == 1) {
            $scope.editFeed.shouldhaveoption = true;
        } else {
            $scope.editFeed.shouldhaveoption = false;
        }
        $.jStorage.set("feed", $scope.editFeed);
    }

    $scope.closeEdit = function () {
        $scope.comment.hide();
    }

    $scope.deletePost = function (pollid) {

        var myPopup = $ionicPopup.show({
            //            template: 'Are you sure you want to delete?',
            title: 'Are you sure you want to delete?',
            //            subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [{
                    text: 'Yes',
                    type: 'button-positive',
                    onTap: function () {
                        return true;
                    }
                },
                {
                    text: 'No',
                    type: 'button-positive',
                    onTap: function () {
                        return false;
                    }
                }]
        });
        myPopup.then(function (res) {
            console.log('Tapped!', res);
            if (res) {
                MyServices.deleteuserpoll(pollid).success(function (data, status) {
                    console.log(data);
                    $scope.pollRefresh(1);
                })
            }
        });
    }

    $scope.changemorepost = function (feed, index) {
        var indexno = index;
        var idtomove = "more";
        feed.more = !feed.more;
        if (feed.more) {
            var height = $("ion-item").eq(indexno).children('.item-content').children(".contentright").children(".more").children(".more-content").height();
            //            var height = $("ion-item").eq(indexno).children(".contentright").children(".more").children(".more-content").height();
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
        $location.url("/tab/account/" + id);
    }

    $ionicModal.fromTemplateUrl('templates/upload.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.oModal2 = modal;
    });

    $scope.openUploadElements = function () {
        $scope.oModal2.show();
    }

    $scope.closeuploadElements = function () {
        $scope.oModal2.hide();
    }

    //	open edit profile modal
    $ionicModal.fromTemplateUrl('templates/editprofile.html', {
        id: '3',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.oModal1 = modal;
    });

    $scope.openEditProfile = function () {
        $scope.oModal1.show();
    }

    $scope.closeEditProfile = function () {
        $scope.oModal1.hide();
    }

    $scope.saveProfile = function (profile) {
        console.log(profile);
        MyServices.editprofile(profile).success(function (data, status) {
            console.log(data);
            $scope.oModal1.hide();
        })
    }

    $scope.markasfav = function (feed) {
        if (feed.isfav == "") {
            feed.isfav = "favactive";
        } else {
            feed.isfav = "";
        }
    };

    $scope.loadMoreFavourites = function () {
        console.log("loadmore");
        $scope.getfavs(++$scope.pageno);
    }

    $scope.loadMorePolls = function () {
        console.log("loadmore");
        $scope.pollRefresh(++$scope.pagenopoll);
    }

})

.controller('UserDetailCtrl', function ($scope, $ionicPopover, $stateParams, $timeout, $ionicScrollDelegate, $location, $ionicModal, MyServices) {

    //	$scope.follow = false;
    $scope.feeds = [];
    $scope.favouritefeeds = [];
    $scope.user = [];
    $scope.loading = true;
    $scope.loadingpost = true;
    $scope.keepscrolling = true;
    $scope.keepscrollingpolls = true;
    $scope.pageno = 1;
    $scope.pagenopoll = 1;

    $scope.tabvalue = 1;
    $scope.changetab = function (tab) {
        $scope.tabvalue = tab;
    }

    $scope.reloadFunction = function () {

        MyServices.userdetails($stateParams.userid).success(function (data, status) {
            $scope.user = data;

            if (data.queryresult == '') {
                $scope.loading = false;
            } else {
                $scope.loading = NaN;
            }

            $scope.follow = data.isfollowed;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.pollRefresh = function (page) {
        MyServices.getotheruserpoll($stateParams.userid, page).success(function (data, status) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            console.log(data);
            _.each(data.queryresult, function (n) {
                $scope.feeds.push(n);
            })

            //            if (data.queryresult == '') {
            //                $scope.loadingpost = false;
            //            } else {
            //                $scope.loadingpost = NaN;
            //                $scope.feeds = data.queryresult;
            //            }

            if (data.queryresult.length == 0 && $scope.feeds.length == 0) {
                $scope.loadingpost = false;
                $scope.keepscrollingpolls = false;
            } else if (data.queryresult.length == 0) {
                $scope.keepscrollingpolls = false;
            } else {
                $scope.loadingpost = NaN;
                $scope.keepscrollingpolls = true;
            }

        });
    }

    $scope.pollRefresh($scope.pagenopoll);

    $scope.getfavs = function (page) {
        MyServices.getotheruserfavourites($stateParams.userid, page).success(function (data, status) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            console.log("fav fav fav");
            console.log(data);
            _.each(data.queryresult, function (n) {
                $scope.favouritefeeds.push(n);
            })

            console.log($scope.favouritefeeds);
            //            if (data.queryresult == '') {
            //                $scope.loading = false;
            //            } else {
            //                $scope.loading = NaN;
            //                $scope.favouritefeeds = data.queryresult;
            //            }

            if (data.queryresult.length == 0 && $scope.favouritefeeds.length == 0) {
                $scope.loading = false;
                $scope.keepscrolling = false;
            } else if (data.queryresult.length == 0) {
                $scope.keepscrolling = false;
            } else {
                $scope.loading = NaN;
                $scope.keepscrolling = true;
            }

        });
    }

    $scope.getfavs($scope.pageno);


    $scope.reloadFunction();

    $scope.changemore = function (feed, index) {
        var indexno = index;
        var idtomove = "more";
        feed.more = !feed.more;
        if (feed.more) {
            var height = $("ion-item").eq(indexno).children('.item-content').children(".contentright").children(".more").children(".more-content").height();
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

    $scope.followme = function () {
        if ($scope.follow == false) {
            MyServices.userfollow($stateParams.userid).success(function (data, status) {
                console.log(data);
                $scope.follow = true;

            });
        } else {
            MyServices.userunfollow($stateParams.userid).success(function (data, status) {
                console.log(data);
                $scope.follow = false;

            });
        }
    }

    $scope.loadMoreFavourites = function () {
        console.log("loadmore");
        $scope.getfavs(++$scope.pageno);
    }

    $scope.loadMorePolls = function () {
        console.log("loadmore");
        $scope.pollRefresh(++$scope.pagenopoll);
    }

})