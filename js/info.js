
var Main = (function()
{
	var _folderPath = 'assets/teachers/' + gSelectArea + '/' + gTeacherId + '/'
		,_introData = ""
		,_imgData = []
		,_videoData = []
		,_nowDisplayType = ""; //default

	//-------------------------------------
	function init()
	{
		$.getJSON(
			_folderPath + gTeacherId + '.json',
			function( json )
			{
				if(gSelectArea != "A")
				{
					_introData = json[gSelectType]["intro"];
					_imgData = json[gSelectType]["images"];
					_videoData = json[gSelectType]["videos"];

					//Setup intro
					setupIntro();

					//Setup images info
					setupImageInfo();

					//Setup videos info
					setupVideoInfo();

					changeDisplay('text');	
				}
			}
		);
	}

	//-------------------------------------
	function setupIntro( )
	{
		var Text_ = document.createElement('p');
		Text_.id = "IntroText";
		Text_.className = "IntroText";

		$('#info_text').append(Text_);
		$('#IntroText').append(_introData);
	}

	//-------------------------------------
	function setupImageInfo( )
	{
		for(i = 0; i < _imgData.length; i++)
		{
			var newDiv_ = document.createElement('div');
			newDiv_.id = 'imgMediaDiv_' + i;
			newDiv_.style.width = '100%';
			newDiv_.style.height = '100%';

			var photoDiv_ = document.createElement('div');
			photoDiv_.id = 'imgDiv_' + i;
			photoDiv_.className = "mediaDiv";

			var photo_ = document.createElement('img');
			photo_.id = 'img_' + i;
			photo_.className = 'media';

			var text_ = document.createElement('p');
			text_.id = 'imgInfo_' + i;
			text_.className = 'ItemIntro';

			photoDiv_.appendChild(photo_);
			newDiv_.appendChild(photoDiv_);
			newDiv_.appendChild(text_);

			$('#info_images').append(newDiv_);

			$('#imgInfo_' + i).append(_imgData[i]['name']);
			$('#img_' + i).attr('data-lazy', _folderPath + gSelectType + '/images/' + _imgData[i]['file']);
		}

		$('#info_images').slick({
			lazyLoad: 'ondemand'
			,arrows:false
			,speed: 500
		});
	}

	//-------------------------------------
	function setupVideoInfo( )
	{
		for(i = 0; i < _videoData.length; i++)
		{
			var newDiv_ = document.createElement('div');
			newDiv_.id = 'videoMediaDiv_' + i;
			newDiv_.style.width = '100%';
			newDiv_.style.height = '100%';

			var videoDiv_ = document.createElement('div');
			videoDiv_.id = 'videoDiv_' + i;
			videoDiv_.className = "mediaDiv";

			var video_ = document.createElement('video');
			video_.id = 'video_' + i;
			video_.controls = true;
			video_.className = 'media';

			var text_ = document.createElement('p');
			text_.id = 'videoInfo_' + i;
			text_.className = 'ItemIntro';

			videoDiv_.appendChild(video_);
			newDiv_.appendChild(videoDiv_);
			newDiv_.appendChild(text_);

			$('#info_videos').append(newDiv_);

			$('#videoInfo_' + i).append(_videoData[i]['name']);
			$('#video_' + i).attr('src', _folderPath + gSelectType + '/videos/' + _videoData[i]['file']);
		}

		$('#info_videos').slick({
			arrows:false
			,speed: 500
		});
	}

	//-------------------------------------
	function changeDisplay( type )
	{
		if(type == _nowDisplayType)
		{
			//same type, do nothing
			return;
		}

		//fade out the type that display defore
		if($('#info_text').hasClass('fadeIn'))
		{
			$('#info_text').removeClass('fadeIn');
			$('#info_text').addClass('fadeOut');
		}
		else if($('#info_images').hasClass('fadeIn'))
		{
			$('#info_images').removeClass('fadeIn');
			$('#info_images').addClass('fadeOut');
		}
		else if($('#info_videos').hasClass('fadeIn'))
		{
			$('#info_videos').removeClass('fadeIn');
			$('#info_videos').addClass('fadeOut');
		}

		//fade in the display type
		switch(type)
		{
			case 'text':
			{
				if($('#info_text').hasClass('fadeOut'))
				{
					$('#info_text').removeClass('fadeOut');
					$('#info_text').addClass('fadeIn');
				}
				setArrowBtnVisible(false);
				break;
			}
			case 'images':
			{
				if($('#info_images').hasClass('fadeOut'))
				{
					$('#info_images').removeClass('fadeOut');
					$('#info_images').addClass('fadeIn');
				}
				setArrowBtnVisible(true);
				setArrowBtnEvent(type);
				break;
			}
			case 'videos':
			{
				if($('#info_videos').hasClass('fadeOut'))
				{
					$('#info_videos').removeClass('fadeOut');
					$('#info_videos').addClass('fadeIn');
				}
				setArrowBtnVisible(true);
				setArrowBtnEvent(type);
				break;
			}
		}
		_nowDisplayType = type;
	}


	//-------------------------------------
	//Arrow Button
	function setArrowBtnVisible( value )
	{
		if(value)
		{
			//visible button
			if($('#BtnArrowLeft').hasClass('fadeOut'))
			{
				$('#BtnArrowLeft').removeClass('fadeOut');
				$('#BtnArrowLeft').addClass('fadeIn');
			}
			if($('#BtnArrowRight').hasClass('fadeOut'))
			{
				$('#BtnArrowRight').removeClass('fadeOut');
				$('#BtnArrowRight').addClass('fadeIn');
			}
		}
		else
		{
			//invisible button
			if($('#BtnArrowLeft').hasClass('fadeIn'))
			{
				$('#BtnArrowLeft').removeClass('fadeIn');
				$('#BtnArrowLeft').addClass('fadeOut');
			}
			if($('#BtnArrowRight').hasClass('fadeIn'))
			{
				$('#BtnArrowRight').removeClass('fadeIn');
				$('#BtnArrowRight').addClass('fadeOut');
			}
		}
	}

	//-------------------------------------
	function setArrowBtnEvent( type )
	{
		//add button event
		$('#BtnArrowLeft').off('click');
		$('#BtnArrowLeft').on('click', function(){
			$('#info_' + type).slick('slickPrev');
		});

		$('#BtnArrowRight').off('click');
		$('#BtnArrowRight').on('click', function(){
			$('#info_' + type).slick('slickNext');
		});	
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

		$('#BtnArrowLeft').css('left', (0.1787 * $winWidth_).toString() + 'px').css('top', (0.483 * $winHeight_).toString() + 'px');
		$('#BtnArrowRight').css('left', (0.874 * $winWidth_).toString() + 'px').css('top', (0.483 * $winHeight_).toString() + 'px');

		$('#display').css('left', (0.1533 * $winWidth_).toString() + 'px').css('top', (0.1153 * $winHeight_).toString() + 'px');
	}

	//-------------------------------------
	//public
	return {
		init : init,
		resize : resize,
		changeDisplay : changeDisplay
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