var adminbase = "http://wohlig.co.in/attachbackend/";
var adminbase = "http://localhost/attachbackend/";
var adminbase = "http://192.168.2.9/attachbackend/";
var adminurl = adminbase + "index.php/json/";
var adminhauth = adminbase + "index.php/hauth/";

var foods = [];

angular.module('starter.services', [])
    .factory('MyServices', function ($http) {
        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            },
            checkLogin: function (type) {
                //		   return $http.get(adminhauth + "checkLogin?type="+type);
                return $http({
                    url: adminhauth + 'checkLogin',
                    method: "POST",
                    data: {
                        'type': type
                    }
                });
            },
            getFacebookImages: function () {

                return $http.get(adminhauth + "getFacebookImages");
            },
            getInstagramImages: function () {
                return $http.get(adminhauth + "getInstagramImages");
            },
            logout: function () {
                return $http.get(adminbase + "index.php/json/logout");
            },
            getsingleuserpoll: function (id) {
                return $http.get(adminurl + "getsingleuserpoll?id=" + id);
            },
            getalluser: function (pageno, search) {
                return $http.get(adminurl + "getalluser?pageno=" + pageno + "&search=" + search);
            },
            getprofiledetails: function () {
                return $http.get(adminurl + "getprofiledetails?id=" + $.jStorage.get("user").id);
            },
            getalluserpoll: function (page) {
                return $http.get(adminurl + "getalluserpoll?id=" + $.jStorage.get("user").id + "&pageno=" + page);
            },
            getotheruserpoll: function (id, page) {
                return $http.get(adminurl + "getalluserpoll?id=" + id + "&pageno=" + page);
            },
            createuserpollcomment: function (comment) {
                return $http({
                    url: adminurl + 'createuserpollcomment',
                    method: "POST",
                    data: {
                        'user': $.jStorage.get("user").id,
                        'userpoll': comment.userpoll,
                        'content': comment.content
                    }
                });
            },
            getalluserpollcomment: function (pollid) {
                return $http({
                    url: adminurl + 'getalluserpollcomment',
                    method: "POST",
                    data: {
                        'id': pollid
                    }
                });
            },
            userfollow: function (userfollowed) {
                return $http({
                    url: adminurl + 'userfollow',
                    method: "POST",
                    data: {
                        'user': $.jStorage.get("user").id,
                        'userfollowed': userfollowed
                    }
                });
            },
            userunfollow: function (userfollowed) {
                return $http({
                    url: adminurl + 'userunfollow',
                    method: "POST",
                    data: {
                        'user': $.jStorage.get("user").id,
                        'userfollowed': userfollowed
                    }
                });
            },
            getallpolls: function (pageno) {
                return $http.get(adminurl + "getallpolls?id=" + $.jStorage.get("user").id + "&pageno=" + pageno);
            },
            createAttach: function (poll) {
                return $http({
                    url: adminurl + 'createuserpoll',
                    method: "POST",
                    data: poll
                });
            },
            editPoll: function (poll) {
                return $http({
                    url: adminurl + 'edituserpoll',
                    method: "POST",
                    data: poll
                });
            },
            authenticate: function () {
                return $http({
                    url: adminurl + 'authenticate',
                    method: "POST"
                });
            },
            checkLogid: function (logid) {
                return $http.get(adminhauth + "checkLogid", {
                    params: {
                        logid: logid
                    }
                });
            },
            addtofavourites: function (pollid) {
                return $http({
                    url: adminurl + 'createuserpollfavourites',
                    withCredentials: true,
                    method: "POST",
                    data: {
                        "pollid": pollid,
                        "userid": $.jStorage.get("user").id
                    }
                });
            },
            deletefavourites: function (favid) {
                return $http({
                    url: adminurl + 'deleteuserpollfavourites',
                    withCredentials: true,
                    method: "POST",
                    data: {
                        "id": favid,
                    }
                });
            },
            userdetails: function (pollid) {
                return $http({
                    url: adminurl + 'userdetails',
                    withCredentials: true,
                    method: "POST",
                    data: {
                        "followid": pollid,
                        "userid": $.jStorage.get("user").id
                    }
                });
            },
            vote: function (option, poll) {
                return $http({
                    url: adminurl + 'createuserpollresponse',
                    withCredentials: true,
                    method: "POST",
                    data: {
                        "option": option,
                        "poll": poll,
                        "user": $.jStorage.get("user").id
                    }
                });
            },
            getuserfavourites: function (page) {
                return $http.get(adminurl + "getfavouriteuserpolls?userid=" + $.jStorage.get("user").id + "&pageno=" + page);
            },
            getotheruserfavourites: function (user, page) {
                return $http.get(adminurl + "getfavouriteuserpolls?userid=" + user + "&pageno=" + page);
            },
            editprofile: function (profile) {
                return $http({
                    url: adminurl + 'editprofile',
                    withCredentials: true,
                    method: "POST",
                    data: {
                        "id": $.jStorage.get("user").id,
                        "name": profile.name,
                        "location": profile.address,
                        "website": profile.website
                    }
                });
            },
            deleteuserpoll: function (pollid) {
                return $http({
                    url: adminurl + 'deleteuserpoll',
                    withCredentials: true,
                    method: "POST",
                    data: {
                        "pollid": pollid
                    }
                });
            },
            shareuserpoll: function (shareid, pollid) {
                return $http({
                    url: adminurl + 'shareuserpoll',
                    withCredentials: true,
                    method: "POST",
                    data: {
                        "share": shareid,
                        "userid": $.jStorage.get("user").id,
                        "pollid": pollid
                    }
                });
            },
            userfollowing: function () {
                return $http.get(adminurl + "userfollowing?id=" + $.jStorage.get("user").id);
            },
            getprofiledetailsshare: function (id) {
                return $http.get(adminurl + "getprofiledetails?id=" + id);
            },
            sharecount: function () {
                return $http.get(adminurl + "sharecount?id=" + $.jStorage.get("user").id);
            }
        };
    });