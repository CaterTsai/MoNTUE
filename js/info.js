
var Main = (function()
{
	var _folderPath = 'assets/teachers/' + gSelectArea + '/' + gTeacherId + '/';

	//-------------------------------------
	function init()
	{
		$.getJSON(
			_folderPath + gTeacherId + '.json',
			function( json )
			{
				
			}
		);
	}

	//-------------------------------------
	function setupDisplay( type )
	{

	}

	//-------------------------------------
	function resize()
	{
		var $winHeight_ = $(window).height()
			,$winWidth_ = $(window).width();

		//Area Btn
		$('#BtnText').css('left', (0.02694 * $winWidth_).toString() + 'px').css('top', (0.1307 * $winHeight_).toString() + 'px');
		$('#BtnImages').css('left', (0.02694 * $winWidth_).toString() + 'px').css('top', (0.2334 * $winHeight_).toString() + 'px');
		$('#BtnVideos').css('left', (0.02694 * $winWidth_).toString() + 'px').css('top', (0.338 * $winHeight_).toString() + 'px');

		$('#display').css('left', (0.1533 * $winWidth_).toString() + 'px').css('top', (0.1153 * $winHeight_).toString() + 'px');
	}

	//-------------------------------------
	//public
	return {
		init : init,
		resize : resize
	};
}
)()


//------------------------------
//Main
window.onload
{
	Main.init();
	Main.resize();
}

window.onresize = function()
{
	Main.resize();	
}