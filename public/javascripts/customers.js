let href = window.location.href;
let pathname = window.location.pathname;
let protocol = window.location.protocol;
let hostname = window.location.hostname;
/* console.log(href);
console.log(pathname);
console.log(protocol);
console.log(hostname); */
let hosts = href.replace(pathname,"");
var data = ct.getAllCountries();
getdataCuntry();
const customer_List = {};
const    messageFormNext = document.getElementById('send-update');
const    userid = document.getElementById('userid').value;
GetData();
const    customers_gender  =  document.querySelector('#customers_gender');
const    customers_firstname  =  document.querySelector('#customers_firstname');
const    customers_lastname  =  document.querySelector('#customers_lastname');
//const    customers_dob  =  document.querySelector('customers_dob');
const    customers_email_address  =  document.querySelector('#customers_email_address');
const    customers_default_address_id  =  document.querySelector('#customers_default_address_id');
//const    customers_telephone  =  document.querySelector('customers_telephone');
//const    customers_fax  =  document.querySelector('customers_fax');
//const    customers_newsletter  =  document.querySelector('customers_newsletter').value;
const    customers_country_id  =  document.querySelector('#customers_country_id');
const    customers_state_id  =  document.querySelector('#customers_state_id');
const    customers_address  =  document.querySelector('#customers_address');
const    customers_zip   =  document.querySelector('#customers_zip');
const btnUpdate = document.getElementById("btn-update");//update

function getdataCuntry(){
    $(document).ready(function (){
         $.each(data,function(key,value){
             var option = document.createElement('option');
             option.value =value.id;
             option.textContent = value.name;
             option.setAttribute('data-lang', value.id);
             option.setAttribute('data-name', value.name);
             document.getElementById('customers_country_id').appendChild(option);
             console.log(data);
         });
    });
   document.getElementById('customers_country_id').selectedIndex = 0;    
   document.getElementById('customers_state_id').innerHTML='';   
}

function loadState(){
  document.getElementById('customers_state_id').innerHTML='';
  var countryid =  document.getElementById('customers_country_id').selectedOptions[0].getAttribute('data-lang');
  //console.log(countryid);
  var data = ct.getCountry(countryid);
  //console.log(data);
  getdataCity(data);
}
document.getElementById('customers_country_id').addEventListener("click", async () => {
  loadState();    
});

function getdataCity(data){
  
  $(document).ready(function (){

    try{
       $.each(data.timezones,function(key,value){
           var option = document.createElement('option');
           option.value =value;
           option.textContent = value;
           option.setAttribute('data-lang', value);
           option.setAttribute('data-name', value);
           document.getElementById('customers_state_id').appendChild(option);
           console.log(option);
       });
    }catch(error){
      console.log(error);
    }

  });
 document.getElementById('customers_state_id').selectedIndex = 0;    
}

btnUpdate.addEventListener("click", async () => {
  //var vurl = hosts + "/api/post-customers/";
  const vdata=  JSON.stringify({
   items:[
      {
        customers_id	: userid	,
        customers_gender	: customers_gender.value	,
        customers_firstname	: customers_firstname.value	,
        customers_lastname	: customers_lastname.value	,
        customers_email_address	: customers_email_address.value	,
        customers_default_address_id	: customers_default_address_id.value	,
        customers_country_id	:  customers_country_id.selectedOptions[0].getAttribute('data-lang')	,
        customers_state_id	: customers_state_id.selectedOptions[0].getAttribute('data-name')	,
        customers_address	:customers_address.value	,
        customers_zip 	:customers_zip.value, 	  	       
     }
   ]
  });
console.log(vdata);
  const response = await fetch("/api/post-customers/", {
    method: "POST", 
    headers:{"Content-Type": "application/json",},
            body: vdata,
  }).then(res => {

    GetData();
    alert('Success!');
    if (res.ok) return res.json()
    return res.json().then(json => Promise.reject(json))          
  })
  .then(({ customers_id }) => {
    return customers_id
  })
  .catch(e => {
    console.error(e.error)
  })  
});

function GetData(){

    $(document).ready(function (){
        var vurl = hosts + "/api/get-customers/" + userid;
        $.ajax({
            url: vurl ,
            method: "GET",
            data:{action: 'fetch'},
            dataType: "JSON",
            success:function(data){
                console.log(data.data);
                $.each(data.data,function(key,value){  
                  document.getElementById('customers_gender').selectedIndex = value.customers_gender;
                  document.getElementById('customers_firstname').value = value.customers_firstname;
                  document.getElementById('customers_lastname').value = value.customers_lastname;
                  document.getElementById('customers_email_address').value = value.customers_email_address;
                  document.getElementById('customers_default_address_id').value = value.customers_default_address_id;
                  document.getElementById('customers_address').value = value.customers_address;
                  document.getElementById('customers_zip').value = value.customers_zip;
                  document.getElementById('customers_country_id').value = value.customers_country_id;   
                  loadState();
                  document.getElementById('customers_state_id').value = value.customers_state_id;          
                });
            }, error: function(err){
                console.log('Error : ' + err);
            }
        });
    });
}



