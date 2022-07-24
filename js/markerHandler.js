AFRAME.registerComponent("marker-handler", {
	init: async function () {
		    var dishes = await this.getDishes();

    this.el.addEventListener("markerFound", () => {
      var markerId = this.el.id;
      this.handleMarkerFound(dishes, markerId);
	});
		
		this.el.addEventListener("markerLost", (e) => {
			this.handlerMarkerLost(e);
		});
	},

	handlerMarkerFound: function (dishes, marker_id) {
		var button_Div = document.getElementById("button-div");
		button_Div.style.display = "flex";
		var rating_button = document.getElementById("rating-button");
		var order_button = document.getElementById("order-button");
		var date = new Date()
		var todaysday = date.getDay()
		var days = [
			"sunday",
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday"
		  ];
var dish = dishes.filter(dish => dish.id == marker_id)[0]
		var unavailable_Days = dish.unavailable_days
		
		if (unavailable_Days.includes(todaysday)) {
			swal({
				icon: "warning",
				title: dish.dish_name.toUpperCase(),
				text: "Dish Unavailable Today",
				timer: "2500",
				buttons: false
			});
		}
		rating_button.addEventListener("click", () => {
			swal({
				icon: "warning",
				title: "Rate Dish",
				text: "Work in Progress",
			});
		});

		order_button.addEventListener("click", () => {
			swal({
				icon: "success",
				title: "Order Dish",
				text: "Preparing...",
			});
		});
	},

	handlerMarkerLost: function () {
		var button_Div = document.getElementById("button-div");
		button_Div.style.display = "none";
	},
});
