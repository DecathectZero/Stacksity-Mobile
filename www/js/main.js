//refers to when someone clicks on a post in a feed to view comments, checks to make sure a postbox isn't already open, since only one jqm page is available
function postOpen(type){
    if(!postbox){
        changepage = true;
        postbox = true;
        postype = type;
        $.mobile.changePage(
            "#postpage",
            {
                transition: 'slideup',
                showLoadMsg : false
            }
        );
    }
}

/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */
function pullToRefresh(element, func) {

    var shareWrapH = 100,
        translateVal,
    // friction factor
        friction = 2.5,
    // distance in px needed to push down the menu in order to be able to share
        triggerDistance = 150,
    // touch events: position of the initial touch (y-axis)
        rotate = element.children(".pullRefresh").children(),
        firstTouchY, initialScroll, real = false;

    function scrollY() { return element.parent().scrollTop() }

    // from http://www.sberry.me/articles/javascript-event-throttling-debouncing
    function throttle(fn, delay) {
        var allowSample = true;

        return function(e) {
            if (allowSample) {
                allowSample = false;
                setTimeout(function() { allowSample = true; }, delay);
                fn(e);
            }
        };
    }

    function init() {
        element.on('touchstart', touchStart);
        element.on('touchmove', touchMove);
        element.on('touchend', touchEnd);
    }

    function touchStart(ev) {

        // make sure the element doesnt have the transition class (added when the user releases the touch)
        firstTouchY = parseInt(ev.originalEvent.touches[0].pageY);
        initialScroll = scrollY();
        element.removeClass('container--reset');
    }

    function touchMove(ev) {
        if(scrollY()<1){
            var moving = function() {
                //alert(firstTouchY);
                //alert(ev.originalEvent.touches[0].pageY);
                var touchY = parseInt(ev.originalEvent.touches[0].pageY),
                    touchYDelta = touchY - firstTouchY - initialScroll;

                if (touchYDelta > 0  ) {
                    ev.preventDefault();
                }

                if ( scrollY() === 0 && touchYDelta < 0 ) {
                    firstTouchY = touchY;
                    return;
                }

                //alert(touchYDelta + " | " + friction+ " | " +shareWrapH);
                // calculate the distance the container needs to be translated
                translateVal = -shareWrapH + touchYDelta/friction;

                $("#yoloswag").prepend(touchY + " | " + firstTouchY + " | " + translateVal +" | " + initialScroll +"<br>");
                // set the transform value for the container
                setContentTransform();

                // show the selected sharing item if touchYDelta > triggerDistance
                if( touchYDelta > triggerDistance ) {
                    real = true;
                    rotate.css("-webkit-transform","rotateZ( -180deg )");
                    rotate.css("transform","rotateZ( -180deg )");
                }
                else {
                    real = false;
                }
            };

            throttle(moving(), 60);
        }
    }

    function touchEnd(ev) {
        if(scrollY()<1){
            if( real ) {
                real = false;
                // after expanding trigger the share functionality
                setTimeout(function(){
                    rotate.css("-webkit-transform",'rotateZ( 0deg )');
                    rotate.css("transform",'rotateZ( 0deg )');
                    func();
                }, 500);
            }

            // reset transform
            element.css("-webkit-transform",'');
            element.css("transform",'');

            // move back the container (css transition)
            if( translateVal !== -shareWrapH ) {
                element.addClass('container--reset');
            }
        }else{
            rotate.css("-webkit-transform",'rotateZ( 0deg )');
            rotate.css("transform",'rotateZ( 0deg )');
        }
    }

    function setContentTransform() {
        element.css("-webkit-transform",'translate3d(0, ' + translateVal + 'px, 0)');
        element.css("transform",'translate3d(0, ' + translateVal + 'px, 0)');
    }

    init();

}

