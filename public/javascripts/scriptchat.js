 /*** get host */ 
 
 window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 const   recognition = new SpeechRecognition();
         recognition.interimResults = true;
         recognition.lang = 'en-US';

         recognition.addEventListener('result', event => {
             const transcript = Array.from(event.results)
                 .map(result => result[0])
                 .map(result => result.transcript)
                 .join(''); 
             // If you make a pause,
             // you should probably create a new container for the next portion of recognized content
             if (event.results[0].isFinal) {            
                 console.log('isFinal:' + transcript);       
                 //ControlTranscript(transcript); 
                 document.getElementById('message-input').value= transcript;                                                                                                                                     
             }
             if(transcript.includes('stop')){
               //OpenMic('stop');
             } 
             //console.log(transcript);             
         });


document.body.onclick = function() {

   
    try{
        recognition.start();
        // recognition.addEventListener('stop', e => {
        //   e.preventDefault()
        //   recognition.start();
        //   messageInput.focus();
        // })
        //recognition.start();
       // console.log('Ready to receive a color command.');

    }catch(error){
      console.log(error);
    }
}

const synth = window.speechSynthesis;
const mesagetext = document.querySelector('#mesagetext');
const play = document.querySelector('#play');
const rate = document.querySelector('#rate');

function speak() {
  if (synth.speaking) {
    synth.cancel();
  }
  const utterThis = new SpeechSynthesisUtterance(mesagetext.textContent);
  utterThis.addEventListener('error', () => {
    console.error('SpeechSynthesisUtterance error');
  });
  utterThis.rate = rate.value;
  synth.speak(utterThis);
  messageInput.focus();
}

play.addEventListener('click', speak);

function Bot_SpeechSynthesisUtterance(message){
  //appendMessage(message);
  var u = new SpeechSynthesisUtterance();                                 
  u.text = message;
  u.lang = 'en-US';
  u.rate = rate.value;
  //u.volume = 0.5;
  u.onend = function(event) {  
      var vTime = formatDate(new Date());
      console.log('Finished: '  + vTime);                   
  }   

  speechSynthesis.speak(u);

}   


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
//const messageFormNext = document.getElementById('send-container-next');
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

//var conversation_stepid = 0;
var conversation_sort_no = 1;
var conversationArray = [];


var _j=0;
var _iu=0; 
 //for key time stab 
var _Next =0;
var _NextList = [];
var getorder_productList = [];
var ListOrders_products_id = [];
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
   scrollspyID++;
   return false;
 }

 function OpenMic(vtype){
    try{
        if(vtype=='open'){
          //send_mic_open.visitble = false;
          //send_mic_stop.visitble = true;       
         //recognition.addEventListener('stop', recognition.start);   
          recognition.start(); 
        }else{
          //send_mic_open.visitble = true;
          //send_mic_stop.visitble = false;
          //recognition.addEventListener('stop', recognition.start);    
          recognition.stop();
        }
    }catch(error){
      console.log('Error mic: ' + error);
    }

 }
 
 //client message
 //รับเสียงจากหน้า page to text
 //ส่งเข้า server 
 //ปิดไมคกรณีไม่ต่อเนื่อง  -  เปิดไมคกรณีต่อเนื่อง
 function appendMessage_client(message){
  try{
    var _contents_id  = contents_subdetailList[_j].contents_id;
    var _products_id  = contents_subdetailList[_j].products_id;
    var _contents_type  = contents_subdetailList[_j].contents_type;
    var _contents_name  = contents_subdetailList[_j].contents_name;
    var _subid  = contents_subdetailList[_j].subid;
    var _sort_scription  = contents_subdetailList[_j].sort_scription;
    var _subscription  = contents_subdetailList[_j].subscription;
    var _subscription_ans  = contents_subdetailList[_j].subscription_ans;
    var orpid = ListOrders_products_id[0].orders_products_id;
      socket.emit('send-message-client-listener',{
        sender: sender, 
        namesys: namesys, 
        message: message,
        order_products_id: orpid,
        contents_id: _contents_id, 
        products_id: _products_id, 
        contents_type: _contents_type, 
        contents_name: _contents_name, 
        subscription: _subscription,
        uid: userid,  
      });
      appendMessageClient(message);   

  }catch(error){
    console.log(error);
  }           
 }

 function client_listener(message){
  try{
    if(sender == '' || sender ==null){
      window.location.href = hosts;
    }else{
        socket.emit('send-message-client-listener',{
          sender: sender, 
          namesys: namesys, 
          message: message,
          order_products_id: '0',
          contents_id: '4000', 
          products_id:  '0', 
          contents_type: 'ALL', 
          contents_name: 'ALL', 
          subscription: message,
          uid: userid,        
        });       
    }

  }catch(error){

  }

}
//รับข้อความจาก server : bot-listener
socket.on('message-bot', data => {
  appendMessage(`bot-listener --> message-bot : ${data.name}: ${data.message}`) 

  //ส่งข้อความไปพูดเสียง bot
  Bot_SpeechSynthesisUtterance(data.message)
  scrollspyID++;
  console.log('chat-message-bot : '  + data)
})

