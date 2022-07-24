AFRAME.registerComponent("create-button", {
    init: function(){
        var button_1 = document.createElement("button")
        button_1.innerHTML = "Rate Us!"
        button_1.setAttribute("id", "rating-button")
        button_1.setAttribute("class", "btn btn-warning")

        var button_2 = document.createElement("button")
        button_2.innerHTML = "Order Now!"
        button_2.setAttribute("id", "order-button")
        button_2.setAttribute("class", "btn btn-warning")

        var button_Div = document.getElementById("button-div")
        button_Div.appendChild(button_1)
        button_Div.appendChild(button_2)

}
})