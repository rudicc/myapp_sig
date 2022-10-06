//GameWebGLCSS3DRenderer

 
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
 import * as brainchat from './brainchat.js';
  
// const table = [
//     'H', 'Hydrogen', '1.00794', 1, 1,
//     'He', 'Helium', '4.002602', 18, 1,
//     'Li', 'Lithium', '6.941', 1, 2,
//     'Be', 'Beryllium', '9.012182', 2, 2,
//     'B', 'Boron', '10.811', 13, 2,
//     'C', 'Carbon', '12.0107', 14, 2,
//     'N', 'Nitrogen', '14.0067', 15, 2,
//     'O', 'Oxygen', '15.9994', 16, 2,
//     'F', 'Fluorine', '18.9984032', 17, 2,
//     'Ne', 'Neon', '20.1797', 18, 2,
//     'Na', 'Sodium', '22.98976...', 1, 3,
//     'Mg', 'Magnesium', '24.305', 2, 3,
//     'Al', 'Aluminium', '26.9815386', 13, 3,
//     'Si', 'Silicon', '28.0855', 14, 3,
//     'P', 'Phosphorus', '30.973762', 15, 3,
//     'S', 'Sulfur', '32.065', 16, 3,
//     'Cl', 'Chlorine', '35.453', 17, 3,
//     'Ar', 'Argon', '39.948', 18, 3,
//     'K', 'Potassium', '39.948', 1, 4,
//     'Ca', 'Calcium', '40.078', 2, 4,
//     'Sc', 'Scandium', '44.955912', 3, 4,
//     'Ti', 'Titanium', '47.867', 4, 4,
//     'V', 'Vanadium', '50.9415', 5, 4,
//     'Cr', 'Chromium', '51.9961', 6, 4,
//     'Mn', 'Manganese', '54.938045', 7, 4,
//     'Fe', 'Iron', '55.845', 8, 4,
//     'Co', 'Cobalt', '58.933195', 9, 4,
//     'Ni', 'Nickel', '58.6934', 10, 4,
//     'Cu', 'Copper', '63.546', 11, 4,
//     'Zn', 'Zinc', '65.38', 12, 4,
//     'Ga', 'Gallium', '69.723', 13, 4,
//     'Ge', 'Germanium', '72.63', 14, 4,
//     'As', 'Arsenic', '74.9216', 15, 4,
//     'Se', 'Selenium', '78.96', 16, 4,
//     'Br', 'Bromine', '79.904', 17, 4,
//     'Kr', 'Krypton', '83.798', 18, 4,
//     'Rb', 'Rubidium', '85.4678', 1, 5,
//     'Sr', 'Strontium', '87.62', 2, 5,
//     'Y', 'Yttrium', '88.90585', 3, 5,
//     'Zr', 'Zirconium', '91.224', 4, 5,
//     'Nb', 'Niobium', '92.90628', 5, 5,
//     'Mo', 'Molybdenum', '95.96', 6, 5,
//     'Tc', 'Technetium', '(98)', 7, 5,
//     'Ru', 'Ruthenium', '101.07', 8, 5,
//     'Rh', 'Rhodium', '102.9055', 9, 5,
//     'Pd', 'Palladium', '106.42', 10, 5,
//     'Ag', 'Silver', '107.8682', 11, 5,
//     'Cd', 'Cadmium', '112.411', 12, 5,
//     'In', 'Indium', '114.818', 13, 5,
//     'Sn', 'Tin', '118.71', 14, 5,
//     'Sb', 'Antimony', '121.76', 15, 5,
//     'Te', 'Tellurium', '127.6', 16, 5,
//     'I', 'Iodine', '126.90447', 17, 5,
//     'Xe', 'Xenon', '131.293', 18, 5,
//     'Cs', 'Caesium', '132.9054', 1, 6,
//     'Ba', 'Barium', '132.9054', 2, 6,
//     'La', 'Lanthanum', '138.90547', 4, 9,
//     'Ce', 'Cerium', '140.116', 5, 9,
//     'Pr', 'Praseodymium', '140.90765', 6, 9,
//     'Nd', 'Neodymium', '144.242', 7, 9,
//     'Pm', 'Promethium', '(145)', 8, 9,
//     'Sm', 'Samarium', '150.36', 9, 9,
//     'Eu', 'Europium', '151.964', 10, 9,
//     'Gd', 'Gadolinium', '157.25', 11, 9,
//     'Tb', 'Terbium', '158.92535', 12, 9,
//     'Dy', 'Dysprosium', '162.5', 13, 9,
//     'Ho', 'Holmium', '164.93032', 14, 9,
//     'Er', 'Erbium', '167.259', 15, 9,
//     'Tm', 'Thulium', '168.93421', 16, 9,
//     'Yb', 'Ytterbium', '173.054', 17, 9,
//     'Lu', 'Lutetium', '174.9668', 18, 9,
//     'Hf', 'Hafnium', '178.49', 4, 6,
//     'Ta', 'Tantalum', '180.94788', 5, 6,
//     'W', 'Tungsten', '183.84', 6, 6,
//     'Re', 'Rhenium', '186.207', 7, 6,
//     'Os', 'Osmium', '190.23', 8, 6,
//     'Ir', 'Iridium', '192.217', 9, 6,
//     'Pt', 'Platinum', '195.084', 10, 6,
//     'Au', 'Gold', '196.966569', 11, 6,
//     'Hg', 'Mercury', '200.59', 12, 6,
//     'Tl', 'Thallium', '204.3833', 13, 6,
//     'Pb', 'Lead', '207.2', 14, 6,
//     'Bi', 'Bismuth', '208.9804', 15, 6,
//     'Po', 'Polonium', '(209)', 16, 6,
//     'At', 'Astatine', '(210)', 17, 6,
//     'Rn', 'Radon', '(222)', 18, 6,
//     'Fr', 'Francium', '(223)', 1, 7,
//     'Ra', 'Radium', '(226)', 2, 7,
//     'Ac', 'Actinium', '(227)', 4, 10,
//     'Th', 'Thorium', '232.03806', 5, 10,
//     'Pa', 'Protactinium', '231.0588', 6, 10,
//     'U', 'Uranium', '238.02891', 7, 10,
//     'Np', 'Neptunium', '(237)', 8, 10,
//     'Pu', 'Plutonium', '(244)', 9, 10,
//     'Am', 'Americium', '(243)', 10, 10,
//     'Cm', 'Curium', '(247)', 11, 10,
//     'Bk', 'Berkelium', '(247)', 12, 10,
//     'Cf', 'Californium', '(251)', 13, 10,
//     'Es', 'Einstenium', '(252)', 14, 10,
//     'Fm', 'Fermium', '(257)', 15, 10,
//     'Md', 'Mendelevium', '(258)', 16, 10,
//     'No', 'Nobelium', '(259)', 17, 10,
//     'Lr', 'Lawrencium', '(262)', 18, 10,
//     'Rf', 'Rutherfordium', '(267)', 4, 7,
//     'Db', 'Dubnium', '(268)', 5, 7,
//     'Sg', 'Seaborgium', '(271)', 6, 7,
//     'Bh', 'Bohrium', '(272)', 7, 7,
//     'Hs', 'Hassium', '(270)', 8, 7,
//     'Mt', 'Meitnerium', '(276)', 9, 7,
//     'Ds', 'Darmstadium', '(281)', 10, 7,
//     'Rg', 'Roentgenium', '(280)', 11, 7,
//     'Cn', 'Copernicium', '(285)', 12, 7,
//     'Nh', 'Nihonium', '(286)', 13, 7,
//     'Fl', 'Flerovium', '(289)', 14, 7,
//     'Mc', 'Moscovium', '(290)', 15, 7,
//     'Lv', 'Livermorium', '(293)', 16, 7,
//     'Ts', 'Tennessine', '(294)', 17, 7,
//     'Og', 'Oganesson', '(294)', 18, 7
// ];

