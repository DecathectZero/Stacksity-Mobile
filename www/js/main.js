var posting = false;
var end = false;
var bottom = false;
var startnews = 0;
var id = localStorage.getItem('session_id');
var stackid = 0;
var stackname = null;
var userstack = localStorage.getItem('ustack');
var username = localStorage.getItem('username');
var option = 1;
var explore = false;
var postbox = false;
var postype = 1;
var is_user = 0;
var dontdelete = false;
var loading = false;
var postid = 0;

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
                alert("this stack doesn't exist");
                refreshPage(1);
            }else{
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
                activepage.data("stack_id", stackids);
                activepage.data("is_user", is_user);
                activepage.data("startnews", 0);
                activepage.data("stackname", stackname);
                activepage.find(".bannertext").html('<h1 class="bannertitle"></h1><p class="bannerdesc"></p>');
                activepage.find(".bannertitle").html(stackname);
                if(stackids==0){
                    //ban.addClass("topbanner");
                    activepage.find(".bannerdesc").html(element.stack_desc);
                }else if(stackids==-1){
                    //ban.addClass("allbanner");
                    activepage.find(".bannerdesc").html(element.stack_desc);
                }else if(stackids<-1){
                    activepage.find(".bannerdesc").html(element.stack_desc);
                }else {
                    var space = '';
                    if (element.stack_desc != "" && element.stack_desc != null) {
                        space = '<br>';
                    }
                    activepage.find(".bannerdesc").html('<b>' + element.stack_desc + space + "<span class='followers'>" + element.followers + '</span> followers</b>');
                    if (userstack != stackids) {
                        if (element.following) {
                            activepage.find('.bannertext').append('<br> <button class="follow followed" value="1" data-role="none">Followed</button>')
                        } else {
                            activepage.find('.bannertext').append('<br> <button class="follow" value="0" data-role="none">Follow</button>')
                        }
                    } else {
                        activepage.find('.bannertext').append('<br> <button class="logout" onclick="logout();">Logout</button>')
                    }
                    if (element.is_user == "1") {
                        ban.addClass("userbanner");
                        is_user = 1;
                    }
                }
                activepage.find(".banner").slideDown({complete:function(){
                    startnews = 0;
                    startNews(startnews,activepage, stackids);
                }});
            }
        },
        error: function(request) {
            if(request.status == 0) {
                $('.scroll').html('<p>You\'re offline :(</p>');
            }else{
                alert("Error Connection");
            }
        }
    });
}
//self explanatory figure it out, login.html wipes all localdata
function logout(){
    document.location.href = 'login.html';
}

