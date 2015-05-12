function success(){
    $("#sinfo").slideUp();
    $("#sinforeg").show();
}
function serrorinfo(inner){
    $('#serror-info').html(inner);
    $('#serror-info').slideDown();
}
$("#account").on('submit', function(e){
    e.preventDefault();
    if($('#inputPassword').val().length<7){
        serrorinfo("Please make your password longer than 6 characters");
    }else{
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : "https://stacksity.com/php/payment.php",
            data     : $(this).serialize(),
            dataType : "html",
            crossDomain : true,
            success  : function(data) {
                if(data=="3"){
                    success();
                }else if(data=="2"){
                    serrorinfo("This Username is already taken");
                }else if(data=="1"){
                    serrorinfo("This Email is already taken");
                }else if(data=='10'){
                    serrorinfo("No spaces in your username please");
                }else if(data=='11'){
                    serrorinfo("Usernames can't start with $");
                }else if(data=='12'){
                    serrorinfo("Usernames can't be only numbers");
                }else{
                    serrorinfo("Oops something went wrong with the server, error code: "+data);
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });

    }
});