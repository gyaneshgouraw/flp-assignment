let totalCartAmount = 0;
let totalDeliveryCharges = 0;
let totalAmountPayable = 0;

/**
 *
 * @param {*} url
 * @param {*} callback
 */
function getData(url, callback) {
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      callback(myJson);
      //console.log(JSON.stringify(myJson));
    });
}

function renderList(data) {
  console.log("data", data);
  let node = document.getElementById("cartItems");

  for (let i = 0; i < data.length; i++) {
    data[i].count = 0;
    fnGetCardItemView(node, data[i]);
  }
}

/**
 * Function to add item to cart
 * @param {*} item
 */
function addItem(item) {
  event.target.nextSibling.nextElementSibling.innerHTML = "";
  const { amount, delivery_charge } = item.pricing;
  const { purchase_instructions } = item;

  //do calculations
  totalCartAmount = totalCartAmount + amount;
  totalDeliveryCharges = totalDeliveryCharges + delivery_charge;
  totalAmountPayable = totalCartAmount + totalDeliveryCharges;

  let count = JSON.parse(event.target.dataset.count) + 1;

  //validate count constraints
  if (count > purchase_instructions.max_purchase_limit) {
    alert(
      "limit exceed" + "max-limit:" + purchase_instructions.max_purchase_limit
    );
    count--;
  }

  event.target.dataset.count = count;
  event.target.nextSibling.nextElementSibling.nextElementSibling.dataset.count = count;

  fnClearAmountValues(event);

  //append final values
  event.target.nextSibling.nextElementSibling.append(count);
  document.getElementById("totalAmount").append(totalCartAmount);
  document.getElementById("totalDelivery").append(totalDeliveryCharges);
  document.getElementById("totalPayable").append(totalAmountPayable);
}

/**
 * fn-
 * @param {object} item
 */
function deleteItem(item) {
  event.target.previousSibling.previousElementSibling.innerHTML = "";
  const { amount, delivery_charge } = item.pricing;

  //check count constraints
  let count = JSON.parse(event.target.dataset.count) - 1;
  if (count == -1) {
    alert("canot have values less than 0");
    count++;
  } else {
    //get final calculated values
    totalCartAmount = totalCartAmount - amount;
    totalDeliveryCharges = totalDeliveryCharges - delivery_charge;
    totalAmountPayable = totalCartAmount - totalDeliveryCharges;
  }

  event.target.dataset.count = count;
  event.target.previousSibling.previousElementSibling.previousElementSibling.dataset.count = count;

  fnClearAmountValues(event);

  event.target.previousSibling.previousElementSibling.append(count);

  document.getElementById("totalAmount").append(totalCartAmount);
  document.getElementById("totalDelivery").append(totalDeliveryCharges);
  document.getElementById("totalPayable").append(totalAmountPayable);
}

/**
 * function to render cart values
 * @param {*} node
 * @param {*} item
 */
function fnGetCardItemView(node, item) {
  const { count } = item;
  const { img, title } = item.product_meta;
  const { amount, delivery_charge } = item.pricing;
  node.insertAdjacentHTML(
    "beforeend",
    `
    <div class='cardItem' >
      <div class='itemImage'>
        <img src=${img} alt=""/>
      </div>
      <div class='itemDetails'>
          <div class="title">
              ${title}
          </div>
          <div><span class='rupee'>Rs.</span>${amount}</div>
          <div><span class='deliveryfee'>Delivery</span>${delivery_charge}</div>
          <div><button class='btncartAdd' data-count='${count}' onclick='addItem(${JSON.stringify(
      item
    )})'>+</button>
              <span class='itemCartCount' id='itemCartCount'>${count}</span>
          <button class='btncartAdd' data-count='${count}' onclick='deleteItem(${JSON.stringify(
      item
    )})'>-</button></div>
       </div>
    </div>
    `
  );
}

function fnClearAmountValues(event) {
  document.getElementById("totalAmount").innerHTML = "";
  document.getElementById("totalDelivery").innerHTML = "";
  document.getElementById("totalPayable").innerHTML = "";
}

getData("https://flipkart-mock-cart.now.sh/", renderList);
