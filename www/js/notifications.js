var newcountNotif = 0;
var first = true;
var title = $('title').text();
/*ajax();
 function ajax(){
 $.getJSON('/php/getnotification.php', {timestamp: 0}, function(data){
 alert(data);
 });
 }*/
getNotification();
set();
function set(){
    setInterval(function(){
        getNotification();
    },30000);
}
function notification(element, seen, stringText){
    return '<li><div class="notification '+seen+'" onclick="document.location.href=\'/p/'+element.link+'\'" data-note="'+element.notification_id+'"><a href="https://stacksity.com/u/'+element.stack_id+'" class="username">'+element.username+'</a> '+stringText+'#'+element.link+'<br><span class="note-time">'+element.created+'</span></div></li>';

}
function getNotification(){
    var times = $('#note-timestamp').val();
    if(first){
        $(".note-header").after('<img class="note-loader" src="/img/post/ajax-loader.gif"/>');
    }
    $.getJSON('/php/getnotification.php', {timestamp: times}, function(data){
        var firsttime = true;
        if(null==data){
            if(first){
                $('.note-loader').remove();
                $(".note-header").after('<li id="no-note"><a>No Notifications to Show</a></li>');
            }
        }else{
            $('#no-note').remove();
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
                $(".note-header").after(content);
                $('#note-timestamp').val(element.note_time);
                if(firsttime){
                    firsttime = false;
                }
            });
        }
        bottom = false;
        if(first){
            $('.note-loader').remove();
        }
        if(newcountNotif!=0){
            if($('#note-drop').hasClass('open')){
                markseen();
            }else{
                $('.counter').show();
                var thetitle = $('title').text();
                $('.counter').html("new");
                if(thetitle.charAt(0)=='['){
                    //$('title').text('['+newcountNotif+'] '+thetitle);
                }else{
                    $('title').text('[new] '+thetitle);
                    // $('title').text('['+newcountNotif+'] '+thetitle);
                }
            }
        }
        if(first) first = false;
    });
}
function markseen(){
    //info = JSON.stringify(info);
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : '/php/markseen.php',
        success  : function(data) {
        },
        error: function(xhr, status, error) {
            alert("error"+ xhr.responseText);
        }
    });
}
$('#note-drop').on('shown.bs.dropdown', function () {
    $('.counter').fadeOut();
    var thetitle = $('title').text();
    thetitle = thetitle.substring(thetitle.indexOf(']')+1);
    $('title').text(thetitle);

    /*var info = [];
     $( ".unseen" ).each(function( index , element) {
     info[index] = $(element).data('note');
     });*/
    markseen();
});
$('#note-drop').on('hidden.bs.dropdown', function () {
    $('.unseen').removeClass('unseen');
});/**
 * Created by killswitch on 6/23/2015.
 */
