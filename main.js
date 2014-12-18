/**
 * Created by Ben on 01/11/2014.
 */
var App = require("./App");

window.onload=function()  //global
{
	var app = new App();  //creates new App
	app.logIn();  //calls app.log in
	window.addEventListener("scroll", app.onScroll.bind(app));  //add listener on thw window for scrolling
}
