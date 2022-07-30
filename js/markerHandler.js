var tableNo = null;
AFRAME.registerComponent("marker-handler", {
	init: async function () {
		if (tableNo === null) {
			this.askTableNo();
		}
		var dishes = await this.getDishes();

		this.el.addEventListener("markerFound", () => {
			if (tableNo !== null) {
				var markerId = this.el.id;
				this.handleMarkerFound(dishes, markerId);
			}
		});

		this.el.addEventListener("markerLost", (e) => {
			this.handlerMarkerLost(e);
		});
	},
	askTableNo: function () {
		var hungerIconUrl =
			"https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
		swal({
			title: "Welcome to mcDonalds",
			icon: hungerIconUrl,
			content: {
				element: "input",
				attributes: {
					placeHolder: "Tyype your table No....",
					type: "number",
					min: 1,
				},
			},
			closeOnClickOutside: false,
		}).then((val) => {
			tableNo = val;
		});
	},

	handlerMarkerFound: function (dishes, marker_id) {
		var button_Div = document.getElementById("button-div");
		button_Div.style.display = "flex";
		var rating_button = document.getElementById("rating-button");
		var order_button = document.getElementById("order-button");
		var summary_button = document.getElementById("order-summary");
		var pay_button = document.getElementById("order-pay");

		var date = new Date();
		var todaysday = date.getDay();
		var days = [
			"sunday",
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday",
		];
		var dish = dishes.filter((dish) => dish.id == marker_id)[0];
		var unavailable_Days = dish.unavailable_days;

		if (unavailable_Days.includes(todaysday)) {
			swal({
				icon: "warning",
				title: dish.dish_name.toUpperCase(),
				text: "Dish Unavailable Today",
				timer: "2500",
				buttons: false,
			});
		} else {
			var model = document.querySelector(`#model-${dish.id}`);
			model.setAttribute("position", dish.model_geometry.position);
			model.setAttribute("visible", "true");
			model.setAttribute("rotation", dish.model_geometry.rotation);
			model.setAttribute("scale", dish.model_geometry.scale);

			var plane = document.querySelector(`#plane-${dish.id}`);
			plane.setAttribute("visible", "true");

			var pricePlane = document.querySelector(`#price-plane-${dish.id}`);
			pricePlane.setAttribute("visible", "true");

			var buttonDiv = document.getElementById("button-div");
			buttonDiv.style.display = "flex";

			rating_button.addEventListener("click", () => {
				swal({
					icon: "warning",
					title: "Rate Dish",
					text: "Work in Progress",
				});
			});
			summary_button.addEventListener("click", () => {
				this.handlerOrderSummary();
			});

			pay_button.addEventListener("click", () => {
				this.handlerOrderPayment();
			});
			order_button.addEventListener("click", () => {
				var tno;
				tableNo <= 9 ? (tno = "T0" + tableNo) : (tno = "T" + tableNo);
				this.handlerOrder(tno, dish);
				swal({
					icon: "success",
					title: "Order Dish",
					text: "Preparing...",
					timer: 2000,
					buttons: false,
				});
			});
		}
	},
	handlerOrder: function (tno, dish) {
		var details;
		firebase
			.firestore()
			.collection("tables")
			.doc(tno)
			.get()
			.then((doc) => {
				details = doc.data();
				if (details["current_orders"][dish.id]) {
					details["current_orders"][dish.id]["quantity"] += 1;
					var currentQuantity = details["current_orders"][dish.id]["quantity"];
					details["current_orders"][dish.id]["sub_total"] =
						currentQuantity * dish.price;
				} else {
					details["current_orders"][dish.id] = {
						item: dish.dish_name,
						price: dish.price,
						quantity: 1,
						sub_total: dish.price,
					};
				}

				details["total_bill"] += dish.price;

				firebase.firestore().collection("tables").doc(doc.id).update(details);
			});
	},
	handlerOrderPayment: async function () {
		document.getElementById("model-div").style.display = "none";

		var tno;
		tableNo <= 9 ? (tno = "T0" + tableNo) : (tno = "T" + tableNo);

		firebase.firestore().collection("tables").doc(tno).update({
			current_orders: {},
			total_bill: 0,
		}).then(() => {
			swal({
				icon: "success",
				title: "Payment done",
				text: "Please visit us again",
				timer: 2000,
				buttons: false,
			});
		})

	},

	handlerOrderSummary: async function () {
		var tno;
		tableNo <= 9 ? (tno = "T0" + tableNo) : (tno = "T" + tableNo);

		var orderSummary = await firebase
			.firstore()
			.collection("tables")
			.doc(tno)
			.get()
			.then((doc) => doc.data());

		var model_div = document.selectElementById("model-div");
		model_div.style.display = "flex";

		var tableBodyTag = document.getElementById("bill-table-body");
		tableBodyTag.innerHTML = "";

		var currentOrders = Objet.keys(orderSummary.current_orders);

		currentOrders.map((i) => {
			var tr = document.createElement("tr");
			var item = document.createElement("td");
			var price = document.createElement("td");
			var quantity = document.createElement("td");
			var subTotal = document.createElement("td");
			price.innerHTML = "$" + orderSummary.currentOrders[i].price;
			price.setAttribute("class", "text-center");
			quantity.setAttribute("class", "text-center");
			subTotal.setAttribute("class", "text-center");
			quantity.innerHTML = orderSummary.currentOrders[i].quantity;
			subTotal.innerHTML = "$" + orderSummary.currentOrders[i].subTotal;

			item.innerHTML = orderSummary.currentOrders[i].item;

			tr.appendChild(item);
			tr.appendChild(price);
			tr.appendChild(quantity);
			tr.appendChild(subTotal);

			tableBodyTag.appendChild(tr);
		});
		var total_rows = document.createElement("tr");

		var td1 = document.createElement("td");
		var td2 = document.createElement("td");
		var td3 = document.createElement("td");
		var td4 = document.createElement("td");

		td1.setAttribute("class", "no-line");
		td2.setAttribute("class", "no-line");
		td3.setAttribute("class", "text-center no-line");

		var strong = document.createElement("strong");

		strong.innerHTML = "Total";
		td3.appendChild(strong);
		td4.setAttribute("class", "text-right no-line");
		td4.innerHTML = "$" + orderSummary.total_bill;

		total_rows.appendChild(td1);
		total_rows.appendChild(td3);
		total_rows.appendChild(td4);
		total_rows.appendChild(td2);

		tableBodyTag.appendChild(total_rows);

		var th = document.createElement("th");
	},

	getDishes: async function () {
		return await firebase
			.firestore()
			.collection("dishes")
			.get()
			.then((e) => {
				return e.docs.map((doc) => doc.data());
			});
	},
	handlerMarkerLost: function () {
		var button_Div = document.getElementById("button-div");
		button_Div.style.display = "none";
	},
});
