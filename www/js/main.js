/**
 * Created by killswitch on 4/18/2015.
 */
//var self = $('#selfid').html();
//var stackname = $('#stackname').val();
//var stackid = $('#stack').val();
//var post = false;
imagepostShow();
/*name();
function name(){if(stackid == 0){
    $("#posting").html(self);
}else{
    $("#posting").html(stackname);
}
}*/

function linkpost(){
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
    $("#text").expanding();
}
function imagepostShow(){
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

var stackid = $('#stack').val();
var post = false;

var end = false;
var bottom = false;
var startnews = 0;
var user_id = localStorage.getItem("user_id");

function checkEnd(postnum){
    if(postnum == 0){
        end = true;
        $('.scroll').html('<p>No more posts</p>');
    }
}
startNews(startnews);
function startNews(startnum) {
    //$.ajax({
    //    type     : "GET",
    //    cache    : false,
    //    url      : 'http://stacksity.herokuapp.com/mobile-php/feed.php',
    //    data     : {id : stackid , start : startnum, user_id : user_id },
    //    crossDomain : true,
    //    success  : function(data) {
    //        alert(data);
    //    },
    //    error: function(xhr, status, error) {
    //        alert("error: "+xhr.responseText);
    //    }
    //});
    if(end){
        return;
    }
    var postnum = 0;
    $.getJSON('http://stacksity.com/mobile-php/feed.php', {id : stackid , start : startnum, user_id : user_id }, function(data) {
        if(null==data){
            checkEnd(postnum);
        }else{
            $.each(data, function(index, element) {
                if(element.posttype == 0){
                    $('#feed').append(linkspost(element));
                }else if(element.posttype == 1){
                    $('#feed').append(textspost(element));
                }else if(element.posttype == 2){
                    $('#feed').append(imagepost(element));
                }else if(element.posttype == 3){
                    $('#feed').append(videopost(element));
                }
                postnum++;
            });
            bottom = false;
            checkEnd(postnum);
        }
    });
    startnews = startnews + 10;
}
$(document).ready(function() {
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            if(!end&&!bottom){
                bottom = true;
                $('.scroll').html('<p>Loading Posts</p> <div class="loader" style="top: -35px">Loading...</div>');
                startNews(startnews);
            }
        }
    });
});


//window.onload = function() {
//    WebPullToRefresh.init( {
//        loadingFunction: exampleLoadingFunction
//    } );
//};
//var exampleLoadingFunction = function() {
//    return new Promise( function( resolve, reject ) {
//
//        setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
//            $('#feed').empty();
//            startnews = 0;
//            startNews(startnews);
//
//            myScroll.refresh();
//        }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
//        resolve();
//    } );
//};
var items_per_page = 10;
var scroll_in_progress = false;
var myScroll;
load_content = function(refresh, next_page) {

    // This is a DEMO function which generates DEMO content into the scroller.
    // Here you should place your AJAX request to fetch the relevant content (e.g. $.post(...))

    console.log(refresh, next_page);
    setTimeout(function() { // This immitates the CALLBACK of your AJAX function

        if (refresh) {
            $('#feed').empty();
            startnews = 0;
            startNews(startnews);

            pullActionCallback();

        } else {

            if (myScroll) {
                myScroll.destroy();
                $(myScroll.scroller).attr('style', ''); // Required since the styles applied by IScroll might conflict with transitions of parent layers.
                myScroll = null;
            }
            trigger_myScroll();

        }
    }, 1000);

};

function pullDownAction() {
    load_content('refresh');

}
function pullUpAction(callback) {
    load_content('refresh', next_page);

    if (callback) {
        callback();
    }
}
function pullActionCallback() {
    if (pullDownEl && pullDownEl.className.match('loading')) {

        pullDownEl.className = 'pullDown';
        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh';

        myScroll.scrollTo(0, parseInt(pullUpOffset)*(-1), 200);

    } else if (pullUpEl && pullUpEl.className.match('loading')) {

        $('.pullUp').removeClass('loading').html('');

    }
}

var pullActionDetect = {
    count:0,
    limit:10,
    check:function(count) {
        if (count) {
            pullActionDetect.count = 0;
        }
        // Detects whether the momentum has stopped, and if it has reached the end - 200px of the scroller - it trigger the pullUpAction
        setTimeout(function() {
            if (myScroll.y <= (myScroll.maxScrollY + 200) && pullUpEl && !pullUpEl.className.match('loading')) {
                $('.pullUp').addClass('loading').html('<span class="pullUpIcon">&nbsp;</span><span class="pullUpLabel">Loading...</span>');
                pullUpAction();
            } else if (pullActionDetect.count < pullActionDetect.limit) {
                pullActionDetect.check();
                pullActionDetect.count++;
            }
        }, 200);
    }
}

function trigger_myScroll(offset) {
    pullDownEl = document.querySelector('#wrapper .pullDown');
    if (pullDownEl) {
        pullDownOffset = pullDownEl.offsetHeight;
    } else {
        pullDownOffset = 0;
    }
    pullUpEl = document.querySelector('#wrapper .pullUp');
    if (pullUpEl) {
        pullUpOffset = pullUpEl.offsetHeight;
    } else {
        pullUpOffset = 0;
    }
    offset = 0;
    myScroll = new IScroll('#wrapper', {
        probeType:1, tap:true, click:false, preventDefaultException:{tagName:/.*/}, mouseWheel:true, scrollbars:false, keyBindings:false,
        deceleration:0.01,
        startY:40
    });

    myScroll.on('scrollStart', function () {
        scroll_in_progress = true;
    });
    myScroll.on('scroll', function () {

        scroll_in_progress = true;
        if (this.y >= 5 && pullDownEl && !pullDownEl.className.match('flip')) {
            pullDownEl.className = 'pullDown flip';
            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh';
            this.minScrollY = 0;
        } else if (this.y <= 5 && pullDownEl && pullDownEl.className.match('flip')) {
            pullDownEl.className = 'pullDown';
            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh';
            this.minScrollY = -pullDownOffset;
        }

        console.log(this.y);
        pullActionDetect.check(0);
    });
    myScroll.on('scrollEnd', function () {
        console.log('scroll ended');
        setTimeout(function() {
            scroll_in_progress = false;
        }, 100);
        if (pullDownEl && pullDownEl.className.match('flip')) {
            pullDownEl.className = 'pullDown loading';
            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
            pullDownAction();
        }
        // We let the momentum scroll finish, and if reached the end - loading the next page
        pullActionDetect.check(0);
    });

    // In order to prevent seeing the "pull down to refresh" before the iScoll is trigger - the wrapper is located at left:-9999px and returned to left:0 after the iScoll is initiated
    setTimeout(function() {
        $('#wrapper').css({left:0});
    }, 100);
}
