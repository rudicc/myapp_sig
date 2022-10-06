 /*** get host */ 
let href = window.location.href;
let pathname = window.location.pathname;
let protocol = window.location.protocol;
let hostname = window.location.hostname;
console.log(href);
console.log(pathname);
console.log(protocol);
console.log(hostname);
let hosts = href.replace(pathname,"");
 

const socket = io(hosts);
const messageContainer = document.getElementById('addmessage-container');
const messageForm = document.getElementById('send-container');
const messageFormNext = document.getElementById('send-container-next');
const messageInput = document.getElementById('message-input'); 
 
const action_menu = document.getElementById('action_menu');
//action_menu_sub
const action_menu_sub = document.getElementById('action_menu_sub');

//send-mic-stop
const send_mic_stop = document.getElementById('send-mic-stop');
const send_mic_open = document.getElementById('send-mic-open');

//divscrollermessage
const divscrollermessage = document.getElementById('divscrollermessage');

//const mic = document.getElementById('send-container-mic');
//const headset = document.getElementById('send-container-headset');

var conversation_stepid = 0;
var conversation_sort_no = 1;
var conversationArray = [];


var _j=0;  //for key time stab 
var _Next =0;
var _NextList = [];
var getorder_productList = [];
var contentsList = [];
var contents_subdetailList = [];
var scrollspyID = 0;
var name =  document.getElementById('username').value;
var namesys = name + '#' + document.getElementById('username').value; // receiver
var userid = document.getElementById('userid').value;//userid
var languages_id = document.getElementById('languages_id').value;//languages_id
var sender = name;

socket.emit('new-user', name)
socket.emit('new-user', namesys)


getorder_product('');
appendMessage_bot('Hello ! Welcome to SIG Speech English');
 function appendMessage_bot(message){
   appendMessage(message);
   socket.emit('bot-listener',{sender: sender, namesys: namesys, message: message});  
   Bot_SpeechSynthesisUtterance(message);
   return false;
 }

 function OpenMic(vtype){
  if(vtype=='open'){
    send_mic_open.visitble = false;
    send_mic_stop.visitble = true;
    //recognition.addEventListener('end', recognition.start);
    recognition.start();
  }else{
    send_mic_open.visitble = true;
    send_mic_stop.visitble = false;
    //recognition.addEventListener('end', recognition.stop);
    recognition.stop();
  }
 }
 
 //client message
 //รับเสียงจากหน้า page to text
 //ส่งเข้า server 
 //ปิดไมคกรณีไม่ต่อเนื่อง  -  เปิดไมคกรณีต่อเนื่อง
 function appendMessage_client(message){
     socket.emit('send-message-client-listener',{sender: sender, namesys: namesys, message: message});
     appendMessageClient(message);   
     
     
     //Ai Load Data step ++

 }

//รับข้อความจาก server : bot-listener
socket.on('message-bot', data => {
  appendMessage(`bot-listener --> message-bot : ${data.name}: ${data.message}`) 

  //ส่งข้อความไปพูดเสียง bot
  Bot_SpeechSynthesisUtterance(data.message)
  console.log('chat-message-bot : '  + data)
})

//Server ตอบรับข้อความจาก client แล้ว
socket.on('chat-message-bot', data =>{
  appendMessage(`รับข้อมูลจาก: ${data.name}: ${data.message}`) 
    //ส่งข้อความไปพูดเสียง bot
    Bot_SpeechSynthesisUtterance(data.message)
    console.log('chat-message-bot : '  + data)
})
socket.on('user-connected', name => {
  //appendMessage(`${name} connected`)
  console.log(`${name} connected`)
})

socket.on('user-disconnected', name => {
  //appendMessage(`${name} disconnected`)
  console.log(`${name} disconnected`)
})
 
messageFormNext.addEventListener('submit', e => {
    e.preventDefault()
    ForNextConents();
    OpenMic('stop');
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value  
  if(message == '#' || message == 'Next'){
    ForNextConents();
    OpenMic('stop');
  }
  appendMessage_client(`${message}`)
  messageInput.value = ''
})
   