//this function instates a stack that hasn't been open and fills the jqm page with jq data and creates the visuals of the stack header
function bannerset(activepage, stackids){
    //checks login to double check if user is following or not
    checklogin();
    //ajax function retrieves the stack information including banner, following, followers etc.
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'https://stacksity.com/php/stacknameJSON.php',
        crossDomain : true,
        data     : {stack:stackids, session_id:id},
        success  : function(data) {
            //alert(activepage.attr("id")+" "+stackid);
            if(data==1){
                alert("This stack doesn't exist");
                refreshPage(1);
            }else{
                activepage.find('.scroll').css('background-color','#0C4370');
                var element = JSON.parse(data);
                stackname = element.stackname;
                is_user = element.is_user;
                //alert(element.stack);
                stackids = element.stack;
                stackid = element.stack;
                var ban = activepage.find(".banner");
                if(element.banner!=null){
                    ban.css("background-image","url('"+element.banner+"')");
                    ban.children().css("background-color","rgba(0,0,0,0.4)");
                }else{
                    ban.css("background-image","none");
                    ban.children().css("background-color","transparent");
                }
                var $bannertext = ban.find(".bannertext");
                $bannertext.html('<h1 class="bannertitle"></h1><p class="bannerdesc"></p>');

                var $bannertitle = ban.find(".bannertitle");
                var $bannerdesc = ban.find(".bannerdesc");

                $bannertitle.html(stackname);
                if(stackids==0||stackids==4917){
                    //ban.addClass("topbanner");
                    $bannerdesc.html(element.stack_desc);
                }else if(stackids==-1){
                    //ban.addClass("allbanner");
                    $bannerdesc.html(element.stack_desc);
                }else if(stackids<-1){
                    $bannerdesc.html(element.stack_desc);
                    //if(stackids==-4){
                    //    ban.after('<div class="center locbar" style="padding: 0px 0 6px 0">'+
                    //        '<div class="btn-group btn-group-justified" role="group" aria-label="...">'+
                    //        '<div class="btn-group" role="group">'+
                    //        '<button type="button" class="btn btn-default dist-btn" onclick="setDist(0.1, this)">Close</button>'+
                    //        '</div>'+
                    //        '<div class="btn-group" role="group">'+
                    //        '<button type="button" class="btn btn-default dist-btn" onclick="setDist(5, this)" disabled>Near</button>'+
                    //        '</div>'+
                    //        '<div class="btn-group" role="group">'+
                    //        '<button type="button" class="btn btn-default dist-btn" onclick="setDist(50, this)">Far</button>'+
                    //        '</div>'+
                    //        '</div>'+
                    //        '</div>');
                    //}
                }else {
                    if(is_user==0){
                        ban.after('<div class="locbar" style="padding: 0px">'+
                            '<div class="btn-group btn-group-justified" role="group" aria-label="...">'+
                            '<div class="btn-group" role="group">'+
                            '<button type="button" class="btn btn-default dist-btn" onclick="setDist(0, this, 0)" disabled>Best</button>'+
                            '</div>'+
                            '<div class="btn-group" role="group">'+
                            '<button type="button" class="btn btn-default dist-btn" onclick="setDist(0, this, 1)">New</button>'+
                            '</div>'+
                            '<div class="btn-group" role="group">'+
                            '<button type="button" class="btn btn-default dist-btn" onclick="setDist(0, this, 2)">Top</button>'+
                            '</div>'+
                            '</div>'+
                            '</div>');
                    }
                    var space = '';
                    if (element.stack_desc != "" && element.stack_desc != null) {
                        space = '<br>';
                    }
                    $bannerdesc.html('<b>' + element.stack_desc + space + "<span class='followers'>" + element.followers + '</span> followers</b>');
                    if (userstack != stackids) {
                        if (element.following) {
                            $bannertext.append('<br> <button class="follow followed" value="1" data-role="none">Followed</button>')
                        } else {
                            $bannertext.append('<br> <button class="follow" value="0" data-role="none">Follow</button>')
                        }
                    } else {
                        $bannertext.append('<br> <button class="logout" onclick="logout();">Logout</button>')
                    }
                    if (element.is_user == "1") {
                        ban.addClass("userbanner");
                        is_user = 1;
                    }
                }
                ban.slideDown({complete:function(){
                    activepage.data("stack_id", stackids);
                    activepage.data("is_user", is_user);
                    activepage.data("startnews", 0);
                    activepage.data("stackname", stackname);
                    startnews = 0;
                    activepage.data("status", 0);
                    if(stackids == 4917){
                        setDist(5, "#nearbtn")
                    }else{
                        activepage.data("distance", 0);
                        startNews(startnews,activepage, stackids, 0);
                    }
                    var contain = activepage.children(".extracontainer");
                    pullToRefresh(contain.children(), refreshPull);
                    var windowheight = $(window).height();
                    //var reficon = contain.children().children(".pullRefresh").children();
                    //var touchcancel = false;
                    contain.bind("scrollstop", function() {
                        if(!postbox){
                            if(contain.scrollTop() + windowheight > contain.children(".con").height() - 2048) {
                                if(!end&&!bottom&&!loading){
                                    bottom = true;
                                    activepage.find('.scroll').html('<p>Loading Posts</p> ');
                                    //alert(activepage.data("distance"));
                                    if(activepage.data("distance")==0||activepage.data("distance")===undefined){
                                        startNews(startnews, activepage, stackid, activepage.data("status"));
                                    }else{
                                        startNews(startnews, activepage, stackid, activepage.data("status"), activepage.data("distance"));
                                    }
                                }
                            }
                            //else if((contain.scrollTop() < 1)&&!touchcancel){
                            //    contain.trigger("touchend");
                            //    reficon.addClass("rotate");
                            //    touchcancel = true;
                            //    contain.on('touchstart.refreshing', function(e) {
                            //        e.preventDefault();
                            //    });
                            //    refresh();
                            //    contain.stop().animate({ scrollTop : 50 }, 500, function(){
                            //        contain.off('touchstart.refreshing');
                            //        contain.trigger("touchend");
                            //        touchcancel = false;
                            //        reficon.removeClass("rotate");
                            //    });
                            //}
                        }
                    });
                }});
            }
        },
        error: function(request) {
            if(request.status == 0) {
                activepage.find('.scroll').html('<p>You\'re offline :(</p>');
                activepage.find('.scroll').css('background-color','#FF851B');
            }else{
                alert("Error Connection");
            }
        }
    });
}

//sets the parameters for the posting box, (can private post, either show username or stackname for "posting to")
function initPostBox(){
    //alert(stackid);
    if(stackid < 1){
        $("#posting").html(username);
        $('#private').show();
    }else if(stackid==4917){
        $("#posting").html("nearby");
        $('#private').hide();
    }else{
        if(is_user==0){
            $('#private').hide();
        }else{
            $('#private').show();
        }
        $("#posting").html(stackname);
    }
}

//var location = false;

//returns if the menu tab is or is not an actual stack (i.e. explore is not a stack)
function isStackOption(){
    //if(option==4){
    //    if(navigator.geolocation){
    //        location = true;
    //    }else{
    //        //alert("please allow Stacksity to access your location for $near");
    //    }
    //}
    return (option != 3 && option != 2 && option != 7);
}

//returns a variable goto as to which jqm page to open, first visual makes sure the old tab is not active anymore
function init(){
    var goto = 0;
    $('.active').removeClass('active');
    if(option == 1){
        $('#topstack').addClass('active');
    }else if(option == 2){
        $('#searchstack').addClass('active');
        goto = -10;
    }else if(option == 3){
        $('#notestack').addClass('active');
        goto = -10;
    }else if(option == 4){
        $('#allstack').addClass('active');
        goto = 4917;
    }else if(option == 5){
        $('#userstack').addClass('active');
        goto = userstack;
    }
    return goto;
}

//returns a string of what id name each jqm page is for each option(menu item)
function getOption(){
    if(option == 1){
        return "#toppage";
    }else if(option == 2){
        return "#searchpage";
    }else if(option == 3){
        return "#notepage";
    }else if(option == 4){
        return "#allpage";
    }else if(option == 5){
        return "#userpage";
    }
    return null;
}

