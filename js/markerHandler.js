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
			plane.setAttribute("visible", false);

			var pricePlane = document.querySelector(`#price-plane-${dish.id}`);
			pricePlane.setAttribute("visible", false);

			var buttonDiv = document.getElementById("button-div");
			buttonDiv.style.display = "flex";

			var rating_Button = document.getElementById("rating-button");
			var order_Button = document.getElementById("order-button");

			if (tableNo !== null) {
				rating_button.addEventListener("click", () => {
					swal({
						icon: "warning",
						title: "Rate Dish",
						text: "Work in Progress",
					});
				});

				order_button.addEventListener("click", () => {
					var tno;
					tableNo <= 9 ? (tno = "T0" + tableNo) : (tno = "T" + tableNo);

					swal({
						icon: "success",
						title: "Order Dish",
						text: "Preparing...",
						timer: 2000,
						buttons: false,
					});
				});
			}
		}
	},
	handlerOrder: function (tno, dish) {
		var details;
		firebase.firestore().collection("tables").doc(tno).get().then((doc) => {
			details = doc.data()
			if (details["current_orders"][dish.id]) {
				details["current_orders"][dish.id]["quantity"] += 1
				var currentQuantity = details["current_orders"][dish.id]["quantity"]
				details["current_orders"][dish.id]["sub_total"] = currentQuantity*dish.price
			} else {
				details["current_orders"][dish.id]  = {
					"item": dish.dish_name,
					"price": dish.price,
					"quantity": 1,
					"sub_total": dish.price
				}
			}

			details["total_bill"]+=dish.price

			firebase.firestore().collection("tables").doc(doc.id).update(details)
		})
		
},
	handlerMarkerLost: function () {
		var button_Div = document.getElementById("button-div");
		button_Div.style.display = "none";
	},
});
