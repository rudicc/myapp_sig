/*** get host */
import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/build/OrbitControls.js';
import { GLTFLoader } from '/build/GLTFLoader.js';
import { RGBELoader } from '/build/RGBELoader.js';

 //libs
 import { GUI } from '/examples/jsm/libs/lil-gui.module.min.js';
 import Stats from '/examples/jsm/libs/stats.module.js'; 

 import { TWEEN } from '/examples/jsm/libs/tween.module.min.js';
 import { TrackballControls } from '/build/TrackballControls.js';
 import { CSS3DRenderer, CSS3DObject } from '/build/CSS3DRenderer.js';
//import { safebrowsing } from 'googleapis/build/src/apis/safebrowsing';

 
 
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
                //console.log('isFinal:' + transcript);       
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
       //console.log('Ready to receive a color command.');
   }catch(error){
     //console.log(error);
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
     //console.log('Finished: '  + vTime);                   
 }   

 speechSynthesis.speak(u);

}   


let href = window.location.href;
let pathname = window.location.pathname;
let protocol = window.location.protocol;
let hostname = window.location.hostname;
 
//console.log(href);
//console.log(pathname);
//console.log(protocol);
//console.log(hostname);
let hosts = href.replace(pathname,"");
let vhost = [];
vhost = hosts.split('?');
//console.log(vhost[0] + ' ' + vhost[1]);
const socket = io(vhost[0]);

const messageContainer = document.getElementById('addmessage-container');
const messageForm = document.getElementById('send-container');
const action_menu_btn_sub = document.getElementById('action_menu_btn_sub');
const messageInput = document.getElementById('message-input'); 

var name =  document.getElementById('username').value;
var namesys = name + '#' + document.getElementById('username').value; // receiver
var userid = document.getElementById('userid').value;//userid
var sender = name;
socket.emit('new-user', name)
socket.emit('new-user-sys', namesys)

var scrollspyID = 0;
var _j =0;
var databrain = [];
var table = [];

//รับข้อความจาก server : bot-listener
socket.on('brain-message-bot',function (data) {
    //appendMessage(`bot-listener --> message-bot : ${data.name}: ${data.message}`) 
  
    //ส่งข้อความไปพูดเสียง bot
    //Bot_SpeechSynthesisUtterance(data.message)
    //console.log('brain-message-bot : '  + data)
  })
  
  //Server ตอบรับข้อความจาก client แล้ว
  socket.on('brain-client-message', function (data){
    //appendMessage(`รับข้อมูลจาก: ${data.name}: ${data.message}`) 
      //ส่งข้อความไปพูดเสียง bot
      //Bot_SpeechSynthesisUtterance(data.message)
      //console.log('brain-client-message : '  + data)
  })
  socket.on('user-connected',  name => {
    //appendMessage(`${name} connected`)
    //console.log(`${name} connected`)
  })
  
  socket.on('user-disconnected', function(name)  {
    //appendMessage(`${name} disconnected`)
    //console.log(`${name} disconnected`)
  })


  function bot_listener(message){
    //socket.emit('bot-listener',{sender: sender, namesys: namesys, message: message});  
  }

  function client_listener(message, _ontype){
    try{
      var products_id = []; 
      products_id = vhost[1].split(',');

      if(sender == '' || sender ==null){
        window.location.href = vhost[0];
      }else{
        if(_ontype=='onload'){
          socket.emit('send-message-client-listener',{
            sender: sender, 
            namesys: namesys, 
            message: 'ONSTOP',
            order_products_id: '0',
            contents_id: '4000', 
            products_id:  '0', 
            contents_type: 'ALL', 
            contents_name: 'ALL', 
            subscription: 'ONSTOP',
            uid: userid,        
          });            
        }
        socket.emit('send-message-client-listener',{
          sender: sender, 
          namesys: namesys, 
          message: message,
          order_products_id: products_id[1],
          contents_id: '5000', 
          products_id: products_id[0], 
          contents_type: 'ALL', 
          contents_name: 'ALL', 
          subscription: message,
          uid: userid,        
        });     
        


      }

    }catch(error){

    }
 
  }

  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const message = messageInput.value  
    client_listener(`${message}` , '')
    appendMessageClient(`${message}`)
