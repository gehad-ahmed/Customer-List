// LOADING

$(document).ready(function () {
  $("#loading").fadeOut(1000);
  $("body").css({ overflow: "auto" });
});


// FETCH CUSTOMER.JSON DATA

let arrCustomerData = [];
async function fetchCustomerData() {
  try {
    let data = await fetch("../customers.json");
    let response = await data.json();
    filterCustomerDetails(response);
    arrCustomerData = response;
    displayCustomerData();
  } catch (error) {}
}

fetchCustomerData();

// DISPLAY THE CUSTOMER DATA 

function displayCustomerData() {
  let customerElement = "";
  for (let i = 0; i < arrCustomerData.length; i++) {
    customerElement += `                 
                        <li onclick="displayDataForCustomer(${i})" class="p-1 bg-white mb-3">${arrCustomerData[i].name}</li>
        
        `;
  }
  document.querySelector(
    ".customer .row .customer-list ul.customer-data"
  ).innerHTML = customerElement;
}


let arrTransactionsData = [];

async function fetchTransactions() {
  try {
    let data = await fetch("../transactions.json");
    let response = await data.json();
    arrTransactionsData = response;
  } catch (error) {}
}
fetchTransactions();


// DISPLAY THE TRANSATIONS DATA 

function displayDataForCustomer(index) {
  let findCustomer = arrCustomerData[index];
  let filterData = arrTransactionsData.filter(
    (li) => li.customer_id == findCustomer.id
  );
  const sumAmount = filterData.reduce(
    (accumulator, currentValue) => accumulator + currentValue.amount,
    0
  );

  let transactionsElement = "";
  let caption = "";

  caption = `
  <caption>Total Amount For ${findCustomer.name} : ${sumAmount}</caption>
   `;

  document.getElementById("caption").innerHTML = caption;

  for (let i = 0; i < filterData.length; i++) {
    transactionsElement += `  
                         <tr>
                                <td>${filterData[i].date}</td>
                                <td>${filterData[i].amount}</td>
                              </tr>
       `;
  }
  document.querySelector(
    ".customer .row .customer-list table tbody"
  ).innerHTML = transactionsElement;
}

let searchInput = document.querySelector(
  ".customer .row .customer-list .form input.inputName"
);
if (searchInput) {
  searchInput.addEventListener("input", function (e) {
    if (e.target.value) {
      arrCustomerData = arrCustomerData.filter((li) =>
        li.name.toLowerCase().includes(e.target.value)
      );
    }
    else{
      fetchCustomerData()
      document.getElementById("caption").style.display = "none";
      document.getElementById("tBody").style.display="none"
    }
    
    
    displayCustomerData();
  });
}

let link = document.querySelector(".customer .title a");

link.addEventListener("click", function () {
  window.open("customerDetails.html", "_self");
});

function filterCustomerDetails(arr) {
  let ele = arr;
  let searchInput = document.querySelector(
    ".customer .row .customer-list .form input.inputcustomerDetails"
  );
if (searchInput) {
  searchInput.addEventListener("input", function (e) {
    if (e.target.value == "") {
      document.getElementById("customer-details").style.display = "none";
      document.getElementById("myChart").style.display = "none";
    } else {
      document.getElementById("customer-details").style.display = "block";
      document.getElementById("myChart").style.display = "block";
      ele = ele.filter((li) =>
        li.name.toLowerCase().startsWith(e.target.value)
      );

      if (ele.length == 1) {
        let arrData = arrTransactionsData.filter(
          (li) => li.customer_id == ele[0].id
        );
        let totalAmount = arrData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.amount,
          0
        );
        let obj = {
          name: ele[0].name,
          totalValue: totalAmount,
          details: arrData,
        };

        displayCustomerDetails(obj);
        displayChart(arrData);
      } else {
        fetchCustomerData();
      }
    }
  });
  
}
}


//  DYNAMIC CHART TO DISPLAY DATA
function displayChart(arrData) {
  let mapDate = arrData.map((li) => li.date);
  let mapAmount = arrData.map((li) => li.amount);
  const xValues = mapDate;
  const yValues = mapAmount;
  new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          pointRadius: 3,
          pointBackgroundColor: "rgb(0,0,255)",
          data: yValues,
        },
      ],
    },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [{ beginAtZero: true, ticks: { min: 0, max: 2500 } }],
      },
    },
  });
}


// DISPLAY CUSTOMER DETAILS DATA (NAME, TOTAL VALUE, AMOUNT, DATE AND THE CHART)


function displayCustomerDetails(obj) {
  let box = "";
  box = ` <p class="fw-bold">${obj.name}</p>
     <ul class="list-unstyled">
      <li>Total Amount :<span>${obj.totalValue}</span></li>
      <li>Transactions :</li>
      </ul>
      `;
  for (let i = 0; i < obj.details.length; i++) {
    box += `
        
                            
                          <ul class="d-flex">
                                <li>Date :<span>${obj.details[i].date}</span></li>
                                <li>Amount :<span>${obj.details[i].amount}</span></li>

                           </ul>
                      
        `;
  }

  document.querySelector(
    ".customer .row .customer-list .customer-details"
  ).innerHTML = box;
}


