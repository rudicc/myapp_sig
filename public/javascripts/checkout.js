 

  
let href = window.location.href;
let pathname = window.location.pathname;
let protocol = window.location.protocol;
let hostname = window.location.hostname;
/* console.log(href);
console.log(pathname);
console.log(protocol);
console.log(hostname); */
let hosts = href.replace(pathname,"");
const qrcheckout = document.getElementById("qrcheckout");
const paypalcheckout = document.getElementById("paypalcheckout"); //paypal
const qrcheckout_qrorder = document.getElementById("qrcheckout_qrorder");
//const element_Total_basket = document.getElementById('element_Total_basket').value;
var element_Total_basket        = document.getElementById("Total_basket");

const userid = document.getElementById("userid");
const email = document.getElementById("email");
//users_id

const d = new Date();
let diff = d.getTimezoneOffset();
init();
get_customer_basket();
function init(){
  if(diff == "-420" || diff=="420"){
    //console.log(diff);
    qrcheckout.hidden=false;
    //paypalcheckout.hidden=false;
  }else{
    qrcheckout.hidden=true;
    //paypalcheckout.hidden=false;
  }  
}


qrcheckout.addEventListener("click", async () => {
    //var vurl = hosts + "/api/post-customers/";
    const vdata=  JSON.stringify({
        items:[
            {
              rateusd: element_Total_basket.value	,   	       
            }
          ]
    });
  console.log(vdata);
    const response = await fetch("/payment.routes/get-exchange_rates/", {
      method: "POST", 
      headers:{"Content-Type": "application/json",},
              body: vdata,
    }).then(res => res.json()) 
    .then(data => GetData(data))
    .then(({ rateusd }) => {
      return rateusd
    })
    .catch(e => {
      console.log(e.error)
    })  
    //GetData(response);

     
});





function GetData(data){

    // {
    //     "data": [
    //         {
    //             "exrates": 219.78
    //         }
    //     ]
    // }
    //console.log(data);

    $(document).ready(function (){
        var div  = document.createElement('div');
        $.each(data.data,function(key,value){
           // div.innerHTML = value;
            document.getElementById("exrates").value = value.exrates + ' บาท';
            //const myObj = JSON.parse(value);
            console.log(value.exrates);
        });
   });

}

//qr event click ยอมรับ 
qrcheckout_qrorder.addEventListener("click", async () => {
  //var vurl = hosts + "/api/post-customers/";
  const vdata=  JSON.stringify({
      items:[
          {
            id: userid.value	,  
            email: email.value, 	       
          }
        ]
  });
console.log(vdata);
  const response_create_order = await fetch("/payment.routes/qrcreate-order/", {
    method: "POST", 
    headers:{"Content-Type": "application/json",},
            body: vdata,
  }).then(res => res.json()) 
  .then(data => GetDataCreate(data))
  .then(({ id }) => {
    return id
  })
  .catch(e => {
    console.log(e.error)
    //alert('Not success Please checker. ' + e.error);
  })       
});

function GetDataCreate(data){
  alert('Success!');
 window.open(hosts + '/gstart');
    
}
 
//paypal
paypalcheckout.addEventListener("click", async () => {
  const vdata=  JSON.stringify({
      items:[
          {
            id: userid.value,
            price: element_Total_basket.value,      
          }
        ]
  });
  console.log(vdata);
  const response_create_order = await fetch("/payment.routes/create-order/", {
    method: "POST", 
    headers:{"Content-Type": "application/json",},
            body: vdata,
  }).then(res => res.json()) 
  .then(data => HrefPage(data))
  .then(({ id }) => {
    return id
  })
  .catch(e => {
    console.log(e.error)
    //alert('Not success Please checker. ' + e.error);
  })       
});
 
function HrefPage(data){ 
  window.location.href = data.links[1].href 
  console.log(data); 
}



 //
function get_customer_basket(){ 
  $(document).ready(function (){
      var vurl = hosts + "/api/get-customer-basket/" + userid.value;
      $.ajax({
          url: vurl ,
          method: "GET",
          data:{action: 'fetch'},
          dataType: "JSON",
          success:function(data){
              console.log(data.data);
              var _t =0;
              var _hr =0;
              $.each(data.data,function(key,value){                 
                _t =value.total +_t;
                _hr = value.customers_basket_quantity + _hr;                  
              });
              console.log(_hr);
              document.getElementById('Total_basket').value = _t;
              //Total_basket
              document.getElementById('Total').innerHTML = _t;
              document.getElementById('Totalhr').innerHTML = _hr;
          }, error: function(err){
              console.log('Error : ' + err);
          }
      });
  });
}