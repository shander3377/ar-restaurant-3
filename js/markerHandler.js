AFRAME.registerComponent("marker-handler", {
	init: async function () {
		this.el.addEventListener("markerFound", (e) => {
			this.handlerMarkerFound(e);
		});
		this.el.addEventListener("markerLost", (e) => {
			this.handlerMarkerLost(e);
		});
	},

	handlerMarkerFound: function () {
		var button_Div = document.getElementById("button-div");
		button_Div.style.display = "flex";
		var rating_button = document.getElementById("rating-button");
		var order_button = document.getElementById("order-button");

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