let camera, scene, renderer;
let controls;

const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };

const init = () =>{
      console.log('br: ' + brainchat.databrain);
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 3000;

    console.log(camera);
    scene = new THREE.Scene();

    console.log(scene);

    for ( let i = 0; i < table.length; i += 5 ) {

        const element = document.createElement( 'div' );
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

        const number = document.createElement( 'div' );
        number.className = 'number';
        number.textContent = ( i / 5 ) + 1;
        console.log(number.textContent);
        element.appendChild( number );

        const symbol = document.createElement( 'div' );
        symbol.className = 'symbol';
        symbol.textContent = table[ i ];
        element.appendChild( symbol );

        console.log(element.appendChild);

        const details = document.createElement( 'div' );
        details.className = 'details';
        details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
        console.log(table[ i + 1 ] + '<br>' + table[ i + 2 ]);
        element.appendChild( details );

        const objectCSS = new CSS3DObject( element );
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;
        scene.add( objectCSS );

        objects.push( objectCSS );

        //

        const object = new THREE.Object3D();
        object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
        object.position.y = - ( table[ i + 4 ] * 180 ) + 990;

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
            console.log(transcript);             
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
       console.log('Ready to receive a color command.');
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
let vhost = [];
vhost = hosts.split('?');
console.log(vhost[0] + ' ' + vhost[1]);
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
//รับข้อความจาก server : bot-listener
socket.on('brain-message-bot',function (data) {
    //appendMessage(`bot-listener --> message-bot : ${data.name}: ${data.message}`) 
  
    //ส่งข้อความไปพูดเสียง bot
    //Bot_SpeechSynthesisUtterance(data.message)
    console.log('brain-message-bot : '  + data)
  })
  
  //Server ตอบรับข้อความจาก client แล้ว
  socket.on('brain-client-message', function (data){
    //appendMessage(`รับข้อมูลจาก: ${data.name}: ${data.message}`) 
      //ส่งข้อความไปพูดเสียง bot
      //Bot_SpeechSynthesisUtterance(data.message)
      console.log('brain-client-message : '  + data)
  })
  socket.on('user-connected',  name => {
    //appendMessage(`${name} connected`)
    console.log(`${name} connected`)
  })
  
  socket.on('user-disconnected', function(name)  {
    //appendMessage(`${name} disconnected`)
    console.log(`${name} disconnected`)
  })


  function bot_listener(message){
    socket.emit('bot-listener',{sender: sender, namesys: namesys, message: message});  
  }

  function client_listener(message){
    socket.emit('client-listener',{sender: sender, namesys: namesys, message: message});  
  }

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value  
    client_listener(`${message}`)
    this.replyInput(message);
    messageInput.value = ''
    messageInput.focus();
  })

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

