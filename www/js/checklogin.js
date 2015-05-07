/**
 * Created by killswitch on 4/29/2015.
 */
function checklogin(){
    var id = window.localStorage.getItem('session_id');
    var hashcode = window.localStorage.getItem('hashcode');
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'http://stacksity.com/php/mobileCheckLogin.php',
        data     : {session_id : id, hashcode : hashcode},
        dataType : "html",
        crossDomain : true,
        success  : function(data) {
            if(data=="0"){
                document.location.href = 'index.html';
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