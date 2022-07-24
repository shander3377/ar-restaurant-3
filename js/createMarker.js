AFRAME.registerComponent("create-marker", {
	init: async function () {
		var scene = document.querySelector("#scene");
		var dishes = await this.getDishes();
		dishes.map((dish) => {
			var marker = document.createElement("a-marker");
			marker.setAttribute("id", dish.id);
			marker.setAttribute("type", "pattern");
			marker.setAttribute("url", dish.marker_patt_url);
			marker.setAttribute("cursor", { rayOrigin: "mouse" });
			marker.setAttribute("marker-handler", {});

			scene.appendChild(marker);

			var date = new Date();
			var todaysday = date.getDay();

			var unavailable_Days = dish.unavailable_days;

			if (unavailable_Days.includes(todaysday)) {
				swal({
					icon: "warning",
					title: dish.dish_name.toUpperCase(),
					text: "Dish Unavailable Today",
					timer: "2500",
					buttons: false,
				});
			}

			var model = document.createElement("a-entity");
			model.setAttribute("id", `model-${dish.id}`);
			model.setAttribute("gltf-model", `url(${dish.model_url})`);
			model.setAttribute("position", dish.model_geometry.position);
			model.setAttribute("scale", dish.model_geometry.scale);
			model.setAttribute("rotation", dish.model_geometry.rotation);
			model.setAttribute("gesture-handler", {});

			marker.appendChild(model);

			var plane = document.createElement("a-plane");
			plane.setAttribute("id", `plane-${dish.id}`);
			plane.setAttribute("position", { x: 0, y: 0, z: 0 });
			plane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
			plane.setAttribute("width", 1.7);
			plane.setAttribute("height", 1.5);

			marker.appendChild(plane);

			var titlePlane = document.createElement("a-plane");
			titlePlane.setAttribute("id", `titlePlane-${dish.id}`);
			titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 });
			titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
			titlePlane.setAttribute("width", 1.69);
			titlePlane.setAttribute("height", 0.3);
			titlePlane.setAttribute("material", { color: "yellow" });

			plane.appendChild(titlePlane);

			var dishTitle = document.createElement("a-entity");
			dishTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 });
			dishTitle.setAttribute("text", {
				value: dish.dish_name.toUpperCase(),
				font: "monoid",
				color: "black",
				width: 1.8,
				height: 1,
				align: "center",
			});
			dishTitle.setAttribute("id", `dishTitle${dish.id}`);

			titlePlane.appendChild(dishTitle);

			var dishIngredients = document.createElement("a-entity");
			dishIngredients.setAttribute("position", { x: 0.3, y: 0, z: 0.1 });
			dishIngredients.setAttribute("text", {
				value: `${dish.dish_ingredients.join("\n \n")}`,
				font: "monoid",
				color: "black",
				width: 2,
				align: "left",
			});
			dishIngredients.setAttribute("id", `dishIngredients${dish.id}`);

			plane.appendChild(dishIngredients);

			var pricePlane = document.createElement("a-image");
			pricePlane.setAttribute("id", `price-plane-${dish.id}`);
			pricePlane.setAttribute(
				"src",
				"https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png"
			);
			pricePlane.setAttribute("width", 0.8);
			pricePlane.setAttribute("height", 0.8);
			pricePlane.setAttribute("position", { x: -1.3, y: 0, z: 0.3 });
			pricePlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });

			//Price of the dish
			var price = document.createElement("a-entity");
			price.setAttribute("id", `price-${dish.id}`);
			price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 });
			price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
			price.setAttribute("text", {
				font: "mozillavr",
				color: "white",
				width: 3,
				align: "center",
				value: `Only\n $${dish.price}`,
			});

			pricePlane.appendChild(price);
			marker.appendChild(pricePlane);
		});
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
});