//checks if the user is still logged in and if his php server session has expired, then it will renew unless an error occurs
function checklogin(){
    var id = localStorage.getItem('session_id');
    var hashcode = localStorage.getItem('hashcode');
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'https://stacksity.com/php/mobileCheckLogin.php',
        data     : {session_id : id, hashcode : hashcode},
        dataType : "html",
        async:   false,
        crossDomain : true,
        success  : function(data) {
            if(data=="0"){
                //if an error occurs send the user back to the login page
                loginResetPage();
            }else{
                if(data!="1"){
                    window.localStorage.setItem('session_id', data);
                }
            }
        },
        error: function(xhr, status, error) {
            //alert("error: "+xhr.responseText);
        }
    });
}
//checks if this is the very end of the stack newsfeed, since 10 posts are always returned unless there aren't anymore to show
//function checkEnd(postnum){
//    if(postnum < 10){
//        end = true;
//        $('.scroll').html('<p>No more posts</p>');
//        $('.scroll').html('<p>You\'re offline :(</p>');
//    }
//}

//this function is called when someone fires a change distance button
function setDist(distance, button, status){
    var activepage = $.mobile.activePage;
    if(button!==undefined){
        activepage.find(".dist-btn").prop('disabled', false);
        $(button).prop('disabled', true);
    }
    bottom = false;
    startnews = 0;
    loading = false;
    end = false;
    activepage.find('.scroll').html('Loading...');
    activepage.find('.feed').empty();
    activepage.data("distance", distance);
    activepage.data("status", status);
    if(distance==0){
        startNews(startnews, activepage, stackid, status);
    }else{
        startNews(startnews, activepage, stackid, status, distance);
    }
}

//retrieves the posts for a certain stack (probably one of the most important functions here, same as the site)
function startNews(startnum, activepage, stackid, status, distance) {
    //alert(startnum + " | " + stackid + " | " + distance);
    if(!loading){
        if(end){
            return;
        }
        loading = true;
        if(stackid==4917 && distance !== undefined){
            navigator.geolocation.getCurrentPosition(function(pos){
                    //alert("geo");
                    displayNews(startnum, activepage, stackid, status, pos.coords.latitude, pos.coords.longitude, distance);
                },
                function(error){
                    $.mobile.activePage.find('.scroll').html('<p>Please turn on location services</p>');
                },{timeout: 10000, enableHighAccuracy: true});
            return;
        }else{
            activepage.find('.scroll').html('<p>Loading Posts...</p>');
            displayNews(startnum, activepage, stackid, status);
        }
    }
}

function displayNews(startnum, activepage, stackid, status, latpoint, longpoint, distance){
    checklogin();
    loading = true;
    var postnum = 0;
    $.ajax({
        type     : "GET",
        cache    : false,
        url      : 'https://stacksity.com/php/feed.php',
        crossDomain : true,
        data     : {id : stackid , start : startnum , session_id: id , latitude : latpoint, longitude : longpoint, distance: distance, status: status},
        dataType : "html",
        success  : function(data) {
            if(option==7){
                return;
            }
            activepage.find('.scroll').css('background-color','#0C4370');
            if(data=="null"||data==''){
                loading = false;
                end = true;
                activepage.find('.scroll').html('<p>No more posts</p>');
            }else{
                data = JSON.parse(data);
                //if(startnum>19){
                //    var div = activepage.find(".extracontainer");
                //    activepage.find('.item:lt('+data.length+')').remove();
                //    div.scrollTop = div.scrollHeight;
                //    alert(data.length);
                //}
                if(startnum==0){
                    activepage.find('.feed').empty();
                }
                var postlist = "";
                var existingPost = {};
                $(activepage.find(".item").get().reverse()).each(function() {
                    existingPost[$(this).data("post")] = null;
                });
                $.each(data, function(index, element) {
                    if(!(parseInt(element.post_id) in existingPost)){
                        if(element.posttype == 0){
                            postlist += (linkspost(element));
                        }else if(element.posttype == 1){
                            postlist += (textspost(element));
                        }else if(element.posttype == 2){
                            postlist += (imagepost(element));
                        }else if(element.posttype == 3){
                            postlist += (videopostfeed(element));
                        }
                    }
                    postnum++;
                });
                activepage.find('.feed').append(postlist);
                loading = false;
                bottom = false;
                startnews = startnews + 10;
                activepage.data("startnews", startnews);
                if(postnum < 10){
                    end = true;
                    activepage.find('.scroll').html('<p>No more posts</p>');
                }
            }
        },
        error: function(request) {
            if(request.status == 0) {
                activepage.find('.scroll').html('<p>No Connection :(</p>');
                activepage.find('.scroll').css('background-color','#FF851B');
            }else{
                alert("Connection Error");
            }
        }
    });
}

//this refreshes a stack newsfeed, if the user is lower than a certain point he will be scrolled back to the top
function refresh(){
    bottom = false;
    end = false;
    loading = false;
    var activep = $.mobile.activePage;
    if(activep.data("stack_id")==null&&!postbox){
        bannerset(activep, stackid);
    }else{
        var scrollpos = activep.children(".extracontainer").scrollTop();
        if(scrollpos<4000){
            activep.children(".extracontainer").stop().animate({ scrollTop : 0 }, 1000);
        }else{
            activep.children(".extracontainer").scrollTop(0);
        }
    }
}
function refreshPull(){
    var activep = $.mobile.activePage;
    if(option==4){
        setDist(activep.data("distance"));
    }else{
        bottom = false;
        end = false;
        loading = false;
        activep.find('.scroll').html('<p>Loading Posts</p>');
        activep.find(".feed").empty();
        startnews = 0;
        startNews(startnews, activep, stackid, activep.data("status"));
        activep.data("startnews", 0);
    }
}
function searchPageRefresh(){
    //$(".stackls").empty();
    //getStacks($('#fs'),2);
    //getStacks($('#fu'),1)
}

//this retrieves a list of the stacks a user is following, distinguishes userstack/stacks (type_id=1 is retrieving userstack and type_id=2 is for actual stacks) alphabetical.
function getStacks(el, type_id){
    $.getJSON('https://stacksity.com/php/getstacks.php', {id : type_id, session_id:id}, function(data) {
        if(type_id==2){
            $("#fs").empty();
        }else{
            $("#fu").empty();
        }
        $.each(data, function(index, element) {
            if(type_id==2){
                el.append('<a onClick="linkToStack(\''+element.stackname+'\')">'+element.stackname+'</a>');
            }else{
                el.append('<a onClick="linkToStack('+element.stack_id+')">'+element.stackname+'</a>');
            }
        });
    });
}