//     //call brain
    var products_id = []; 
    products_id = vhost[1].split(',');
    const vdata=  JSON.stringify({
    items:[
        {
          products_id: products_id[0],
          message: message
        }
      ]
    });
//console.log('net : ' + vdata);
const datanet = await fetch("/api/net-brain/", {
    method: "POST", 
    headers:{"Content-Type": "application/json",},
            body: vdata,
  }).then(res => res.json()) 
  .then(data => ReaddataNet(data))
  .then(({ message }) => {
    return message
  })
  .catch(e => {
    console.log(e.error)    
  });  
    messageInput.value = '';
    messageInput.focus();
});


var _id = 0;
var _botid =0;
//user ถาม
function ReaddataNet(data){
  //console.log(data);
  $(document).ready(function (){          
    var _jp = 0;
      $.each(data.data,function(key,value){
        if(_jp==0){
          _id = value.id;
        }           
        _jp++;            
     });  
  });
 
  //ตอบก่อน
  //Bot(_id, 'bot' , 'N');
  //bot ถาม 
  _botid = databrain[Math.floor(Math.random()*databrain.length)]; 
  botQ(_botid);
  //Bot(_botid.id, 'bot' , 'Q');
  //css3dboxlink();
}
var vout1 = [];
var voutconvert = [];
function botQ(_botid){
    vout1 = [];
    voutconvert = [];
    appendMessage_bot(_botid.tb_input + ' : ' + _botid.tb_convert_input);  
    var _txt1 ='';
    var _txt2 ='';
  try{
    vout1 = _botid.tb_output.replace('|', ',');
    _txt1 = vout1[Math.floor(Math.random()*vout1.length)]; 

    voutconvert = _botid.tb_convert_output.replace('|', ',');
    _txt2 = voutconvert[Math.floor(Math.random()*voutconvert.length)];    
  }catch(error){
    console.log(error);
  }
   appendMessage_center(_txt1 + ' : ' + _txt2);
}

function appendMessage_center(message){
  var vTime = formatDate(new Date());
 //const vmodal = setModal('');
  var vhtml = ` 
  <hr>
      <p>
        ${message}
      </p>
 
  
  `;
  const Group_messageElement = document.createElement('div')
  Group_messageElement.innerHTML = vhtml
  messageContainer.append(Group_messageElement)
  scrollspyID++;
  DivScrollerMessage();
}
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

var vhtab = 300;
function DivScrollerMessage () {    
  divscrollermessage.scrollTop += (vhtab);
}

//action_menu_btn_sub.addEventListener("click", async () => {
// window.addEventListener
window.addEventListener("load", async () => {
  var products_id = []; 
      products_id = vhost[1].split(',');
  const vdata=  JSON.stringify({
    items:[
        {
          id: userid,
          products_id: products_id[0],        
        }
      ]
  });
  //console.log('product: ' + vdata);
  const response_create_order = await fetch("/api/create-brain/", {
      method: "POST", 
      headers:{"Content-Type": "application/json",},
              body: vdata,
    }).then(res => res.json()) 
    .then(data => Readdata(data))
    .then(({ id }) => {
      return id
    })
    .catch(e => {
      console.log(e.error)
      //alert('Not success Please checker. ' + e.error);
    })           
});




