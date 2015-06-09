var id = window.localStorage.getItem('session_id');

$(document).on('click', '.vbutton', function(){
    var vid = $(this).closest('.item').data("post");
    var name = $(this).attr("name");
    var dataString = 'id='+ vid +"&session_id="+id;
    var parent = $(this);
    var votes = parseInt(parent.siblings(".count").html());
    if (name=='up') {
        if(parent.hasClass('stack-up')){
            parent.siblings(".count").html(votes-1);
            parent.removeClass('stack-up');
        }else{
            var x = parent.siblings(".stackdown");
            if(x.hasClass('stack-down')){
                parent.siblings(".count").html(votes+2);
                x.removeClass('stack-down');
                parent.addClass('stack-up');
            }else{
                parent.siblings(".count").html(votes+1);
                parent.addClass('stack-up');
            }
        }
        $.ajax({
            type: "POST",
            url: "https://stacksity.com/php/stackup.php",
            data: dataString,
            cache: false,
            crossDomain : true,
            success: function(data){
                //alert(data+"stackup");
            }
        });
    }else{
        if(parent.hasClass('stack-down')){
            parent.removeClass('stack-down');
            parent.siblings(".count").html(votes+1);
        }else{
            var x = parent.siblings(".stackup");
            if(x.hasClass('stack-up')){
                parent.siblings(".count").html(votes-2);
                x.removeClass('stack-up');
                parent.addClass('stack-down');
            }else{
                parent.siblings(".count").html(votes-1);
                parent.addClass('stack-down');
            }
        }
        $.ajax({
            type: "POST",
            url: "https://stacksity.com/php/stackdown.php",
            data: dataString,
            cache: false,
            crossDomain : true,

            success: function(data)
            {
                //alert(data+"stackdown");
            }
        });
    }
    return false;
});/**
 * Created by killswitch on 3/22/2015.
 */
$(document).on('click', '.cbutton', function(){
    var cid = $(this).closest('.comment').data("commentid");
    var name = $(this).attr("name");
    var dataString = 'id='+ cid +"&session_id="+id;
    var parent = $(this);
    var count = $(this).siblings('.score');
    var votes = parseInt(count.html());
    if (name=='up') {
        if(parent.hasClass('stack-up')){
            count.html(votes-1);
            parent.removeClass('stack-up');
        }else{
            var x = parent.siblings(".stackdown");
            if(x.hasClass('stack-down')){
                count.html(votes+2);
                x.removeClass('stack-down');
                parent.addClass('stack-up');
            }else{
                count.html(votes+1);
                parent.addClass('stack-up');
            }
        }
        $.ajax({
            type: "POST",
            url: "https://stacksity.com/php/poststackup.php",
            data: dataString,
            cache: false,

            success: function(data){
            }
        });
    }else{
        if(parent.hasClass('stack-down')){
            parent.removeClass('stack-down');
            count.html(votes+1);
        }else{
            var x = parent.siblings(".stackup");
            if(x.hasClass('stack-up')){
                count.html(votes-2);
                x.removeClass('stack-up');
                parent.addClass('stack-down');
            }else{
                count.html(votes-1);
                parent.addClass('stack-down');
            }
        }
        $.ajax({
            type: "POST",
            url: "https://stacksity.com/php/poststackdown.php",
            data: dataString,
            cache: false,

            success: function(data){
            }
        });
    }
    return false;
});/**
 * Created by killswitch on 3/22/2015.
 *//**
 * Created by killswitch on 3/24/2015.
 */