//the following three functions are for toggling between the "stacks, users, explore" tabs on the explore page
function stack(){
    //element.parent().siblings().children().removeClass("active");
    //element.addClass("active");
    //$("#fs").empty();
    getStacks($('#fs'),2);
    $(".fstack").show();
    $(".fusers").hide();
    $(".rstack").hide();
}
function use(){
    //element.parent().siblings().children().removeClass("active");
    //element.addClass("active");
    //$("#fu").empty();
    getStacks($('#fu'),1);
    $(".fstack").hide();
    $(".fusers").show();
    $(".rstack").hide();
}
function ex(){
    //element.parent().siblings().children().removeClass("active");
    //element.addClass("active");
    $.ajax({
        type     : "GET",
        cache    : false,
        url      : 'https://stacksity.com/php/mobile/stacknews.php',
        crossDomain : true,
        dataType : "html",
        success  : function(data) {
            $(".rstack").html(data);
        },
        error: function(request) {
            if(request.status == 0) {
                alert('You\'re offline :(');
            }
        }
    });
    $(".fstack").hide();
    $(".fusers").hide();
    $(".rstack").show();
}

//refreshes the page and stuff

//Changepage represents when the app knowingly changes a page and what that page will be
//IE Changepage would be false when someone presses the back button on Android
var changepage = false;

function refreshPage(opt) {
    if(option == opt){
        if(postbox) {
            $.mobile.back();
        }else if(isStackOption()){
            refresh();
        }else if(option == 3){
            openNote();
        }
    }else{
        explore = false;
        var rev = false;
        var trans = 'none';
        //if(opt<option){
        //    rev=true;
        //}
        if(postbox){
            trans = 'slideup';
            rev = true;
        }if(option == 7){
            trans = 'slide';
            rev = true;
        }else if(option == 6){
            rev = true;
            trans = 'turn';
        }
        option = opt;
        var goto = init();
        changepage = true;
        //if(goto>-10){
        //localStorage.setItem('stack', goto);
        stackid = goto;
        $.mobile.changePage(
            getOption(),
            {
                transition              : trans,
                showLoadMsg             : false,
                reverse: rev
            }
        );
        //}
    }
    postbox = false;
}

function linkToStack(goto){
    if(goto == userstack || goto == username){
        refreshPage(5);
    }else{
        if(notransition){
            notransition = false;
            if(goto=="0" || goto=="$best"){
                refreshPage(1);
                return;
            }else if(goto=="0" || goto=="$near"){
                refreshPage(4);
                return;
            }
            $('.active').removeClass('active');
            //localStorage.setItem('stack', goto);
            var op = option;
            option = 6;
            if(explore){
                if(goto != stackid && goto != stackname){
                    stackid = goto;
                    dontdelete = true;
                    explore = true;
                    changepage = true;
                    $.mobile.changePage(
                        "#explorepage",
                        {
                            allowSamePageTransition : true,
                            transition              : 'turn',
                            showLoadMsg             : false,
                            reloadPage              : true
                        }
                    );
                }else{
                    if(op==7){
                        $.mobile.back();
                    }else{
                        notransition = true;
                        refresh();
                    }
                }
            }else{
                if(goto == stackid&&op==7){
                    $.mobile.back();
                }else if(op==2||op==7||(goto != stackid && goto != stackname)){
                    //alert(goto);
                    var banner = $('#explorepage .banner');
                    $('#explorepage').data("stack_id", null);
                    $('#explorepage').find(".locbar").remove();
                    banner.hide();
                    banner.removeClass("userbanner");
                    $('#explorepage .feed').empty();
                    stackid = goto;
                    explore = true;
                    changepage = true;
                    $.mobile.changePage(
                        "#explorepage",
                        {
                            transition              : 'turn',
                            showLoadMsg             : false
                        }
                    );
                }
            }
        }
    }
}
/*name();
 function name(){if(stackid == 0){
 $("#posting").html(self);
 }else{
 $("#posting").html(stackname);
 }
 }*/

//Shows the post box for links
var textposting = false;
function linkpost(){
    cancelimagepost();
    textposting = false;
    $('#imagepost').hide();
    $('#textpost').hide();
    $('#linkpost').show();
    $("#link").prop('required',true);
    $("#image").prop('required',false);
    $("#text").prop('required',false);
    $('#posttype').val("0");
    $('#postimage').removeClass('active');
    $('#posttext').removeClass('active');
    $('#postlink').addClass('active');
}
function textpost(){
    cancelimagepost();
    textposting = true;
    $('#linkpost').hide();
    $('#imagepost').hide();
    $('#textpost').show();
    $("#text").prop('required',true);
    $("#image").prop('required',false);
    $("#link").prop('required',false);
    $('#posttype').val("1");
    $('#postimage').removeClass('active');
    $('#posttext').addClass('active');
    $('#postlink').removeClass('active');
}
function imagepostShow(){
    textposting = false;
    $('#linkpost').hide();
    $('#textpost').hide();
    $('#imagepost').show();
    $("#text").prop('required', false);
    $("#image").prop('required', true);
    $("#link").prop('required', true);
    $('#posttype').val("0");
    $('#posttext').removeClass('active');
    $('#postimage').addClass('active');
    $('#postlink').removeClass('active');
}
$( "#title-input" ).keyup(function() {
    var length = $( this ).val().length;
    $( "#title-count").html(100-length);
});
$(document).on("click", "#private", function(e){
    e.preventDefault();
    $('#privatefield').val(1);
    $("#toppost").submit();
});
var postdata = null;
$(document).on('submit', "#toppost", function(e){
    e.preventDefault();
    if(!posting && !postingimage){
        if(textposting && !$.trim($("#textpostfield").val())){
            return;
        }
        if(stackid==4917){
            navigator.geolocation.getCurrentPosition(function(position){
                    $('#pbutton').hide();
                    $('#private').hide();
                    $("#spinnerpost").show();
                    makepost("&lat="+position.coords.latitude+"&long="+position.coords.longitude);
                },
                function(error){
                    alert("Please enable location services to post on $near")
                },{timeout: 10000, enableHighAccuracy: true}
            );
        }else{
            $('#pbutton').hide();
            $('#private').hide();
            $("#spinnerpost").show();
            makepost("");
        }
    }
});