action_menu_btn_sub.addEventListener("click", async () => {
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
  console.log('product: ' + vdata);
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
//id, tb_input, tb_convert_input, tb_group, tb_output, tb_convert_output, products_id 

//databrain = data;console.log(databrain);
  $(document).ready(function (){   
      $.each(data.data,function(key,value){
       // table=[ value.tb_input , value.tb_convert_input, value.tb_output , value.tb_group,  value.id];
        databrain =[ value.tb_input , value.tb_convert_input, value.tb_output , value.tb_group,  value.id

        ];
        //console.log(value.tb_input , value.tb_convert_input, value.tb_output , value.tb_group,  value.id);
      });     
  });
}
appendMessage_bot('Hello ! Welcome to SIG Speech English');
 function appendMessage_bot(message){
   appendMessage(message);
   socket.emit('bot-listener',{sender: sender, namesys: namesys, message: message});  
  Bot_SpeechSynthesisUtterance(message);
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

var inp =0;
 
const replyInput = () =>{
  try{

      $(document).ready(function (){
        var div  = document.createElement('div');
        $.each(data.data,function(key,value){
     
         // if()
             
  
            console.log(value.exrates);
        });
    });

  }catch(error){
    console.log(error);
  }

}

const replyOutput = (intent) => {

  if(intent === "") return ":thinking:";
  var retstr = "";
  try{
      retstr = "" //voutput[Math.floor(Math.random()*bye_reply.length)];
  }catch(error){
    console.log(error);
  }


  return retstr;
}








window.onload = init;