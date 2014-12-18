/**
 * Created by Ben on 20/10/2014.
 */



function outsideRow()
{
	this.outsideRowElement=document.createElement("div");
	this.outsideRowElement.className="outsideRow";
	this.outsideRowElement.id="outsideRow";
	document.body.appendChild(this.outsideRowElement);
}

module.exports = outsideRow;

