 /*** get host */ 
 let href = window.location.href;
 let pathname = window.location.pathname;
 let protocol = window.location.protocol;
 let hostname = window.location.hostname;
 //console.log(href);
 //console.log(pathname);
 //console.log(protocol);
 //console.log(hostname);
 let hosts = href.replace(pathname,"");
  
 var guides_products =[];
 var scrollspyID = 0;
 const messageContainer = document.getElementById('addmessage-container-guides');
 //divscrollermessage
const divscrollermessage = document.getElementById('divscrollermessage');

 getguides_products();
 function getguides_products(values){
  try{   
    //userid
    //getorder-product
      $(document).ready(function (){
        var vurl = hosts + "/api/getguides-product/" + userid ;
        //console.log(vurl);
          $.ajax({
            url: vurl ,
            method: "GET",
            data:{action: 'fetch'},
            dataType: "JSON",
            success:function(data){
              //console.log(data.data); 
              var n=0;                              
              $.each(data.data,function(key,value){ 
                if(value.description1 !=''){      
                  guides_products.push({
                      n:  n,
                      id: 		            value.id, 
                      description1: 		value.description1, 
                      description2: 		value.description2, 
                      description3: 		value.description3, 
                      image1: 			value.image1, 
                      image2: 			value.image2, 
                      image3: 			value.image3, 
                    });
                } 
                //console.log(value.description1);
                n++;
              });              
 
              
 
              _myInterval_loop = setTimeout(function() {addData()}, 1000); 
            }, error: function(err){
              console.log('Error getorder-product : ' + err);
            }
          });
      });
  }catch(err){
    console.log('getorder_product Error: ' + err);
  }
}
function myStopClearTimeout() {
  clearTimeout(_myInterval_loop);
}

var _myInterval_loop;
var _j=0;
 function addData(){
  var _counts = guides_products.length;
  if(_j==0){_j=guides_products[_j].n; }

  var id= guides_products[_j].id; 
  var description1= guides_products[_j].description1; 
  var description2= guides_products[_j].description2; 
  var description3= guides_products[_j].description3; 
  var image1= guides_products[_j].image1; 
  var image2= guides_products[_j].image2; 
  var image3= guides_products[_j].image3; 
 
  var _listimage = setModal_grammarpicture(image1);
      _listimage += setModal_grammarpicture(image2);
      _listimage += setModal_grammarpicture(image3);      

      var _t ='';
      if(description2 != null){
        _t = description1 + description2 + _listimage;
      }else{
        _t = description1 + _listimage;
      }
 

    if(_counts == _j ){
      myStopClearTimeout();
    }else{
      //add
      setTimeout(appendMessage(_j + ' : ' + _t), 5000);   
    }  
 }

 function appendMessage(message){
  var vhtml = ` 
  <section id="scrollermessage-${scrollspyID}">
    <div class="col-md-6 col-lg-7 col-xl-7">
        <ul class="list-unstyled text-white">
            <li class="d-flex justify-content-between mb-4" >
                <img src="/images/bg/SIG.jpg" alt="avatar"
                  class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60">
                <div class="cardchatR card mask-custom w-100">
                    <div class="card-header d-flex justify-content-between p-1"
                      style="border-bottom: 1px solid rgba(255,255,255,.3);">
                      <p class="fw-bold mb-0">SIG.</p>
                      <p class="text-light small mb-0"><i class="far fa-clock"></i><!></p>
                    </div>
                    <div class="card-body" style="color:aquamarine">
                      <p class="mb-0">
                        ${message}
                      </p>

                    </div>
                </div>
          </li>
        </ul>
    </div>
  </section>
  `;
  const Group_messageElement = document.createElement('div')
  Group_messageElement.innerHTML = vhtml
  messageContainer.append(Group_messageElement)
  scrollspyID++;
  DivScrollerMessage();

}
var vhtab = 300;
function DivScrollerMessage () {    
  divscrollermessage.scrollTop += (vhtab);
}
function setModal(vpicture){
  if(vpicture == '' || vpicture == null){
    return '';
  }
  var vhtml =`
  <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="10000">
          <img src="/images/bg/${vpicture}" class="d-block w-100 h-20" alt="...">
        </div>
      </div>
  </div>
  
  `;
  return vhtml;
}

function setModal_grammarpicture(vpicture){
  if(vpicture == '' || vpicture == null){
    return '';
  }
  var vhtml =`
  <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="10000">
          <img src="/images/guides/${vpicture}" class="d-block w-100 h-20" alt="...">
        </div>
      </div>
  </div>
  
  `;
  return vhtml;
}


////get Product 
