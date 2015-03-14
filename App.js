var Row = require("./row");
var SearchRow = require("./SearchRow");
var AppUtils = require("./Apputils");

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
	//var apiKey=localStorage.getItem("youTubeKey");
	//if(apiKey===null)
	//{
	//	 apiKey=prompt("Enter your youtube api key");
	//	localStorage.setItem("youTubeKey",apiKey);
	//
	//}
	gapi.client.setApiKey("AIzaSyCBOgDnhD_8OYLql5CWed9YGoO_9sQXSLw");
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