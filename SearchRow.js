

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