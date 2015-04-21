var stackid = localStorage.getItem("stack");
/**
 * Created by killswitch on 4/18/2015.
 */
function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[7].length==11){
        return match[7];
    }else{
        //alert("Url incorrecta");
    }
}
function getlink(el, link){
    if(el==0||post){
        return '<a href = "'+link+'" style="text-decoration:none" onclick = "window.open(\''+link+'\' , \'_blank\', \'location=yes\', EnableViewPortScale=yes); return false;">';
    }
    return '<a href="post.html">';
}
function comments(element){
    var del = '';
    if(element.delete){
        del = '<a class="delete commentlink" data-delete="'+element.post_id+'">delete<span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
    }
    if(!post){
        return '<a class="commentlink" href="/p/'+element.post_id+'" target="_blank">'+element.comments+' comments</a>'+del+'<span class="pid">Post#'+element.post_id+'</span>';
    }else{
        return del+'<span class="pid">Post#'+element.post_id+'</span>';
    }
}
function priv(priv){
    if(priv == 1){
        return "privatepost";
    }else{
        return "";
    }
}
function stacknames(from, from_id, too, too_id){
    var stack_name = '<a class="stacklink" href="stack.html" data-link="'+from_id+'">'+ from + '</a> ';
    if(stackid == 0){
        if(from_id==too_id){
            stack_name += ' to <a class="stacklink" href="stack.html" data-link="'+from_id+'">$self</a>';
        }else{
            stack_name += ' to <a class="stacklink" href="stack.html" data-link="'+too_id+'">'+too+'</a>';
        }
    }
    return stack_name;
}
function voting(votetype, count){
    var re = '<div class="vbutton stackup" name="up"></div>'+
        '<p class="count">'+count+'</p>'+
        '<div class="vbutton stackdown" name="down"></div>';
    if(votetype == 0){
        re = '<div class="vbutton stackup" name="up"></div>'+
        '<p class="count">'+count+'</p>'+
        '<div class="vbutton stackdown stack-down" name="down"></div>';
    }else if(votetype == 2){
        re = '<div class="vbutton stackup stack-up" name="up"></div>'+
        '<p class="count">'+count+'</p>'+
        '<div class="vbutton stackdown" name="down"></div>';
    }
    return re;
}
function imagepost(element){
    var count = element.upstacks-element.downstacks;
    var vote = voting(element.vote, count);

    return '<div class="item ipost '+priv(element.private)+'" id="'+element.post_id+'">' +
    '<div class="vote login">'+
    vote +
    '</div>'+
    '<div class="textcon"><div class="linkwrapper">' +
    getlink(element.post_id, element.link)+'<h4>' + element.title + '</h4></a>' +
    '<p>'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id)+' | '+ element.created +'</p>' +
    getlink(0, element.link) +
    '<div class="imagewrap">'+element.embed+'</div>' +
    '</a>' +
    '<div class="textfeed"><p class="content">'+element.text+'</p><p class="content"></p></div></div>'+comments(element)+
        /*'<p class="link">'+link.substring(0,100)+'</p>'+<a href="'+element.link+'">See More</a>*/
    '</div>' +
    '</div>';
}
function videopost(element){
    var count = element.upstacks-element.downstacks;
    var vote = voting(element.vote, count);

    return '<div class="item vpost '+priv(element.private)+'" id="'+element.post_id+'">' +
    '<div class="vote login">'+
    vote +
    '</div>'+
    '<div class="textcon">' +
    getlink(element.post_id, element.link)+'<h4>' + element.title + '</h4></a>' +
    '<p>'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id)+' | '+ element.created +'</p>' +
        //'<a href="/'+element.link+'" target="_blank">' +
    '<div class="linkwrapper"><div class="videowrapper">'+element.embed+'</div>'+
    '<div class="textfeed"><p class="content">'+element.text+'</p></div></div>'+comments(element)+
    '</div>' +
    '</div>';
}
function linkspost(element){
    var count = element.upstacks-element.downstacks
    var vote = voting(element.vote, count);
    return '<div class="item lpost '+priv(element.private)+'" id="'+element.post_id+'">' +
    '<div class="vote login">'+
    vote +
    '</div>'+
    '<div class="textcon">' +
    getlink(element.post_id, element.link)+'<h4>' + element.title + '</h4></a>' +
    '<p>'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id)+' | '+ element.created +'</p>' +
    '<div class="linkwrapper">' + getlink(0, element.link) +
    '<div class="linkcon"></div><div class="linkcontainer"><img class="linkimage" src="'+ element.image +'"></div>' +
    '<p class="content">'+element.text+'</p></a>' +
    '</div>'+comments(element)+'</div>'+
    '</div>' +
    '</div>'
}
function textspost(element){
    var count = element.upstacks-element.downstacks;
    var vote = voting(element.vote, count);
    var link;
    if(post){
        link = '<h4>' + element.title + '</h4>';
    }else{
        link =   getlink(element.post_id, element.link)+'<h4>' + element.title + '</h4></a>';
    }
    return '<div class="item tpost '+priv(element.private)+'" id="'+element.post_id+'">' +
    '<div class="vote login">'+
    vote +
    '</div>'+
    '<div class="textcon">' +
    link +
    '<p>'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id)+' | '+ element.created +'</p>' +
    '<p class="content">'+$("<textarea/>").html(element.text).text()+'</p>' +comments(element)+
    '</div>' +
    '</div>';
}/**
 * Created by killswitch on 3/21/2015.
 */
var user_id = localStorage.getItem("user_id");

var delete_id = 0;
$(document).on('click', '.delete', function(e) {
    delete_id = $(this).data('delete');
    $('#delpost').modal();
    return false;
});
$('#deletelink').click(function(e){
    $.ajax({
        type     : "GET",
        cache    : false,
        url      : 'http://www.stacksity.com/mobile-php/deletepost.php',
        data     : {delid : delete_id, user_id: user_id},
        success  : function(data) {
            if(data==0){
                $('#'+delete_id).fadeOut();
            }else{
                alert(data);
            }
        },
        error: function(xhr, status, error) {
            alert("error"+ xhr.responseText);
        }
    });
    $('#delpost').modal('hide');
});
$(document).on('click', '.stacklink', function(e) {
    localStorage.setItem('stack', $(this).data("link"));
});