function appendMessage(message){
  var vTime = formatDate(new Date());
  const vmodal = setModal('');
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
                      <p class="text-light small mb-0"><i class="far fa-clock"></i> Time: ${vTime} ago</p>
                    </div>
                    <div class="card-body" style="color:aquamarine">
                      <p class="mb-0">
                        ${message}
                      </p>

                    </div>
                    ${vmodal}
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
          <img src="/images/grammar/${vpicture}" class="d-block w-100 h-20" alt="...">
        </div>
      </div>
  </div>
  
  `;
  return vhtml;
}

function BlockAns(vpicture){
  if(vpicture == '' || vpicture == null){
    return '';
  }
  var vhtml =`
  <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="10000">
          <span>Answer : </span>
          <p cless="d-inline-flex p-2">
           [
                ${vpicture}
           ]
          </P>
        </div>
      </div>
  </div>
  
  `;
  return vhtml;
}
 
function appendMessage_bar(message){
  var vhtml = `
  <div class="card-header d-flex justify-content-between p-0"
      style="border-bottom: 1px solid rgba(255,255,255,.3);">
      <h4>${message}</h4>          
  </div> 
  `;
  const Group_messageElement = document.createElement('div')
  Group_messageElement.innerHTML = vhtml
  messageContainer.append(Group_messageElement)
  scrollspyID ++;
  DivScrollerMessage();
}

function appendMessage_hr_center(message){
  if(message ='' || message == null){
    //return '';
    message = '';
  }
  var vTime = formatDate(new Date());
  const vmodal = setModal('');
  var vhtml = ` ${message} <div class="text-success"><hr></div> 
 
  
  `;
  const Group_messageElement = document.createElement('div')
  Group_messageElement.innerHTML = vhtml
  messageContainer.append(Group_messageElement)
  scrollspyID++;
  DivScrollerMessage();

}


//add message menu
function appendMessage_center(message){
  if(message ='' || message == null){
    return '';
  }
  var vTime = formatDate(new Date());
  const vmodal = setModal('');
  var vhtml = ` ${message}
 
  
  `;
  const Group_messageElement = document.createElement('div')
  Group_messageElement.innerHTML = vhtml
  messageContainer.append(Group_messageElement)
  scrollspyID++;
  DivScrollerMessage();

}


//client message
function appendMessageClient(message){
  var vTime = formatDate(new Date());

  var vhtml = `
  <section id="scrollermessage-${scrollspyID}">
  <div class="col-md-6 col-lg-7 col-xl-7">
      <ul class="list-unstyled text-white">
          <li class="d-flex justify-content-between mb-4">
              <div class="cardchatL card mask-custom w-100">
                <div class="card-header d-flex justify-content-between p-1"
                  style="border-bottom: 1px solid rgba(255,255,255,.3);">
                  <p class="fw-bold mb-0">${name}</p>
                  <p class="text-light small mb-0"><i class="far fa-clock"></i>Time: ${vTime} ago</p>
                </div>
                <div class="card-body" style="color:cornsilk">
                  <p class="mb-0">
                    ${message}
                  </p>    
                
                </div>
              </div>
              <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp" alt="avatar"
                class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="60">
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

      
//jquery Event 
var jn=0;
  $(document).ready(function(){
 
    $("#action_menu_btn").click(function(){
      $('.action_menu').toggle("slow");  
    });
 
      $("#action_menu_btn_sub").hover(function()
          { 
            $('.action_menu_sub').toggle("slow");  
          }, function()
          {
                  
            $('.action_menu_sub').hide("slow");  
      }); 
            
});




  $(document).ready(function(){ 
      $("#flip").click(function(){
        $("#panel").slideToggle("slow");
      });
      
   
  });

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
    
  // 👇️ 2021-10-24 16:21:23 (yyyy-mm-dd hh:mm:ss)
  //console.log(formatDate(new Date()));
 
  function formatDate(date) {
    return (
      // [
      //   date.getFullYear(),
      //   padTo2Digits(date.getMonth() + 1),
      //   padTo2Digits(date.getDate()),
      // ].join('-') +
      // ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

function getorder_product(values){
  try{   
    //userid
    //getorder-product
      $(document).ready(function (){
        var vurl = hosts + "/api/getorder-product/" + userid ;
        console.log(vurl);
          $.ajax({
            url: vurl ,
            method: "GET",
            data:{action: 'fetch'},
            dataType: "JSON",
            success:function(data){
              //console.log(data.data);                         
              var vul = "<ul><li>";  
              var vhtml="";
              vul ="<div id='getorder_product' class='d-flex flex-column align-items-stretch flex-shrink-0 bg-white' style='width: 380px;'>";
              vul +=`
                  <p class='d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom'>
                    <svg class='bi pe-none me-2' width='30' height='24'><use xlink:href='#bootstrap'/></svg>
                    <span class='fs-5 fw-semibold'>List Contents</span>
                  </p>
              `; 
              vul += " <div class='list-group list-group-flush border-bottom scrollarea'>";
              $.each(data.data,function(key,value){ 
                if(value.orders_products_id !=''){ 
                  vhtml +=`
                        <a href='javascript:GetContents(${value.orders_products_id})' class='list-group-item  py-3 lh-sm'>
                          <div class='d-flex w-100 align-items-center justify-content-between'>
                            <strong class='mb-1'>${value.products_name}</strong>
                            <small class='text-muted'>hour:${value.products_quantity}</small>
                          </div>
                          <div class='col-10 mb-1 small'>${value.products_model} : total minute${value.orders_quantity_minute} total second: ${value.orders_quantity_second}.</div>
                        </a>
                        
                  `;          
                } 
                console.log(vhtml);
              });              
              vul += `${vhtml} </div> `;
              vul += "  </div> </li></ul>";
              
              const div = document.createElement('div');            
              div.className = "action_menu";
              div.style ="height: 500px; overflow: auto; max-width:auto;";              
              div.innerHTML = vul;
              action_menu.append(div);
            }, error: function(err){
              console.log('Error getorder-product : ' + err);
            }
          });
      });
  }catch(err){
    console.log('getorder_product Error: ' + err);
  }
}

//getorder-contents/
function GetContents(products_id){ 
  GetContents_id(products_id);
}
function GetContents_id(products_id)
{  
  var vhtml = "";
  try{
    $(document).ready(function (){
      var vurl = hosts + "/api/getorder-contents/" + products_id ;
      console.log(vurl);
        $.ajax({
          url: vurl ,
          method: "GET",
          data:{action: 'fetch'},
          dataType: "JSON",
          success:function(data){
            console.log(data.data);
            //contentlist = data.data;
            var i=0;
            var vul = "<ul><li>";
            var vhtml="";
                vul ="<div id='getorder_contents' class='d-flex flex-column align-items-stretch flex-shrink-0 bg-white' style='width: 380px;'>";
                vul +=` <span id='sclose' ><i class="bi bi-box-arrow-left"></i></span>
                    <a href='#' class='d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom'>
                      <svg class='bi pe-none me-2' width='30' height='24'><use xlink:href='#bootstrap'/></svg>
                      <span class='fs-5 fw-semibold'>List Contents</span>
                    </a>
                `; 
                vul += "  <div class='list-group list-group-flush border-bottom scrollarea'>";
            var i =0;
            $.each(data.data,function(key,value){ 
              //conpid,products_id, contents_id, sort, contents_type, contents_name, active     
              if(value.conpid !=''){  
                var  param = value.products_id + ',' + value.contents_id + ',' + value.sort; //+ ',' + value.contents_type + ',' + value.contents_name;        
                contentsList[i] = param;
                  vhtml +=`
                        <a href='javascript:GetContent_detail(${i})' class='list-group-item list-group-item-action py-3 lh-sm'>
                          <div class='d-flex w-100 align-items-center justify-content-between'>
                            <strong class='mb-1'>${value.contents_type}</strong>
                            <small class='text-muted'>Sort<${value.sort}></small>
                          </div>
                          <div class='col-10 mb-1 small'>${value.contents_name}.</div>
                        </a>
                `; 
              }       
              i++;
            });
            vul += `${vhtml}`;
            vul += "   </div> ";
            vul += "  </div> </li></ul>";     

            console.log(vul);

            const div = document.createElement('div');            
            div.className = "action_menu_sub";
            div.style ="height: 500px; overflow: auto; max-width:auto;";              
            div.innerHTML = vul;
            action_menu_sub.append(div);

          }, error: function(err){
            console.log('Error getorder-product : ' + err);
          }
        });    
    });   
  }catch(error){
    console.log(error);
  }
  
}




//var contentsList = [];
//var contents_subdetailList = [];


function GetContent_detail(compid){
  contents_subdetailList = [];
  _NextList = [];
  _Next =0;
  _j=0;

  try{  
    var values = contentsList[compid]; 
    //alert(values);
        GetContent_detail_id(values);
  }catch(error){
    console.log(error);
  }
}
function GetContent_detail_id(params)
{
  var vhtml = "";
  try{
    $(document).ready(function (){
     // var params = products_id + ',' + contents_id + ',' + sort;
     //http://localhost:8080/api/getorder-contents_detail/1,1,1
      var vurl = hosts + "/api/getorder-contents_detail/" + params ;
      console.log(vurl);
        $.ajax({
          url: vurl ,
          method: "GET",
          data:{action: 'fetch'},
          dataType: "JSON",
          success:function(data){
            //console.log(data.data);
            //contentlist = data.data;
            var i=0;
            var n=0;
           

            
            $.each(data.data,function(key,value){               
                 
                contents_subdetailList.push({
                      contents_id:            value.contents_id,
                      products_id:            value.products_id,
                      contents_type:          value.contents_type,
                      contents_name:          value.contents_name,
                      subid:                  value.subid,
                      sort_scription:         value.sort_scription,
                      subscription:           value.subscription,
                      subscription_ans:       value.subscription_ans,
                      sub_keyword:            value.sub_keyword,
                      images_path1:           value.images_path1,
                      images_path2:           value.images_path2,
                      images_path3:           value.images_path3,
                      images_path4:           value.images_path4,
                      images_path5:           value.images_path5, 
                }); 
            
                var _n = value.subscription.substr(0,1);
                if(_n=='#'){
                  _NextList.push({
                      Next: n,
                      contents_id:            value.contents_id,
                      products_id:            value.products_id,
                      contents_type:          value.contents_type,
                      contents_name:          value.contents_name,
                      subid:                  value.subid,
                      sort_scription:         value.sort_scription,
                      subscription:           value.subscription,
                      subscription_ans:       value.subscription_ans,
                      sub_keyword:            value.sub_keyword,
                      images_path1:           value.images_path1,
                      images_path2:           value.images_path2,
                      images_path3:           value.images_path3,
                      images_path4:           value.images_path4,
                      images_path5:           value.images_path5, 
                    });
                    n++;
                }
          
                 
                if(i==0){
                   appendMessage_bot('Follow me');
                }
                i++;
            }); 
          
            _myInterval_loop = setInterval(function() {LoopContents_Detail()}, 5000);            
            //console.log(contents_subdetailList);
          }, error: function(err){
            console.log('Error getorder-contents_detail : ' + err);
          }
        });    
    });   
  }catch(error){
    console.log(error);
  }
  return vhtml;
}
 

var _myInterval_loop ;
//var _j=0;
function ForNextConents(){
  _Next++; 
  _j = _NextList[_Next].subid;
  myStopClearTimeout();
  _myInterval_loop = setInterval(function() {LoopContents_Detail()}, 5000);  
}
function LoopContents_Detail(){
 

   var _counts = contents_subdetailList.length;
   console.log(_counts);
   if(_counts == _j){
      myStopClearTimeout();
      var _messages = "The End.";
         setTimeout(appendMessage(_messages), 200);
   }else{
   

    var _contents_id  = contents_subdetailList[_j].contents_id;
    var _products_id  = contents_subdetailList[_j].products_id;
    var _contents_type  = contents_subdetailList[_j].contents_type;
    var _contents_name  = contents_subdetailList[_j].contents_name;
    var _subid  = contents_subdetailList[_j].subid;
    var _sort_scription  = contents_subdetailList[_j].sort_scription;
    var _subscription  = contents_subdetailList[_j].subscription;
    var _subscription_ans  = contents_subdetailList[_j].subscription_ans;
    var _sub_keyword  = contents_subdetailList[_j].sub_keyword;
    var _images_path1  = contents_subdetailList[_j].images_path1;
    var _images_path2  = contents_subdetailList[_j].images_path2;
    var _images_path3  = contents_subdetailList[_j].images_path3;
    var _images_path4  = contents_subdetailList[_j].images_path4;
    var _images_path5  = contents_subdetailList[_j].images_path5;

    var _listimage = setModal_grammarpicture(_images_path1);
        _listimage += setModal_grammarpicture(_images_path2);
        _listimage += setModal_grammarpicture(_images_path3);
        _listimage += setModal_grammarpicture(_images_path4);
        _listimage += setModal_grammarpicture(_images_path5);
        
     var _ans = BlockAns(_subscription_ans);    
     var _t = _subscription + _listimage + _ans;
        
         setTimeout(appendMessage(_j + ' : ' + _t), 5000);    
    
         //appendMessage_center(_subscription_ans);     

         appendMessage_hr_center();

         const myTimeout_botspeech = setTimeout(Bot_SpeechSynthesisUtterance(_subscription), 5000);
         //Not mic open at code

          
   }

   _j++;    
}
function myStopClearTimeout() {
  clearTimeout(_myInterval_loop);
}

