function getlink(el, link){
    if(el==0||post){
        return '<a href = "'+link+'" style="text-decoration:none" onclick = "window.open(\''+link+'\' , \'_blank\', \'location=yes,enableViewportScale=yes\'); return false;">';
    }
    return '<a href="post.html">';
}
function comments(element){
    var del = '';
    if(element.delete){
        del = '<a class="delete commentlink" data-delete="'+element.post_id+'">delete<span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
    }
    if(!post){
        del = '<a class="commentlink" href="/p/'+element.post_id+'" target="_blank">'+element.comments+' comments</a>'+del+'<span class="pid">Post#'+element.post_id+'</span>';
    }else{
        del = del+'<span class="pid">Post#'+element.post_id+'</span>';
    }
    return '<div class="comwrapper"><div class="comwrap">'+del+'</div></div>';
}
function priv(priv){
    if(priv == 1){
        return "privatepost";
    }else{
        return "";
    }
}
function stacknames(from, from_id, too, too_id){
    var stack_name = '<a class="stacklink" data-link="'+from_id+'">'+ from + '</a> ';
    if(stackid == 0 || stackid == -1){
        if(from_id==too_id){
            stack_name += ' to <a class="stacklink" data-link="'+from_id+'">$self</a>';
        }else{
            stack_name += ' to <a class="stacklink" data-link="'+too_id+'">'+too+'</a>';
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
    return '<div class="votewrap" >'+re+'</div>';
}
function imagepost(element){
    var count = element.upstacks-element.downstacks;
    var vote = voting(element.vote, count);

    return '<div class="item ipost '+priv(element.private)+'" id="'+element.post_id+'">' +
    '<div class="textcon"><div class="linkwrapper">' +
    getlink(element.post_id, element.link)+'<h4>' + element.title + '</h4></a>' +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id)+' | '+ element.created +'</p>' +
    getlink(0, element.link) +
    '<div class="imagewrap">'+element.embed+'</div>' +
    '</a>' +
    '<div class="textfeed"><p class="content">'+element.text+'</p></div></div><div class="vote login">'+
    vote +
    '</div>'+comments(element)+
        /*'<p class="link">'+link.substring(0,100)+'</p>'+<a href="'+element.link+'">See More</a>*/
    '</div>' +
    '</div>';
}
function videopost(element){
    var count = element.upstacks-element.downstacks;
    var vote = voting(element.vote, count);

    return '<div class="item vpost '+priv(element.private)+'" id="'+element.post_id+'">' +
    '<div class="textcon">' +
    getlink(element.post_id, element.link)+'<h4>' + element.title + '</h4></a>' +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id)+' | '+ element.created +'</p>' +
        //'<a href="/'+element.link+'" target="_blank">' +
    '<div class="linkwrapper"><div class="videowrapper">'+element.embed+'</div>'+
    '<div class="textfeed"><p class="content">'+element.text+'</p></div></div><div class="vote login">'+
    vote +
    '</div>'+comments(element)+
    '</div>' +
    '</div>';
}
function linkspost(element){
    var count = element.upstacks-element.downstacks
    var vote = voting(element.vote, count);
    return '<div class="item lpost '+priv(element.private)+'" id="'+element.post_id+'">' +
    '<div class="textcon">' +
    getlink(element.post_id, element.link)+'<h4>' + element.title + '</h4></a>' +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id)+' | '+ element.created +'</p>' +
    '<div class="linkwrapper">' + getlink(0, element.link) +
    '<div class="linkcon"></div><div class="linkcontainer"><img class="linkimage" src="'+ element.image +'"></div>' +
    '<p class="content">'+element.text+'</p></a>' +
    '</div><div class="vote login">'+
    vote +
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
    '<div class="textcon">' +
    link +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id)+' | '+ element.created +'</p>' +
    '<p class="content">'+$("<textarea/>").html(element.text).text()+'</p><div class="vote login">'+
    vote +
    '</div>'+comments(element)+
    '</div>' +
    '</div>';
}

var delete_id = 0;
$(document).on('click', '.delete', function(e) {
    delete_id = $(this).data('delete');
    $('#delpost').modal();
    return false;
});
function del(){
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'http://stacksity.com/php/deletepost.php',
        data     : {delid : delete_id, session_id: id},
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
}
