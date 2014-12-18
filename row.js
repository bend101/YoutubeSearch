
var App = require("./App");
var Cell = require("./cell");
var AppUtils = require("./Apputils");

function Row(search, lastSearchFlag, app)
{
	this.search = search;
	this.lastSearchFlag=lastSearchFlag;
	this.app=app;

	this.nameElement=document.createElement("div");
	this.nameElement.className="nameElement";
	this.exitButton=document.createElement("img");
	this.exitButton.className="exitButton";
	this.exitButton.src="images/exit.png";
		this.exitButton.addEventListener("click",this.onExitClick.bind(this));

	this.nameElement.innerHTML=search;

	this.rowElement = document.createElement("div");
	this.rowElement.className = "row";
	this.rowElement.id = "row";

	this.outsideRowElement = document.createElement("div");
	this.outsideRowElement.appendChild(this.nameElement);
	this.outsideRowElement.appendChild(this.rowElement);
	this.nameElement.appendChild(this.exitButton);

	this.outsideRowElement.className = "outsideRow";
	this.outsideRowElement.id = "outsideRow";
	document.body.appendChild(this.outsideRowElement);

	this.outsideRowElement.addEventListener("mousedown", this.onMouseDown.bind(this));
	this.outsideRowElement.addEventListener("mouseup", this.onMouseUp.bind(this));
	this.outsideRowElement.addEventListener("mousemove", this.onMouseMove.bind(this));

	this.outsideRowElement.addEventListener("touchstart", this.onTouchDown.bind(this));
	this.outsideRowElement.addEventListener("touchend", this.onTouchUp.bind(this));
	this.outsideRowElement.addEventListener("touchmove", this.onTouchMove.bind(this));

	this.mouseDown = false;
	this.x = 0;
	this.divLeft = this.rowElement.offsetLeft;
	this.cellArray = [];
	this.searchFlag = false;
}

Row.prototype.loadVideos = function ()
{
	console.log("loading "+this.search);
	var request = gapi.client.youtube.search.list(
		{
			q: this.search,
			part: 'snippet',
			maxResults: 20,
			type: 'video'
		}
	);

	request.execute(
		function (response)
		{
//			var str = JSON.stringify(response.result);
//			console.log(str);
			for (var i = 0; i < response.result.items.length; i++)
			{
				var item = response.result.items[i];
				var videoId=item.id.videoId;

				var cell = new Cell(item, this.app, this);


				var cellDiv = cell.getContainingElement();
				this.rowElement.appendChild(cellDiv);
				this.cellArray.push(cell);
			}
			this.updateVisibleImages();
		}.bind(this));
	this.searchFlag = true;
}

Row.prototype.onMouseDown = function (event)
{
	this.divLeft = this.rowElement.offsetLeft;
	this.x = event.clientX;
	event.preventDefault();
//	alert(this.x);
	this.mouseDown = true;
}

Row.prototype.onMouseUp = function (event)
{
	this.mouseDown = false;
	event.preventDefault();
}

Row.prototype.onMouseMove = function (event)
{
	if (this.mouseDown === true)
	{
		//setInterval(this.updateVisibleImages.bind(this), 500);
		this.updateVisibleImages();

		var difference = event.clientX - this.x;
		this.rowElement.style.left = (this.divLeft + difference) + "px";
		event.preventDefault();
		var setLeft = this.divLeft + difference;
		this.rowElement.style.left = setLeft + "px";

		if (this.rowElement.offsetLeft > 0)
		{
			this.rowElement.style.left = "0px";
		}
		if (this.rowElement.offsetLeft < (window.innerWidth-30-this.rowElement.clientWidth))
		{
			this.rowElement.style.left = (window.innerWidth-30-this.rowElement.clientWidth)+"px";
		}
	}
}


Row.prototype.onTouchDown = function (event)
{
	this.x = event.changedTouches[0].pageX;
	this.divLeft = this.rowElement.offsetLeft;
	this.mouseDown = true;
}


Row.prototype.onTouchUp = function (event)
{
	this.mouseDown = false;
}

Row.prototype.onTouchMove = function (event)
{
	if (this.mouseDown === true)
	{
		this.updateVisibleImages();

		var difference = event.changedTouches[0].pageX - this.x;
		event.preventDefault();
		var setLeft = this.divLeft + difference;
		this.rowElement.style.left = setLeft + "px";

		if (this.rowElement.offsetLeft > 0)
		{
			this.rowElement.style.left = "0px";
		}
		if (this.rowElement.offsetLeft + this.rowElement.clientWidth > 0)
		{
			this.rowElement.style.right = "0px";
		}
	}
}

Row.prototype.updateVisibleImages = function ()
{
	for (var i = 0; i < this.cellArray.length; i++)
	{
		if (this.cellArray[i].loaded === false)
		{
			if (AppUtils.isElementInView(this.cellArray[i].containerElement) === true)
			{
				this.cellArray[i].imageElement.src = this.cellArray[i].youtubeItem.snippet.thumbnails.default.url;
//				console.log("loaded");
				this.cellArray[i].loaded = true;
			}
		}
	}
}


Row.prototype.lastRow=function()
{
	if (this.lastSearchFlag===true)
	{
		this.searchBar = document.createElement("div");
		this.searchBar.className = "searchBar";

	}
}

Row.prototype.onExitClick=function()
{
	var parent=this.outsideRowElement.parentNode;
	parent.removeChild(this.outsideRowElement);
	this.app.deleteRowFromList(this);
}


module.exports = Row;