function cancelimagepost(){
    if(postingimage){
        postingimage = false;
        $("#pbutton").prop( "disabled", false );
        $("#private").prop( "disabled", false );
        $("#imagespinner").hide();
    }
}
//This function makes an actual post
function makepost(info){
    checklogin();
    if(!$("#addtitle").hasClass("onbutton")){
        $("#title-input").val('');
    }
    var data = $("#toppost").serialize()+"&stack="+stackid+"&user_value="+is_user+"&session_id="+id+info;
    posting = true;
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'https://stacksity.com/php/post.php',
        crossDomain : true,
        data     : data,
        success  : function(data) {
            postbox = false;
            postdata = data;
            $.mobile.back();
        },
        error: function(request) {
            if(request.status == 0) {
                alert("You're offline!");
            }else{
                alert("Error Connection");
            }
            $('#pbutton').show();
            $('#private').show();
            $("#spinnerpost").hide();
            posting = false;
        }
    });
    return false;
}
function parsePostData(){
    var data = postdata;
    if(data.length<=2) {
        if(data=="4"){
            alert("You need to provide a link");
        }else if(data!=3){
            alert("error :" + data);
        }
    }else{
        $('.background-image').hide();
        $('#toppost').trigger("reset");
        $( "#title-count").html("100");
        var element = $.parseJSON(data);
        if(element.posttype == 0){
            $(linkspost(element)).hide().prependTo('.ui-page-active .feed').fadeIn("slow");
        }else if(element.posttype == 1){
            $('#text').val('').change();
            $(textspost(element)).hide().prependTo('.ui-page-active .feed').fadeIn("slow");
        }else if(element.posttype == 2){
            $(imagepost(element)).hide().prependTo('.ui-page-active .feed').fadeIn("slow");
        }else if(element.posttype == 3){
            $(videopostfeed(element)).hide().prependTo('.ui-page-active .feed').fadeIn("slow");
        }
    }
    $('#pbutton').show();
    $('#private').show();
    $("#spinnerpost").hide();
    $('#privatefield').val(0);
    posting = false;
    postdata = null;
}
$(document).on('click', '.follow', function(){
    if($(this).val()==1){
        $(this).val(0);
        $(this).removeClass('followed');
        $(this).html('Follow');
        $(".ui-page-active .followers").html(parseInt($(".ui-page-active .followers").html())-1);
    }else{
        $(this).addClass('followed');
        $(this).html('Followed');
        $(this).val(1);
        $(".ui-page-active .followers").html(parseInt($(".ui-page-active .followers").html())+1);
    }
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'https://stacksity.com/php/follow.php',
        data     : { stack: stackid, session_id: id},
        success: function(data){
        },
        error: function(xhr, status, error) {
            alert("error"+ xhr.responseText);
        }
    });
});

function stackTrace() {
    var err = new Error();
    return err.stack;
}

//following 3 functions are for deleting things and showing a confirmation box
var delete_id = 0;
function del(num){
    if(num==1){
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : 'https://stacksity.com/php/deletepost.php',
            data     : {delid : delete_id, session_id: id},
            success  : function(data) {
                if(data==0){
                    $('*[data-post="'+delete_id+'"]').fadeOut();
                }else{
                    alert(data);
                }
            },
            error: function(xhr, status, error) {
                alert("error"+ xhr.responseText);
            }
        });
    }
}
var report_id = 0;
function report(num){
    if(num==1){
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : 'https://stacksity.com/php/reportpost.php',
            data     : {relid : report_id, session_id: id},
            success  : function(data) {
                if(data==0){
                    $('*[data-post="'+report_id+'"]').fadeOut();
                    alert("Your report has been submitted and will be reviewed by the admins");
                }else{
                    alert(data);
                }
            },
            error: function(xhr, status, error) {
                alert("error"+ xhr.responseText);
            }
        });
    }
}
var deletecom_id = 0;
function delcom(num){
    if(num==1){
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : 'https://stacksity.com/php/deletecomment.php',
            data     : {delid : deletecom_id, session_id: id},
            success  : function(data) {
                if(data==0){
                    var del = $('*[data-commentid="'+deletecom_id+'"]');
                    del.find('.deletecom').remove();
                    del.find('.commenttext').html('[deleted]');
                }else{
                    alert(data);
                }
            },
            error: function(xhr, status, error) {
                alert("error"+ xhr.responseText);
            }
        });
    }
}

