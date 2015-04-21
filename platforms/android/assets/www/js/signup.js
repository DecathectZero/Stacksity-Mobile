function success(){
    $("#info").slideUp();
    $("#inforeg").show();
}
function errorinfo(inner){
    $('#error-info').html(inner);
    $('#error-info').slideDown();
}
$("#account").on('submit', function(e){
    e.preventDefault();
    if($('#inputPassword').val().length<7){
        errorinfo("Please make your password longer than 6 characters");
    }else{
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : "http://stacksity.com/php/payment.php",
            data     : $(this).serialize(),
            dataType : "html",
            crossDomain : true,
            success  : function(data) {
                if(data=="3"){
                    success();
                }else if(data=="2"){
                    errorinfo("This Username is already taken");
                }else if(data=="1"){
                    errorinfo("This Email is already taken");
                }else if(data=='10'){
                    errorinfo("No spaces in your username please");
                }else if(data=='11'){
                    errorinfo("Usernames can't start with $");
                }else if(data=='12'){
                    errorinfo("Usernames can't be only numbers");
                }else{
                    errorinfo("Oops something went wrong with the server, error code: "+data);
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });

    }
});