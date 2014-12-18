/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Ben on 01/11/2014.
	 */
	var App = __webpack_require__(1);

	window.onload=function()  //global
	{
		var app = new App();  //creates new App
		app.logIn();  //calls app.log in
		window.addEventListener("scroll", app.onScroll.bind(app));  //add listener on thw window for scrolling
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Row = __webpack_require__(2);
	var SearchRow = __webpack_require__(3);
	var AppUtils = __webpack_require__(4);

	function App()
	{
		this.rowArray = [];
		this.searchStrings = [];
		this.screenWidth=window.innerWidth;
		console.log(this.screenWidth);
		this.screenHeight=window.innerHeight;
		this.videoIframe=document.createElement("IFRAME");
		this.videoIframe.className="videoIframe";
		this.videoIframe.src="http://www.youtube.com/embed/";
		this.videoIframe.style.left=((this.screenWidth-640)/2)+"px";
		this.videoIframe.style.top=((this.screenHeight-360)/2)+"px";
		this.leftVideoIframe=parseInt(this.videoIframe.style.left.replace('px', ''));
		console.log(this.leftVideoIframe);
		this.rightVideoIframe=this.leftVideoIframe+640;

		this.topVideoIframe=parseInt(this.videoIframe.style.top.replace('px', ''));

		this.exitButtonOnIframe=document.createElement("img");
		this.exitButtonOnIframe.className="exitButtonOnIframe";
		this.exitButtonOnIframe.src="images/exit2.png";
		this.exitButtonOnIframe.style.left=(this.rightVideoIframe-8)+"px";
		this.exitButtonOnIframe.style.top=(this.topVideoIframe-13)+"px";
		this.exitButtonOnIframe.addEventListener("click", this.onExitClick.bind(this));

		this.exitButtonOnIframe.style.cursor="pointer";
		document.body.appendChild(this.videoIframe);
		document.body.appendChild(this.exitButtonOnIframe);

	}

	App.prototype.logIn=function()  //logs in to youtube api
	{
		var apiKey=localStorage.getItem("youTubeKey");
		if(apiKey===null)
		{
			 apiKey=prompt("Enter your youtube api key");
			localStorage.setItem("youTubeKey",apiKey);

		}
		gapi.client.setApiKey(apiKey);
		gapi.client.load('youtube', 'v3',
			function()  //inline function added to end of the load from youtube, when logged in do what is in the function.
			{
				var returnedString=localStorage.getItem("youtube-searches");  //get string from local storage with name youtube-searches.

				this.searchStrings=JSON.parse(returnedString);  //string returned needs to be made back into an array.
				if (returnedString===null || returnedString==="[]")  //if there is nothing in the local storage set searches to default.
				{
					this.searchStrings=["beyonce","taylor swift"];
				}
				new SearchRow(this);
				for (var i=0;i<this.searchStrings.length;i++)  //go through the row array and add a new Row.
				{

					var row=new Row(this.searchStrings[i],false, this);
					this.rowArray.push(row);  //add the row to the rowArray.
					if(AppUtils.isElementInView(this.rowArray[i].rowElement)===true)  //if when you call isElementInView passing in the row element it equals true
					{
						this.rowArray[i].loadVideos(); //on the row that is visible call the loadVideos function.
					}
				}

			}.bind(this)  //because youtube calls you back when you have logged in you need to make sure this is equal to the app.
		);
	}


	App.prototype.onScroll=function()  //when a scroll event is detected, go through the row array.
	{
		for (var i=0;i<this.rowArray.length;i++)
		{
			if (this.rowArray[i].searchFlag===false) //if videos arent already loaded.
			{
				if(AppUtils.isElementInView(this.rowArray[i].rowElement)===true)  //if they are in view
				{
					this.rowArray[i].loadVideos();
				}
			}
		}
	}




	App.prototype.deleteRowFromList=function(row)  //takes the row element that has been deleted and deletes it from the array.
	{
		for (var i=0;i<this.rowArray.length;i++)
		{
			if (this.rowArray[i]===row)
			{
				this.rowArray.splice(i,1);
				this.saveSearches();
			}
		}

	}

	App.prototype.saveSearches=function()  //goes through row array and gets out the searchs and puts into a new array, which is saved on the local storage.
	{
		var array=[];
		for (var i=0;i<this.rowArray.length;i++)
		{
			var search=this.rowArray[i].search;
			array.push(search);
		}
		var searchAsString=JSON.stringify(array);
		localStorage.setItem("youtube-searches", searchAsString);
	}

	App.prototype.newSearch=function(text)
	{
		var row1=new Row(text, false, this);
		this.rowArray.push(row1);
		this.saveSearches();
		if(AppUtils.isElementInView(row1.rowElement)===true)  //if when you call isElementInView passing in the row element it equals true
		{
			row1.loadVideos(); //on the row that is visible call the loadVideos function.
		}
	}



	App.prototype.onExitClick=function()
	{
		this.videoIframe.style.visibility="hidden";
		this.exitButtonOnIframe.style.visibility="hidden";
		this.videoIframe.src="about:blank";
	}

	module.exports = App;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	var App = __webpack_require__(1);
	var Cell = __webpack_require__(5);
	var AppUtils = __webpack_require__(4);

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	

	function SearchRow(app)
	{
		this.app=app;
		this.searchRow=document.createElement("div");
		this.searchRow.className="searchRow";
		this.searchRow.innerHTML="Enter new search:";
		document.body.appendChild(this.searchRow);
		this.inputBox=document.createElement("input");
		this.inputBox.type = "text";
		this.inputBox.className="inputBox";
		this.inputBox.addEventListener("keydown",this.onEnter.bind(this));
		this.searchRow.appendChild(this.inputBox);
		this.searchButton=document.createElement("button");
		this.searchButton.className="searchButton";
		this.searchButton.innerHTML="search";
		this.searchRow.appendChild(this.searchButton);
		this.searchButton.addEventListener("click",this.onClick.bind(this));
	}


	SearchRow.prototype.onEnter=function(event)
	{
	   if (event.key==="Enter")
	   {
	    var text=this.inputBox.value;
		console.log(text);
		this.app.newSearch(text);
	   }
	}

	SearchRow.prototype.onClick=function(event)
	{

			var text=this.inputBox.value;
			console.log(text);
			this.app.newSearch(text);

	}

	module.exports = SearchRow;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Ben on 01/11/2014.
	 */
	var AppUtils =
	{
		isElementInView: function (element)  //pass in element to be tested
		{
			var rect = element.getBoundingClientRect();  //gets coordinates of element

			if (
				rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
				rect.left < (window.innerWidth || document.documentElement.clientWidth)
				)
			{
				return true; //true=on screen
			}
			else
			{
				return false;
			}
		}
	};
	module.exports = AppUtils;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	function Cell(youtubeItem, app, row)
	{
		this.youtubeItem=youtubeItem;
		this.videoId1=youtubeItem.id.videoId;
			this.app=app;
		this.row=row;
		this.left=null;


		this.containerElement=document.createElement("div");
		this.containerElement.className="container";
		this.imageElement=document.createElement("img");
		this.imageElement.className="image";
		this.imageElement.src="images/loading.png";
		this.imageElement.addEventListener("click", this.onImageClick.bind(this));
		this.imageElement.addEventListener("mousedown", this.onImageMouseDown.bind(this));
		this.textElement=document.createTextNode(youtubeItem.snippet.title);
		this.textElement.className="text";
		this.containerElement.appendChild(this.imageElement);

		this.containerElement.appendChild(this.textElement);
		this.loaded=false;
	}


	Cell.prototype.getContainingElement=function()  //gets the container element when called.
	{
		return this.containerElement;
	}

	Cell.prototype.onImageMouseDown=function()
	{
		this.left=this.row.rowElement.offsetLeft;

	}


	Cell.prototype.onImageClick=function()
	{

		if (this.row.rowElement.offsetLeft===this.left)
		{
			this.app.videoIframe.style.visibility = "visible";
			this.app.exitButtonOnIframe.style.visibility = "visible";
			this.app.videoIframe.src = "http://www.youtube.com/embed/" + this.videoId1;
		}

	}

	module.exports = Cell;


	//this.imageElement.src=youtubeItem.snippet.thumbnails.default.url;

/***/ }
/******/ ])