/*post stuff*/
$(document).on('click','a',function(e){
    if(login){
        e.stopPropagation();
        if($(this).hasClass("toPost")){
            e.preventDefault();
            if(postid == $(this).data("postlink")){
                postRefresh = false;
            }
            postid = $(this).data("postlink");
            option = 7;
            changepage = true;
            $.mobile.changePage(
                "#post",
                {
                    transition: "slide",
                    showLoadMsg             : false
                }
            );
        }else if($(this).hasClass("stacklink")){
            e.preventDefault();
            var goto = $(this).data('link');
            linkToStack(goto);
        }else if($(this).hasClass("sharelink")){
            e.preventDefault();
            var goto = "https://stacksity.com/p/" + $(this).data('link');
            window.plugins.socialsharing.share('', null, null, goto);
        }else if($(this).hasClass("postback")){
            e.preventDefault();
            back();
        }else if($(this).hasClass("delete")){
            delete_id = $(this).data('delete');
            //e.preventDefault();
            navigator.notification.confirm(
                'Are you sure you want to remove this post?',  // message
                del,              // callback to invoke with index of button pressed
                'Delete Post',            // title
                'Delete,Cancel'          // buttonLabels
            );
        }else if($(this).hasClass("report")){
            report_id = $(this).data('delete');
            //e.preventDefault();
            navigator.notification.confirm(
                'Only report posts that have not been properly labeled NSFW or are blatantly illegal. An abuse of the report function will have severe consequences',  // message
                report,             // callback to invoke with index of button pressed
                'Report Post',            // title
                'Report,Cancel'          // buttonLabels
            );
        }else if($(this).hasClass("deletecom")){
            deletecom_id = $(this).data('delete');
            //e.preventDefault();
            navigator.notification.confirm(
                'Are you sure you want to remove this comment?',  // message
                delcom,             // callback to invoke with index of button pressed
                'Delete Comment',            // title
                'Delete,Cancel'          // buttonLabels
            );
        }else if($(this).attr("id")=="addtitle"){
            e.preventDefault();
            $("#addtitle").toggleClass("onbutton");
            $("#titlediv").slideToggle();
        }else{
            var link = $(this).attr("href");
            if(link==null||$(this).hasClass("ui-input-clear")){
            }else{
                e.preventDefault();
                if(link.charAt(0)=="/"){
                    if(link.charAt(1)=="u"&& link.charAt(2)=="/"){
                        linkToStack(link.substring(3));
                    }else if(link.charAt(1)=="$"){
                        linkToStack(link.substring(1));
                    }else if(link.charAt(1)=="p"&& link.charAt(2)=="/"){
                        var midpoint = link.indexOf("&");
                        if (midpoint === -1){
                            toPost(link.substring(3));
                        }else{
                            toPost(link.substring(3,midpoint),link.substring(midpoint+1));
                        }
                    }
                }else{
                    if(mobile && device.platform == "Android"){
                        window.open(link, '_system');
                    }else{
                        window.open(link, '_blank', 'location=yes,enableViewportScale=yes');
                    }
                }
            }
        }
    }
});
$(document).on('tap','.postlink, button',function(e){
    e.preventDefault();
    e.stopPropagation();
    $(this).trigger('click');
});
$(".quarter").on('tap', function (e) {
    e.preventDefault();
    refreshPage($(this).data("op"));
});
var commentid = 0;
//function toPost(link){
//    postid = link;
//    option = 7;
//    changepage = true;
//    init();
//    $.mobile.changePage(
//        "#post",
//        {
//            transition: "slide",
//            showLoadMsg             : false
//        }
//    );
//}

function toPost(link, commentlink){
    postid = link;
    if(commentlink!=null){
        commentid = commentlink;
    }
    option = 7;
    changepage = true;
    init();
    $.mobile.changePage(
        "#post",
        {
            transition: "slide",
            showLoadMsg             : false
        }
    );
}

function getPost(postid)
{
    $.getJSON('https://stacksity.com/php/postname.php', {id : postid, session_id:id}, function(element){
        if(null==element){
            //alert("post not found");
            //$.mobile.back();
            $("#postcon").append("<div class='item'><div class='margins'><h1>This post doesn't seem to exist :(</h1><p>It's either deleted, private, or nonexistent</p><img src='../www/img/notfound.png' class='fullimage'></div></div>").slideDown(function(){$("#comments").slideUp();});
        }else{
            if(element.posttype == 0){
                $('#postcon').append(linkspost(element));
            }else if(element.posttype == 1){
                $('#postcon').append(textspost(element));
            }else if(element.posttype == 2){
                $('#postcon').append(imagepost(element));
            }else if(element.posttype == 3){
                $('#postcon').append(videopost(element));
            }
            $("#postcon").slideDown(function(){
                if(element.comments>0){
                    getComment($("#commentfeed"));
                }else{
                    $('#commentfeed').html("<div class='nocomments'>No comments currently</div>");
                }
            });
        }
    });
}
function commentVote(type, count){
    if(type==2){
        return '<div class="cvote"><div class="cbutton stackup stack-up" name="up"></div><p class="score">'+count+'</p><div class="cbutton stackdown" name="down"></div></div>'
    }
    if(type==0){
        return '<div class="cvote"><div class="cbutton stackup" name="up"></div><p class="score">'+count+'</p><div class="cbutton stackdown stack-down" name="down"></div></div>'
    }
    return '<div class="cvote"><div class="cbutton stackup" name="up"></div><p class="score">'+count+'</p><div class="cbutton stackdown" name="down"></div></div>'
}
function commentHTML(element, depth){
    var count = element.upstacks-element.downstacks;
    var depthtext = '';
    var del = '';
    var edit = '';
    var edittime = '';
    //alert(element.user_id+" | "+element.user);
    if(element.edit!=null){
        edittime = "<span class='edittime'> edited "+element.edit+'</span>';
    }
    if(element.delete){
        del = '<a class="reply editcom">edit</a><a class="reply deletecom" data-delete="'+element.comment_id+'">delete</a>';
        edit = "<form class='editcon' style='display: none'><input name='postid' type='hidden' value='"+postid+"'>"+
            "<input name='commentid' type='hidden' value='"+element.comment_id+"'><textarea name='text'>"+element.raw+"</textarea>"+
            "<a class='reply canceledit'>cancel</a><a class='reply saveedit' onclick='$(this).parent().submit()'>save</a></form>";
    }
    var reply = del;
    if(depth == 0){
        depthtext = 'depth';
    }
    var vote = commentVote(element.vote, count);
    if(depth<7){
        reply = '<a class="reply replybutton" onclick="swapReply(this)">reply</a>'+del+'<form class="replycomment" style="display: none" data-depth="'+depth+'"><div class="postcon replycon">'+
            '<input type="hidden" name="postid" value="'+postid+'">'+
            '<input type="hidden" name="commentid" value="'+element.comment_id+'">'+
            '<div class="textpost">'+
            '<textarea name="text" class="expanding" id="text" placeholder="write something here..." rows="2" required></textarea>'+
            '</div></div>'+
            '<button type="submit" class="postb replypost commentb">Post</button>'+
            '</form>';
    }
    return '<div class="child '+depthtext+'">'+
        '<div class="comment" data-commentid="'+element.comment_id+'" data-depth="'+element.depth+'">'+
        vote+
        '<div class="comment-content">'+
        '<p class="tagline"><a class="stacklink" data-link="'+element.user_stack+'" class="">'+element.username+element.flair+'</a> | <time>'+element.created+'</time>' +
            //' | #'+element.comment_id +
        "<br>" + edittime +'</p>'+
        '<div class="commenttext"><div class="commentcontent">'+element.content +"</div><div class='commentoptions'>"+ reply +'</div></div>'+ edit +
        '</div> </div> </div>';
}