//Server ตอบรับข้อความจาก client แล้ว
socket.on('chat-message-bot', data =>{
  appendMessage(`รับข้อมูลจาก: ${data.name}: ${data.message}`) 
    //ส่งข้อความไปพูดเสียง bot
    Bot_SpeechSynthesisUtterance(data.message)
    scrollspyID++;
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
 
/**
 * 

messageFormNext.addEventListener('submit', e => {
    e.preventDefault()
    // ForNextConents();
    // OpenMic('stop');
})
 */
messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value  
   if(message != ''){
      ControlStepByStep(message , 'U');
   }
  //appendMessage_client(`${message}`) 
  messageInput.value = ''
  messageInput.focus();
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
                      <p class="fw-bold mb-0 small ">Sig-${_j}.   <i class="bi bi-megaphone-fill"></i></p>
                      <p class="text-light small mb-0 text-wrap "> <i class="bi bi-watch"></i>: ${vTime} ago</p>
                    </div>
                    <div class="card-body small" style="color:aquamarine;">
                         ${message} 
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

function BlockAns(vans, _translate){
  if(vans == '' || vans == null && _translate == '' || vans == null){
    return '';
  }
  var vhtmls ='';
  if(_translate =='' || _translate ==null){}else{
    vhtmls +=` 
    <p cless="text-warning d-inline-flex p-0">
    <span><i class="bi bi-translate"></i></span>
   ["${_translate}"]
            
     </P> `;        
  }
  if(vans =='' || vans ==null){}else{
    vhtmls +=` 

    <p cless="text-body d-inline-flex p-0" style="color: #ffd480;">
    <span> <i class="bi bi-mortarboard"></i></span>   
    [ ${vans} ]
           
     </P> `;   
  }
  if(vhtmls == ''){
    return '';
  }
  return vhtmls;
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
  var nametoUpper = name.substr(0,1).toUpperCase();
  var vhtml = `
  <section id="scrollermessage-${scrollspyID}">
  <div class="col-md-6 col-lg-7 col-xl-7">
      <ul class="list-unstyled text-white">
          <li class="d-flex justify-content-between mb-4">
              <div class="cardchatL card mask-custom w-100">
                <div class="card-header d-flex justify-content-between p-1"
                  style="border-bottom: 1px solid rgba(255,255,255,.3);">
                  <p class="text-light fw-bold mb-0 small ">${name}</p>
                  <p class="text-light small mb-0"><i class="bi bi-watch"></i>Time: ${vTime} ago</p>
                </div>
                <div class="card-body small" style="color:cornsilk">
                  <p class="mb-0">
                    ${message}
                  </p>    
                
                </div>
              </div>                   
                <img src="/images/bg/U.jpg" alt="avatar"
                  class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="60"></img>
           

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
//var jn=0;
  $(document).ready(function(){
 
    $("#action_menu_btn").click(function(){
      $('.action_menu').toggle("slow");  
    });
 
    $("#action_menu_btn_sub").click(function(){
      $('.action_menu_sub').toggle("slow");  
    });

      // $("#action_menu_btn_sub").hover(function()
      //     { 
      //       $('.action_menu_sub').toggle("slow");  
      //     }, function()
      //     {
                  
      //       $('.action_menu_sub').hide("slow");  
      // }); 
            
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
              vul ="<div id='getorder_product' class='d-flex flex-column align-items-stretch flex-shrink-0 bg-white' style='width: 260px;'>";
              vul +=`
                  <p class='d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom'>
                    <svg class='bi pe-none me-2' width='30' height='24'><use xlink:href='#bootstrap'/></svg>
                    <span class='fs-5 fw-semibold'>List order contents.</span>
                  </p>
              `; 
              vul += " <div class='list-group list-group-flush border-bottom scrollarea'>";
           
              $.each(data.data,function(key,value){ 

                getorder_productList.push({    
                  products_id: value.products_id,
                  orders_id: value.orders_id,
                  orders_products_id: value.orders_products_id,
                  products_model: value.products_model,
                  products_price: value.products_price,
                  products_quantity: value.products_quantity,
                  total_minute: value.orders_quantity_minute,
                  total_second: value.orders_quantity_second,                
                });
         
                if(value.orders_products_id !=''){ 
                  vhtml +=`
                        <a href='javascript:GetContents( ${value.products_id} , ${value.orders_products_id})' class='list-group-item  py-3 lh-sm'>
                          <div class='d-flex w-100 align-items-center justify-content-between'>
                            <strong class='mb-1'>Id:${value.orders_products_id}  ${value.products_name}</strong>
                            <small class='text-muted'>hour:${value.products_quantity}</small>
                          </div>
                          <div class='col-10 mb-1 small'> 
                              <mark>
                                                         ${value.products_model} 
                                          : total minute ${value.orders_quantity_minute} 
                                           total second: ${value.orders_quantity_second}
                              </mark>
                          .</div>
                        </a>
                        
                  `;          
                }       
               
                //console.log(vhtml);
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
function GetContents(products_id , orders_products_id ){ 
    //alert(products_id + ' - '  + orders_products_id );
   //console.log(products_id);
   ListOrders_products_id.push({
    orders_products_id: orders_products_id,
   })
  GetContents_id(products_id , orders_products_id);  
}
function GetContents_id(products_id, orders_products_id)
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
                vul ="<div id='getorder_contents' class='d-flex flex-column align-items-stretch flex-shrink-0 bg-white' style='width: 200px;'>";
                vul +=` <span id='sclose' ><i class="bi bi-box-arrow-left"></i></span>
                    <a href='./gstartbrain?${products_id},${orders_products_id},0' class='d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom'>
                      <svg class='bi pe-none me-2' width='30' height='24'><use xlink:href='#bootstrap'/></svg>
                      <span class='fs-5 fw-semibold'>List Contents.  <mark>(Learning brain auto) </mark></span>
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
                            <strong class='mb-1'>Id:${value.sort} ${value.contents_type}</strong>
                            <small class='text-muted'>Sort<${value.sort}></small>
                          </div>
                           
                                <div class='col-10 mb-1 small'><mark>${value.contents_name}. </mark></div>
                           
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
                      images_path5:           value.images_path5, //translate
                      translate:           value.translate, //translate
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
                      translate:              value.translate, //translate
                    });
                    n++;
                }
          
                 
  
                i++;
            }); 
          
            appendMessage_bot('Follow me');
            _j=0;
           // _myInterval_loop = setInterval(function() {LoopContents_Detail()}, 10000);  
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

