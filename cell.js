
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