jQuery.event.special.dblclick = {
    setup: function(data, namespaces) {
        var elem = this,
            $elem = jQuery(elem);
        $elem.bind('touchend.dblclick', jQuery.event.special.dblclick.handler);
    },

    teardown: function(namespaces) {
        var elem = this,
            $elem = jQuery(elem);
        $elem.unbind('touchend.dblclick');
    },

    handler: function(event) {
        var elem = event.target,
            $elem = jQuery(elem),
            lastTouch = $elem.data('lastTouch') || 0,
            now = new Date().getTime();

        var delta = now - lastTouch;
        if(delta > 20 && delta<500){
            $elem.data('lastTouch', 0);
            $elem.trigger('dblclick');
        }else
            $elem.data('lastTouch', now);
    }
};

function back(){
    if(login && (!isStackOption() || option == 6)){
        if(option == 6 && prevpageID=="explorepage" || prevpageID == ""){
            option = lastdefaultOP;
            changepage = true;
            init();
            explore = false;
            var transition = "turn";
            if(option == 7){
                transition = "slide"
            }
            $.mobile.changePage(
                getOption(),
                {
                    transition              : transition,
                    showLoadMsg             : false,
                    reverse: true
                }
            );
        }else{
            if(prevpageID=="post"){
                postRefresh = false;
            }
            $.mobile.back();
        }
    }
}

//swipleleft to collapse posts and comments in iOS, double tap/click on android or browser
function bindSwipe(){
    if(mobile&&device.platform == "iOS"){
        $(document).on("swipeleft", ".comment-content", function (event) {
            event.preventDefault();

            // Set up collapse state variables to keep track of opened/closed comments
            // Depending on whether it's collapsed, expand/collapse the children comments and the comment
            // itself except for the title line with username, etc.
            if ($(this).hasClass("collapsedcss")) {
                $(this).children(".commenttext").slideDown();
                $(this).siblings(".cvote").show();
                $(this).parent().siblings(".child").show();
                //$(this).removeClass("collapse");
                //$(this).addClass("glyphicon-minus-sign");
                $(this).removeClass("collapsedcss");
                $(this).parent().parent(".child").removeClass("childcollapsed");
            } else {
                $(this).parent().siblings(".child").slideUp();
                $(this).children(".commenttext, .editcon").slideUp();
                $(this).siblings(".cvote").hide();
                $(this).addClass("collapsedcss");
                $(this).parent().parent(".child").addClass("childcollapsed");
            }
        });
        $(document).on("swipeleft", ".item", function (event) {
            event.preventDefault();

            $(this).find(".collapsecon").slideToggle();
        });
    }else{
        $(document).on("dblclick", ".comment-content", function (event) {
            event.preventDefault();

            // Set up collapse state variables to keep track of opened/closed comments
            // Depending on whether it's collapsed, expand/collapse the children comments and the comment
            // itself except for the title line with username, etc.
            if ($(this).hasClass("collapsedcss")) {
                $(this).children(".commenttext").slideDown();
                $(this).siblings(".cvote").show();
                $(this).parent().siblings(".child").show();
                //$(this).removeClass("collapse");
                //$(this).addClass("glyphicon-minus-sign");
                $(this).removeClass("collapsedcss");
                $(this).parent().parent(".child").removeClass("childcollapsed");
            } else {
                $(this).parent().siblings(".child").slideUp();
                $(this).children(".commenttext, .editcon").slideUp();
                $(this).siblings(".cvote").hide();
                $(this).addClass("collapsedcss");
                $(this).parent().parent(".child").addClass("childcollapsed");
            }
        });
        $(document).on("dblclick", ".item", function (event) {
            event.preventDefault();

            $(this).find(".collapsecon").slideToggle();
        });
    }
}

//$(document).on("click", ".commentcollapse", function () {
//
//    // Set up collapse state variables to keep track of opened/closed comments
//    var collapsestate = 0;
//    var collapsecheck = $(this).attr('class');
//
//    // Checks if comments have already been collapsed
//    if (collapsecheck == "commentcollapse collapsed") {
//        collapsestate = 1;
//    } else {
//        collapsestate = 0;
//    }
//
//    // Depending on whether it's collapsed, expand/collapse the children comments and the comment
//    // itself except for the title line with username, etc.
//    if (collapsestate) {
//        $(this).parent().parent().children(".commenttext").show();
//        $(this).parent().parent().parent().children(".cvote").show();
//        $(this).parent().parent().parent().parent().children(".child").show();
//        this.innerHTML = "[–]";
//        $(this).removeClass("collapsed");
//    } else {
//        $(this).parent().parent().children(".commenttext, .editcon").hide();
//        $(this).parent().parent().parent().children(".cvote").hide();
//        $(this).parent().parent().parent().parent().children(".child").hide();
//        this.innerHTML = "[+]";
//        $(this).addClass("collapsed");
//    }
//});

$(document).on('click', '.editcom', function(e) {
    $(this).parent().parent().siblings().show();
    $(this).parent().parent().hide();
});
$(document).on('click', '.canceledit', function(e) {
    $(this).parent().siblings().show();
    $(this).parent().hide();
});

$(document).on('submit', '.editcon', function(e){
    e.preventDefault();
    if(!posting){
        posting = true;
        $(this).children('.saveedit').html('saving..');
        var el = $(this);
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : 'https://stacksity.com/php/editcomment.php',
            data     : el.serialize()+"&session_id="+id,
            success  : function(data) {
                el.siblings(".commenttext").show();
                el.siblings(".tagline").children(".edittime").html("edited now");
                el.siblings().children(".commentcontent").html(data);
                el.hide();
                el.children('.saveedit').html('save');
                posting = false;
            },
            error: function(xhr, status, error) {
                alert("error"+ xhr.responseText);
                el.children('.saveedit').html('save');
                posting = false;
            }
        });
    }else{
        e.preventDefault();
    }
});