function Readdata(data){
  table = [];
  databrain = [];
//id, tb_input, tb_convert_input, tb_group, tb_output, tb_convert_output, products_id 
//databrain = data;console.log(databrain);         
 //value.tb_input , value.tb_convert_input, value.tb_output , value.tb_group,  value.id
  $(document).ready(function (){   
    var _j =0;
    var _p =0;
    var _n =0;
      $.each(data.data,function(key,value){
  
        databrain.push({
          id: value.id,      
          tb_input: value.tb_input, 
          tb_convert_input: value.tb_convert_input, 
          tb_group: value.tb_group, 
          tb_output: value.tb_output, 
          tb_convert_output: value.tb_convert_output, 
          products_id: value.products_id,
          youtue_id: value.youtue_id
        });   
        //table =[value.tb_input , value.tb_convert_input, value.tb_output , 1 ,  1];
        if(_j ==18){
           _j=1;
           _p++;
        }else{
          _j++;
        }  
   
        table.push({
          id:    value.id, 
          input: value.tb_input + ' : ' + value.tb_convert_input , 
          output: value.tb_output + ' : ' + value.tb_convert_output, 
          col: _j ,  
          row: _p
        });
        //console.log(value.tb_input , value.tb_convert_input, value.tb_output , value.tb_group,  value.id , value.youtue_id); 


        _n++;     
     }); 
  //css3d_message(); 
  //css3dboxlink();

 
  });
}

appendMessage_bot('Hello ! Welcome to SIG Speech English');
 function appendMessage_bot(message){
   appendMessage(message);
   socket.emit('bot-listener',{sender: sender, namesys: namesys, message: message});  
  Bot_SpeechSynthesisUtterance(message);
  document.getElementById('mesagetext').textContent = message;
   scrollspyID++;
   return false;
 }
  
