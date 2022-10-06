//addbrain
const voutputList = [];
//const net2 = new brain.recurrent.LSTM(); 
  //paypal
  const addbrain = document.getElementById('addbrain');
  const userid = document.getElementById('userid').value;
  const products_id = document.getElementById('productsid').value;
  addbrain.addEventListener("click", async () => {
    const vdata=  JSON.stringify({
        items:[
            {
              id: userid,
              products_id: products_id,     
            }
          ]
    });
  console.log(vdata);
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
  console.log(data);
     
}