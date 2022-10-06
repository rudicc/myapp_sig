const urlname = document.getElementById('urlname').value;
const image_input = document.querySelector("#fileupload");
 
var vupload_image = "0";
image_input.crossOrigin = 'Anonymous';
image_input.addEventListener("change", function() {
  alert(image_input.value);
  vupload_image = image_input.value;

});


async function uploadFile() {
    try{
        //var formData  = document.getElementById('fileupload');
 
        $(document).ready(function (){   
            var vurl = urlname + "/api/base-recipt/" + vupload_image;
            //console.log(vurl);
            $.ajax({
                url: vurl ,
                method: "PORT",
                data: {action: 'fetch'},
                dataType: "JSON",
                success:function(data){
                console.log('Success :' + data.data);
                                
                }, error: function(err){
                console.log('Error : ' + err);
                }
            });                  
        });  
          



          
 


    }catch(err){
        console.log(err);
    }
}
 