function  ControlStepByStep(message , status){
   try{
 

    if(status =='U'){
        var _subscription_ans  = contents_subdetailList[_j].subscription_ans;
        var vcheck = message.replace(/[^a-zA-Z ]+/g, "").toLowerCase();
        if(_subscription_ans == '' ||_subscription_ans == null){}else{
            if(vcheck != _subscription_ans.toLowerCase()){
              console.log('Ans XXX');
            }          
        }

          setTimeout(appendMessage_client(`${message}`),9000);      
    }

      _j++;  //step
      setTimeout(LoopContents_Detail(message), 5000);   
    console.log(_j);
   }catch(error){
    console.log(error);
   }
}

//var _j=0;
// function ForNextConents(){
//   try
//   {
//     _Next++; 
//     _j = _NextList[_Next].subid;

//     myStopClearTimeout();  
    
//     //แสดงเหตผล select 
//     var _text = '# Next to page '  + _j;
//     setTimeout(appendMessage(_text), 200);
//     const myTimeout_botspeech = setTimeout(Bot_SpeechSynthesisUtterance(_text), 10000);
//     //
//     _myInterval_loop = setInterval(function() {LoopContents_Detail()}, 10000);  

//   }
//   catch(error)
//   {
//     console.log('Error ForNextConents : ' + error);
//   }

// }


