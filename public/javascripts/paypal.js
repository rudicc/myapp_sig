

  //paypal
  const paypalcheckout = document.getElementById('paypalcheckout');

  paypalcheckout.addEventListener("click", async () => {
    const vdata=  JSON.stringify({
        items:[
            {
              id: userid.value,
              price: element_Total_basket,      
            }
          ]
    });
  console.log(vdata);
    const response_create_order = await fetch("/payment.routes/create-order/", {
      method: "POST", 
      headers:{"Content-Type": "application/json",},
              body: vdata,
    }).then(res => res.json()) 
    //.then(data => GetDataCreate(data))
    .then(({ id }) => {
      return id
    })
    .catch(e => {
      console.log(e.error)
      //alert('Not success Please checker. ' + e.error);
    })       
  });