function getComment(item)
{
    $.getJSON('https://stacksity.com/php/commentfeed.php', {post_id : postid, session_id: id}, function(data) {
        $("#commentfeed").empty();
        showComment(data,item);
        if(commentid != 0){
            var comment = $(".comment[data-commentid="+commentid+"]");
            commentid = 0;
            if(comment.length!=0){
                comment.children(".comment-content").css("background-color","#F0E68C");
                var extra = $.mobile.activePage.children();
                extra.on("touchstart.comment", function(e) {
                    e.preventDefault();
                });
                $('#post .extracontainer').animate({
                    scrollTop: (comment.offset().top - 60)
                }, 1000, function(){
                    extra.off('touchstart.comment');
                });
            }
        }
    });
}
function showComment(data,item){
    $.each(data, function(index, element) {
        item.append(commentHTML(element, element.depth));
        if(element.depth<7){
            if(element.comments!=null) {
                showComment(element.comments, item.children(".child:last"));
            }
        }
    });
}
function swapReply(el){
    if (el.innerHTML == "reply"){
        $(".replycomment").hide();
        $(el).siblings('.replycomment').show();
        el.innerHTML = "cancel";
    } else if (el.innerHTML == "cancel") {
        $(".replycomment").siblings('.reply').show();
        $(el).siblings('.replycomment').hide();
        el.innerHTML = "reply";
    }

}
function backReply(el){
    $(el).closest('.replycomment').siblings('.reply').show();
    $(el).closest('.replycomment').hide();
    $(el).parent().parent().parent().sibilings('.replybutton').text("reply");


}
$(document).on('submit', '.replycomment', function(e){
    e.preventDefault();
    //checks that the reply comment is not blank
    if(!posting && ($(this).children(".postcon").children(".textpost").children().val().trim().length > 0)){
        checklogin();
        posting = true;
        $(this).children('.replypost').html('Posting..');
        e.preventDefault();
        var el = $(this);
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : 'https://stacksity.com/php/postcomment.php',
            data     : el.serialize()+"&session_id="+id,
            success  : function(data) {
                if(data.length<=1) {
                    if(data!=3){
                        alert("error :" + data);
                    }
                }else{
                    var element = $.parseJSON(data);
                    $(commentHTML(element, el.data('depth')+1)).hide().insertAfter(el.closest('.comment')).fadeIn("slow");
                    el.children('.replypost').html('Post');
                    el.find("input[type=text], textarea").val("");
                    el.siblings('.replybutton').trigger( "click" );
                    el.hide();
                }
                posting = false;
            },
            error: function(xhr, status, error) {
                alert("error"+ xhr.responseText);
                $(this).children('.replypost').html('Post');
                $(this).siblings('.replybutton').trigger( "click" );
                $(this).hide();
                posting = false;
            }
        });
    }else{
        e.preventDefault();
    }
});
$(document).on('submit', '#commentform',function(e){
    e.preventDefault();
    if(!posting && ($(this).children(".postcon").find("#commenttext").val().trim().length > 0)){
        checklogin();
        posting = true;
        $('#cbutton').html('<div class="loader">Loading...</div>');
        e.preventDefault();
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : 'https://stacksity.com/php/postcomment.php',
            data     : $(this).serialize()+"&session_id="+id+"&postid="+postid,
            success  : function(data) {
                if(data.length<=1) {
                    if(data!=3){
                        alert("error :" + data);
                    }
                }else{
                    var element = $.parseJSON(data);
                    $(commentHTML(element, 0)).hide().prependTo('#commentfeed').fadeIn("slow");
                    $('#cbutton').html('comment');
                    $("#commentform").find("textarea").val("");
                    $(".nocomments").remove();
                }
                posting = false;
            },
            error: function(xhr, status, error) {
                alert("error"+ xhr.responseText);
                $('#cbutton').html('comment');
                posting = false;
            }
        });
    }else{
        e.preventDefault();
    }
});

/*--notification system--*/
var newcountNotif = 0;
function notification(element, seen, stringText){
    return '<div class="notification '+seen+' toPost" onclick="toPost('+element.link+','+element.commentlink+')" data-note="'+element.notification_id+'"><b>'+element.username+'</b> '+stringText+' P#'+element.link+'<br/><span class="note-time">'+element.created+'</span></div>';
}
var cycle = false;
var interval = null;

function set(){
    interval = setInterval(function(){
        if(cycle){
            cycle = false;
        }else{
            if(option!=3){
                getNotification();
            }
        }
    },30000);
}
//This function is for when the notification page refreshes
function openNote(){
    cycle = true;
    getNotification();
}
//This function retrieves the notifications from the server
function getNotification(){
    $(".note-header").empty();
    var $notescroll = $(".notescroll");
    $notescroll.html('Loading notifications');
    checklogin();
    newcountNotif = 0;
    $.ajax({
        type     : "GET",
        cache    : false,
        url      : 'https://stacksity.com/php/getnotification.php',
        crossDomain : true,
        data     : {timestamp: 0, session_id: id},
        dataType : "json",
        success  : function(data) {
            $notescroll.css('background-color','#0C4370');
            if(data!=null){
                var content = '';
                $.each(data, function(index, element) {
                    var seen = '';
                    if(element.seen==0){
                        seen = 'unseen';
                        newcountNotif++;
                    }
                    if(element.note_type==0){
                        content =  notification(element, seen, "posted to your stack") + content;
                    }else if(element.note_type==1){
                        content =  notification(element, seen, "commented on your post") + content;
                    }else if(element.note_type==2){
                        content =  notification(element, seen, "replied to your comment") + content;
                    }else if(element.note_type==3){
                        content =  notification(element, seen, "tagged you in a comment") + content;
                    }else if(element.note_type==4){
                        content =  notification(element, seen, "tagged you in a post") + content;
                    }

                });
                $(".note-header").hide();
                $(".note-header").html(content);
                $(".note-header").slideDown(function(){
                    $notescroll.html('No More Notifications to Show');
                });
            }else{
                $notescroll.html('No More Notifications to Show');
            }
            if(option == 3){
                markseen();
            }else{
                if(newcountNotif!=0){
                    $('#notestack').addClass('newnote');
                }
            }
        },
        error: function(request) {
            if(request.status == 0) {
                $notescroll.html('<p>You\'re offline :(</p>');
                $notescroll.css('background-color','#FF851B');
            }else{
                alert("" +
                    "Connection Error");
            }
        }
    });
}
function markseen(){
    $('#notestack').removeClass('newnote');
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'https://stacksity.com/php/markseen.php',
        data     : {session_id:id},
        success  : function(data) {
        },
        error: function(xhr, status, error) {
            alert("error"+ xhr.responseText);
        }
    });
}