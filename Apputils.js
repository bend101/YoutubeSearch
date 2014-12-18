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