//sets the parameters for the posting box, (can private post, either show username or stackname for "posting to")
function initPostBox(){
    //alert(stackid);
    if(stackid < 1){
        $("#posting").html(username);
        $('#private').show();
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
        goto = -4;
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
                document.location.href = 'login.html';
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
function checkEnd(postnum){
    if(postnum < 10){
        end = true;
        $('.scroll').html('<p>No more posts</p>');
    }
}
//retrieves the posts for a certain stack (probably one of the most important functions here, same as the site)
function startNews(startnum, activepage, stackid) {
    if(!loading){
        if(end){
            return;
        }
        if(stackid==-4){
                navigator.geolocation.getCurrentPosition(function(pos){
                    //alert("geo");
                    displayNews(startnum, activepage, stackid, pos.coords.latitude, pos.coords.longitude);
                },
                function(error){
                    $('.scroll').html('<p>Please turn on location services</p>');
                });
                return;
        }else{
            $('.scroll').html('<p>Loading Posts...</p>');
            displayNews(startnum, activepage, stackid);
        }
    }
}

function displayNews(startnum, activepage, stackid, latpoint, longpoint){
    checklogin();
    loading = true;
    var postnum = 0;
    //alert(startnum+" "+stackid);
    $.ajax({
        type     : "GET",
        cache    : false,
        url      : 'https://stacksity.com/php/feed.php',
        crossDomain : true,
        data     : {id : stackid , start : startnum , session_id: id , latitude : latpoint, longitude : longpoint },
        dataType : "html",
        success  : function(data) {
            //alert(data);
            if(data=="null"||data==''){
                loading = false;
                checkEnd(postnum);
            }else{
                data = JSON.parse(data);
                //if(startnum>19){
                //    var div = activepage.find(".extracontainer");
                //    activepage.find('.item:lt('+data.length+')').remove();
                //    div.scrollTop = div.scrollHeight;
                //    alert(data.length);
                //}
                $.each(data, function(index, element) {
                    if(element.posttype == 0){
                        activepage.find('.feed').append(linkspost(element));
                    }else if(element.posttype == 1){
                        activepage.find('.feed').append(textspost(element));
                    }else if(element.posttype == 2){
                        activepage.find('.feed').append(imagepost(element));
                    }else if(element.posttype == 3){
                        activepage.find('.feed').append(videopostfeed(element));
                    }
                    postnum++;
                });
                loading = false;
                bottom = false;
                startnews = startnews + 10;
                activepage.data("startnews", startnews);
                checkEnd(postnum);
            }
        },
        error: function(request) {
            if(request.status == 0) {
                $('.scroll').html('<p>You\'re offline :(</p>');
            }else{
                alert("connection arror");
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
    activep.find('.scroll').html('<p>Loading Posts</p>');
    if(activep.data("stack_id")==null&&!postbox){
        bannerset(activep, stackid);
    }else{
        var scrollpos = activep.find(".extracontainer").scrollTop();
        if(scrollpos==0){
            activep.find(".feed").empty();
            activep.data("startnews", 0);
            startnews = 0;
            startNews(startnews, activep, stackid);
        }else if(scrollpos<4000){
            activep.find(".extracontainer").stop().animate({ scrollTop : 0 }, 1000, function(){
                activep.find(".feed").empty();
                startnews = 0;
                startNews(startnews, activep, stackid);
                activep.data("startnews", 0);
            });
        }else{
            //activep.find(".extracontainer").scrollTop(0);
            activep.find(".feed").empty();
            startnews = 0;
            startNews(startnews, activep, stackid);
            activep.data("startnews", 0);
        }
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
    $("#fs").empty();
    getStacks($('#fs'),2);
    $(".fstack").show();
    $(".fusers").hide();
    $(".rstack").hide();
}
function use(){
    //element.parent().siblings().children().removeClass("active");
    //element.addClass("active");
    $("#fu").empty();
    getStacks($('#fu'),1);
    $(".fstack").hide();
    $(".fusers").show();
    $(".rstack").hide();
}
function ex(){
    //element.parent().siblings().children().removeClass("active");
    //element.addClass("active");
    $(".fstack").hide();
    $(".fusers").hide();
    $(".rstack").show();
}

//refreshes the page and stuff
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
    }else if(goto == "-2"){
        refreshPage(2);
    }else{
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
                //alert(option);
                if(op==7){
                    $.mobile.back();
                }else{
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
$(document).on("click", "#private", function(e){
    e.preventDefault();
    $('#privatefield').val(1);
    $("#toppost").submit();
});
var postdata = null;
$(document).on('submit', "#toppost", function(e){
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(function(position){
            makepost("&lat="+position.coords.latitude+"&long="+position.coords.longitude);
    },
    function(error){
        makepost("");
    });
});
function makepost(info){
    if(!posting){
        checklogin();
        var data = $("#toppost").serialize()+"&stack="+stackid+"&user_value="+is_user+"&session_id="+id+info;
        posting = true;
        $('#pbutton').html('<div class="loader">Loading...</div>');
        $('#private').html('<div class="loader">Loading...</div>');
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
                $('#pbutton').html('Post');
                $('#private').html('Private');
            },
            error: function(request) {
                if(request.status == 0) {
                    alert("You're offline!");
                }else{
                    alert("Error Connection");
                }
                $('#pbutton').html('Post');
                $('#private').html('Private');
                posting = false;
            }
        });
    }
    return false;
}
function parsePostData(){
    var data = postdata;
    if(data.length<=2) {
        if(data!=3){
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
    $('#pbutton').html('Post');
    $('#private').html('Private');
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
/* Drag'n drop stuff */
function upload(file) {
    /* Is the file an image? */
    if (!file || !file.type.match(/image.*/)) return;
    /* It is! */
    document.body.className = "uploading";
    $('#imageid').val("uploading...");
    /* Lets build a FormData object*/
    var fd = new FormData(); // I wrote about it: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
    fd.append("image", file); // Append the file
    var xhr = new XMLHttpRequest(); // Create the XHR (Cross-Domain XHR FTW!!!) Thank you sooooo much imgur.com
    xhr.open("POST", "https://api.imgur.com/3/image.json"); // Boooom!
    xhr.onload = function() {
        // Big win!
        var link = JSON.parse(xhr.responseText).data.link;
        $('#link').val(link);
        $('#imageid').val(file.name);
        $('#imagePostPreview').attr('src', link);
        $('.background-image').show();
        document.body.className = "uploaded";
    }

    xhr.setRequestHeader('Authorization', 'Client-ID 2caf3e86e092d76'); // Get your own key http://api.imgur.com/

    // Ok, I don't handle the errors. An exercise for the reader.
    /* And now, we send the formdata */
    xhr.send(fd);
}
function stackTrace() {
    var err = new Error();
    return err.stack;
}

$(document).on('tap','.postlink',function(e){
    e.preventDefault();
    $(this).trigger('click');
});

/*post stuff*/
$(document).on('click','a',function(e){
    if($(this).hasClass("toPost")){
        e.preventDefault();
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
    }else{
        var link = $(this).attr("href");
        if(link==null||$(this).hasClass("ui-input-clear")){
        }else{
            e.preventDefault();
            if(link.charAt(0)=="/"){
                if(link.charAt(1)=="u"){
                    linkToStack(link.substring(3));
                }else if(link.charAt(1)=="$"){
                    linkToStack(link.substring(1));
                }
            }else{
                window.open(link, '_blank', 'location=yes,enableViewportScale=yes');
            }
        }
    }
});

function toPost(link){
    postid = link;
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
            alert("post not found");
            $.mobile.back();
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
                    $("#commentfeed").empty();
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
        edittime = " | edited "+element.edit;
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
        reply = '<a class="reply" onclick="swapReply(this)">reply</a>'+del+'<form class="replycomment" style="display: none" data-depth="'+depth+'"><div class="postcon replycon">'+
        '<input type="hidden" name="postid" value="'+postid+'">'+
        '<input type="hidden" name="commentid" value="'+element.comment_id+'">'+
        '<div id="textpost">'+
        '<textarea name="text" class="expanding" id="text" placeholder="Write something here..." rows="2" required></textarea>'+
        '</div></div>'+
        '<div class="postsub commentsub"><label class="commentl"><span class="cancelreply" onclick="backReply(this)">Cancel</span></label>'+
        '<button type="submit" class="postb replypost commentb">Post</button>'+
        '</div></form>';
    }
    return '<div class="child '+depthtext+'">'+
    '<div class="comment" data-commentid="'+element.comment_id+'" data-depth="'+element.depth+'">'+
    vote+
    '<div class="comment-content">'+
    '<p class="tagline"><a class="commentcollapse">[–]</a> <a class="comment_link" href="/stack.php?id='+element.user_stack+'" class="">'+element.username+element.flair+'</a> | <time>'+element.created+'</time>' +
    ' | #'+element.comment_id + "<span class='edittime'>" + edittime +'</span></p>'+
    '<div class="commenttext"><div class="commentcontent">'+element.content +"</div>"+ reply +'</div>'+ edit +
    '</div> </div> </div>';
}

$(document).on("click", ".commentcollapse", function () {

    // Set up collapse state variables to keep track of opened/closed comments
    var collapsestate = 0;
    var collapsecheck = $(this).attr('class');

    // Checks if comments have already been collapsed
    if (collapsecheck == "commentcollapse collapsed") {
        collapsestate = 1;
    } else {
        collapsestate = 0;
    }

    // Depending on whether it's collapsed, expand/collapse the children comments and the comment
    // itself except for the title line with username, etc.
    if (collapsestate) {
        $(this).parent().parent().children(".commenttext").show();
        $(this).parent().parent().parent().children(".cvote").show();
        $(this).parent().parent().parent().parent().children(".child").show();
        this.innerHTML = "[–]";
        $(this).removeClass("collapsed");
    } else {
        $(this).parent().parent().children(".commenttext, .editcon").hide();
        $(this).parent().parent().parent().children(".cvote").hide();
        $(this).parent().parent().parent().parent().children(".child").hide();
        this.innerHTML = "[+]";
        $(this).addClass("collapsed");
    }
});

$(document).on('click', '.editcom', function(e) {
    $(this).parent().siblings().show();
    $(this).parent().hide();
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
                el.siblings(".tagline").children(".edittime").html(" | edited now");
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
        showComment(data,item);
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
    $(".replycomment").hide();
    $(el).siblings('.replycomment').show();
}
function backReply(el){
    $(el).closest('.replycomment').siblings('.reply').show();
    $(el).closest('.replycomment').hide();
}
$(document).on('submit', '.replycomment', function(e){
    e.preventDefault();
    if(!posting){
        checklogin();
        posting = true;
        $(this).children('.replypost').html('<div class="loader">Loading...</div>');
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
                    el.siblings('.reply').show();
                    el.hide();
                }
                posting = false;
            },
            error: function(xhr, status, error) {
                alert("error"+ xhr.responseText);
                $(this).children('.replypost').html('Post');
                $(this).siblings('.reply').show();
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
    if(!posting){
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
var deletecom_id = 0;

$(document).on('click', '.deletecom', function(e) {
    deletecom_id = $(this).data('delete');
    $('#commentdelete').modal({keyboard: true});
    return false;
});
function delcom(){
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
            $('#commentdelete').modal('hide');
        },
        error: function(xhr, status, error) {
            alert("error"+ xhr.responseText);
            $('#commentdelete').modal('hide');
        }
    });
}

/*--notification system--*/
var newcountNotif = 0;
function notification(element, seen, stringText){
    return '<div class="notification '+seen+' toPost" onclick="toPost('+element.link+')" data-note="'+element.notification_id+'"><b>'+element.username+'</b> '+stringText+' P#'+element.link+'<br><span class="note-time">'+element.created+'</span></div>';
}
var cycle = false;
var mark = false;
function set(){
    setInterval(function(){
        if(cycle){
            cycle = false;
        }else{
            if(option!=3){
                getNotification();
            }
        }
    },30000);
}
function openNote(){
    cycle = true;
    mark = true;
    getNotification();
}
function getNotification(){
    $(".note-header").empty();
    $(".notescroll").html('<img class="note-loader" src="img/post/ajax-loader.gif" />');
    checklogin();
    newcountNotif = 0;
    $.getJSON('https://stacksity.com/php/getnotification.php', {timestamp: 0, session_id: id}, function(data){
        if(data!=null){
            $.each(data, function(index, element) {
                var seen = '';
                if(element.seen==0){
                    seen = 'unseen';
                    newcountNotif++;
                }
                var content ='';
                if(element.note_type==0){
                    content =  notification(element, seen, "posted to your stack");
                }else if(element.note_type==1){
                    content =  notification(element, seen, "commented on your post");
                }else if(element.note_type==2){
                    content =  notification(element, seen, "replied to your comment");
                }else if(element.note_type==3){
                    content =  notification(element, seen, "tagged you in a comment");
                }else if(element.note_type==4){
                    content =  notification(element, seen, "tagged you in a post");
                }
                $(".note-header").prepend(content);
            });
        }
        if(mark){
            mark=false;
            markseen();
        }else{
            if(newcountNotif!=0){
                $('#notestack').addClass('newnote');
            }
        }
        $(".notescroll").html('No More Notifications to Show');
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