let vtxt_subscription="";
function LoopContents_Detail(){
 
  try{
    var _counts = contents_subdetailList.length;
    console.log(_counts);
    if(_j > (_counts-1)){
       contents_subdetailList = [];
      _NextList = [];
      _Next =0;
      _j=0;       
        var _messages = "The End.";
          setTimeout(appendMessage(_messages), 5000);    
          //myStopClearTimeout();      
          return "";
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
      var _translate  = contents_subdetailList[_j].translate;

      var _listimage = setModal_grammarpicture(_images_path1);
          _listimage += setModal_grammarpicture(_images_path2);
          _listimage += setModal_grammarpicture(_images_path3);
          _listimage += setModal_grammarpicture(_images_path4);
          _listimage += setModal_grammarpicture(_images_path5);
          
      var _ans = BlockAns(_subscription_ans , _translate);    
      
      //_subscription = TxtHeigthLigth(_subscription);
      var vsplit = [];
      var vsplit = _subscription.split(' ');
      vtxt_subscription = "";
      vsplit.forEach(myFunctionText);
      _subscription = vtxt_subscription;

      

      var _t = _subscription + _listimage + _ans;
 
          console.log(_ans);
          setTimeout(appendMessage(' ' + _t), 5000);    
      
          //appendMessage_center(_subscription_ans);     
          //appendMessage_hr_center();
          //mesagetext.textContent
         document.getElementById('mesagetext').textContent = _subscription;
         setTimeout(Bot_SpeechSynthesisUtterance(_subscription), 5000);
         scrollspyID++;
          //Not mic open at code
          //myStopClearTimeout();
            
    }
  }catch(error){
    console.log('Erorr LoopContents_Detail: '  + error);
    return "";
  }
   //_j++;  
   
  
}

function myFunctionText(item, index) {
  //text += index + ": " + item + "<br>"; 
  try{
    if(
      item == 'is' || 
      item == 'are'||
      item == 'am'||
      item == 'I am '   ||  item == 'i am '||
      item == 'He'||    item == 'he'||    item == 'she'||    item == 'She'||    item == 'it'||    item == 'It'||
      item == 'we'||    item == 'We'||    item == 'you'||    item == 'You'||    item == 'they'||    item == 'They'||
      item == 'do'||
      item == 'doing'    || item == 'Doing' ||
      item == 'do not'   || item == 'Do' ||
      item == 'did not'  || item == 'Did' ||
      item == 'done'     || item == 'Done' ||
      item == 'will'     || item == 'Will' ||
      item == 'might'    || item == 'Might' ||
      item == 'can'      || item == 'Can' ||
      item == 'could'    || item == 'Could'    ||
      item == 'should'   || item == 'Should'   ||
      item == 'must'     || item == 'Must'     ||
      item == 'would'    || item == 'Would'    ||
      item == 'you like' || item == 'You like' ||
      item == 'i use to' || item == 'I use to' ||
      item == 'ing' 
      ){
        vtxt_subscription += ' ';
        vtxt_subscription += item.replace(item, '<mark>' + item + '</mark>');   
        vtxt_subscription += ' ';  
    }else{
      vtxt_subscription += ' ' + item;
    }
  }catch(error){
      vtxt_subscription += ' ' + item;
  }
 
  
}

function TxtHeigthLigth(message){
  
  try{

    message = message.replace(message,'is', '<span class=badge text-bg-info>is</span>');
    //message = message.replace('am', "<span class='badge text-bg-info'>am</span>");
    //message = message.replace('are', "<span class='badge text-bg-info'>are</span>");
     
  }catch(error){
    console.log(error);
  }
  return Txt;
}
function myStopClearTimeout() {
  clearTimeout(_myInterval_loop);
}


  var Interval ;
  var seconds = 0; 
  var tens = 0; 
  var appendTens = document.getElementById("tens")
  var appendSeconds = document.getElementById("seconds")
  //var buttonStart = document.getElementById('button-start');
  document.getElementById('button-start').addEventListener('click', () =>{
    client_listener('ONSTART');
    Interval = setInterval(startTimer, 10);
  })

  document.getElementById('button-stop').addEventListener('click', () =>{
    client_listener('ONSTOP');
    clearInterval(Interval);
  })
  window.onload = function () {
      clearInterval(Interval);
      Interval = setInterval(startTimer, 10);
      client_listener('ONSTART');
  }

function startTimer () {
    tens++; 
    
    if(tens <= 9){
      appendTens.innerHTML = "0" + tens;
    }
    
    if (tens > 9){
      appendTens.innerHTML = tens;
      
    } 
    
    if (tens > 99) {
      console.log("seconds");
      seconds++;
      appendSeconds.innerHTML = "0" + seconds;
      tens = 0;
      appendTens.innerHTML = "0" + 0;
    }
    
    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }
  
  }