function appendMessage(message){
  var vTime = formatDate(new Date()); 
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



  let camera, scene, renderer;
  let controls;
  const objects = [];
  const targets = { table: [], sphere: [], helix: [], grid: [] , showpage: []};




var change_targets ='table' ;
const css3d_message = () =>{
  //console.log('Tb: ' + table[_v]);

 camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
 camera.position.z = 3000;

 //console.log(camera);
 scene = new THREE.Scene();

 //console.log(scene);

 //const table[];
 //console.log(table.length);
//  for ( let j = 0; j < table.length; j++ ) {

//  }
 for ( let i = 0; i < table.length; i++ ) {

     const element = document.createElement( 'div' );
     element.className = 'element';
     element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

     const number = document.createElement( 'div' );
     number.className = 'number';
     number.textContent = table[i].id;
     //console.log(number.textContent);
     element.appendChild( number );

     const symbol = document.createElement( 'div' );
     symbol.className = 'symbol';
     symbol.textContent = table[ i ].input;
     element.appendChild( symbol );

     //console.log(element.appendChild);

     const details = document.createElement( 'div' );
     details.className = 'details';
     details.innerHTML = table[ i ].output + '<br>' + table[ i  ].output;
     //console.log(table[ i + 1 ].input + '<br>' + table[ i + 2 ]);
     element.appendChild( details );

     const objectCSS = new CSS3DObject( element );
     objectCSS.position.x = Math.random() * 4000 - 2000;
     objectCSS.position.y = Math.random() * 4000 - 2000;
     objectCSS.position.z = Math.random() * 4000 - 2000;
     scene.add( objectCSS );

     objects.push( objectCSS );

     //

     const object = new THREE.Object3D();
     object.position.x = ( table[ i ].col * 140 ) - 1330;
     object.position.y = - ( table[ i ].row * 180 ) + 990;

     targets.table.push( object );

 }

 // sphere

 const vector = new THREE.Vector3();

 for ( let i = 0, l = objects.length; i < l; i ++ ) {

     const phi = Math.acos( - 1 + ( 2 * i ) / l );
     const theta = Math.sqrt( l * Math.PI ) * phi;

     const object = new THREE.Object3D();

     object.position.setFromSphericalCoords( 800, phi, theta );

     vector.copy( object.position ).multiplyScalar( 2 );

     object.lookAt( vector );

     targets.sphere.push( object );

 }

         // helix

                 for ( let i = 0, l = objects.length; i < l; i ++ ) {

                     const theta = i * 0.175 + Math.PI;
                     const y = - ( i * 8 ) + 450;
 
                     const object = new THREE.Object3D();
 
                     object.position.setFromCylindricalCoords( 900, theta, y );
 
                     vector.x = object.position.x * 2;
                     vector.y = object.position.y;
                     vector.z = object.position.z * 2;
 
                     object.lookAt( vector );
 
                     targets.helix.push( object );
 
                 }


                 
     // grid

     for ( let i = 0; i < objects.length; i ++ ) {

       const object = new THREE.Object3D();

       object.position.x = ( ( i % 5 ) * 400 ) - 800;
       object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
       object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

       targets.grid.push( object );

     }

    //showpage
    for ( let i = 0; i < objects.length; i ++ ) {

      const object = new THREE.Object3D();

      object.position.x = 2; //( ( i % 5 ) * 400 ) - 800;
      object.position.y = 2; //( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
      object.position.z = 2; //( Math.floor( i / 25 ) ) * 1000 - 2000;

      targets.showpage.push( object );

    }

     //

     renderer = new CSS3DRenderer();
     renderer.setSize( window.innerWidth, window.innerHeight );
     document.getElementById( 'container3d' ).appendChild( renderer.domElement );

     //

     controls = new TrackballControls( camera, renderer.domElement );
     controls.minDistance = 500;
     controls.maxDistance = 6000;
     controls.addEventListener( 'change', render );

     const buttonTable = document.getElementById( 'table' );
     buttonTable.addEventListener( 'click', function () {

       transform( targets.table, 2000 );

     } );

     const buttonSphere = document.getElementById( 'sphere' );
     buttonSphere.addEventListener( 'click', function () {

       transform( targets.sphere, 2000 );

     } );

     const buttonHelix = document.getElementById( 'helix' );
     buttonHelix.addEventListener( 'click', function () {

       transform( targets.helix, 2000 );

     } );

     const buttonGrid = document.getElementById( 'grid' );
     buttonGrid.addEventListener( 'click', function () {

       transform( targets.grid, 2000 );

     } );

     //chat
    //  const message_input = document.getElementById( 'message-input' );
    //  message_input.addEventListener( 'keypress', function () {
    //     if(change_targets == 'helix'){
    //       change_targets = 'sphere';
    //       transform( targets.sphere, 2000 );

    //     }else if (change_targets == 'sphere'){
    //       change_targets = 'table';
    //       transform( targets.table, 2000 );
    //     }else if (change_targets == 'table'){
    //       change_targets = 'helix';
    //       transform( targets.helix, 2000 );
    //     }else if (change_targets == 'helix'){
    //       change_targets = 'grid';
    //       transform( targets.grid, 2000 );
    //     }else if (change_targets == 'grid'){
    //       change_targets = 'sphere';
    //       transform( targets.sphere, 2000 );
    //     }
        
    //     message_input.value = '';
    //  } );


     transform( targets.table, 2000 );

     //

     window.addEventListener( 'resize', onWindowResize );

             animate();
 
             function transform( targets, duration ) {

                 TWEEN.removeAll();
 
                 for ( let i = 0; i < objects.length; i ++ ) {
 
                     const object = objects[ i ];
                     const target = targets[ i ];
 
                     new TWEEN.Tween( object.position )
                         .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
                         .easing( TWEEN.Easing.Exponential.InOut )
                         .start();
 
                     new TWEEN.Tween( object.rotation )
                         .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
                         .easing( TWEEN.Easing.Exponential.InOut )
                         .start();
 
                 }
 
                 new TWEEN.Tween( this )
                     .to( {}, duration * 2 )
                     .onUpdate( render )
                     .start();
 
             }

             function onWindowResize() {
 
                 camera.aspect = window.innerWidth / window.innerHeight;
                 camera.updateProjectionMatrix();
 
                 renderer.setSize( window.innerWidth, window.innerHeight );
 
                 render();
 
             }
 
             function animate() {
 
                 requestAnimationFrame( animate );
 
                 TWEEN.update();
 
                 controls.update();
 
             }
 
             function render() {
 
                 renderer.render( scene, camera );
 
             }

}

//window.onload = css3d_message;
 
function Element( id, x, y, z, ry ) {

  const div = document.createElement( 'div' );
  div.style.width = '480px';
  div.style.height = '360px';
  div.style.backgroundColor = '#000';

  const iframe = document.createElement( 'iframe' );
  iframe.style.width = '480px';
  iframe.style.height = '360px';
  iframe.style.border = '0px';
  iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
  
  div.appendChild( iframe );

  const object = new CSS3DObject( div );
  object.position.set( x, y, z );
  object.rotation.y = ry;

  return object;

}


// id: value.id,      
// tb_input: value.tb_input, 
// tb_convert_input: value.tb_convert_input, 
// tb_group: value.tb_group, 
// tb_output: value.tb_output, 
// tb_convert_output: value.tb_convert_output, 
// products_id: value.products_id,
// youtue_id: value.youtue_id


const css3dboxlink =() =>{
  var youtuelist = [];
  var id = 0;
  var tb_input = '';
  var tb_convert_input = '';
  var tb_group = 0;
  var tb_output = '';
  var tb_convert_output = '';
  var youtue_id = '';
  if(databrain.length>0){
    id = databrain[_id].id;
    tb_input = databrain[_id].tb_input;
    tb_convert_input = databrain[_id].tb_convert_input;
    tb_group = databrain[_id].tb_group;
    tb_output = databrain[_id].tb_output;
    tb_convert_output = databrain[_id].tb_convert_output;
    youtue_id = databrain[_id].youtue_id;
    youtuelist = youtue_id.split('|');
  }else{
    return; 
  }
  


  //console.log(id + ' ' + youtue_id);
  const container = document.getElementById( 'addmessage-container' );

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.set( 500, 350, 750 );

  scene = new THREE.Scene();

  renderer = new CSS3DRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
   
  const group = new THREE.Group();
  group.add( new Element( youtuelist[0], 0, 0, 240, 0 ) );
  group.add( new Element( youtuelist[1], 240, 0, 0, Math.PI / 2 ) );
  group.add( new Element( youtuelist[2], 0, 0, - 240, Math.PI ) );
  group.add( new Element( youtuelist[3], - 240, 0, 0, - Math.PI / 2 ) );
  scene.add( group );

  controls = new TrackballControls( camera, renderer.domElement );
  controls.rotateSpeed = 4;

  window.addEventListener( 'resize', onWindowResize );

  // Block iframe events when dragging camera

  const blocker = document.getElementById( 'container3d' );
  blocker.style.display = 'none';

  controls.addEventListener( 'start', function () {

    blocker.style.display = '';

  } );
  controls.addEventListener( 'end', function () {

    blocker.style.display = 'none';

  } );

  animate();
  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  function animate() {

    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );

  }  seconds

}
//window.onload = css3dboxlink;

var Interval ;
var seconds = 0; 
var tens = 0; 
var appendTens = document.getElementById("tens")
var appendSeconds = document.getElementById("seconds")
//var buttonStart = document.getElementById('button-start');
document.getElementById('button-start').addEventListener('click', () =>{
  client_listener('ONSTART', '');
  Interval = setInterval(startTimer, 10);
})

document.getElementById('button-stop').addEventListener('click', () =>{
  client_listener('ONSTOP', '');
  clearInterval(Interval);
})
window.onload = function () {
    clearInterval(Interval);
    Interval = setInterval(startTimer, 10); 
    client_listener('ONSTART' , 'onload');
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

document.getElementById('send-mic-open').addEventListener('click', () =>{
 recognition.start();
})

document.getElementById('send-mic-stop').addEventListener('click', () =>{
  recognition.stop();
})