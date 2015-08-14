
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
		//setting title
		switch(gSelectType)
		{
			case 'A':
				$('#title').text("教師介紹");break;
			case 'B':
				$('#title').text("課程設計");break;
			case 'C':
				$('#title').text("執行紀錄");break;
			case 'D':
				$('#title').text("反思回饋");break;
		}

		$.getJSON(
			_folderPath + gTeacherId + '.json',
			function( json )
			{
				if(gSelectType != "A")
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
				else
				{
					_introData = json[gSelectType]["intro"];
					setupIntro();

					$('#BtnText').hide();
					$('#BtnImages').hide();
					$('#BtnVideos').hide();

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

		if(gSelectType == "A")
		{
			var PersonalPhoto_ = document.createElement('img');
			PersonalPhoto_.className = "personalPhoto";
			PersonalPhoto_.src = _folderPath + "photo.jpg";
			$('#info_text').append(PersonalPhoto_);
		}

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

		if(_imgData.length > 0)
		{
			$('#info_images').slick({
				lazyLoad: 'ondemand'
				,arrows:false
				,speed: 500
			});
		}
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
			video_.loop = true;
			//video_.controls = true;
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

		if(_imgData.length > 0)
		{
			//set event
			$('#info_videos').on(
				'beforeChange', 
				function(event, slick, currentSlide, nextSlide){
					var video_ = document.getElementById('video_' + currentSlide);
					video_.pause();
				}
			);

			$('#info_videos').on(
				'afterChange', 
				function(event, slick, currentSlide, nextSlide)
				{
					var video_ = document.getElementById('video_' + currentSlide);
					video_.currentTime = 0;
					video_.play();
				}
			);

			$('#info_videos').slick({
				arrows:false
				,speed: 500
			});
		}

	}

	//-------------------------------------
	function changeDisplay( type )
	{
		if(type == _nowDisplayType)
		{
			//same type, do nothing
			return;
		}

		if(_nowDisplayType == 'videos')
		{
			stopVideo();
		}

		//fade out the type that display defore
		setVisable('info_' + _nowDisplayType, false);

		//fade in the display type
		setVisable('info_' + type, true);

				
		if((type == 'videos' && _videoData.length <= 0) || type == 'images' && _imgData.length <= 0)
		{
			if(_nowDisplayType == 'videos' || _nowDisplayType == 'images')
			{
				setVisable('BtnArrowLeft', false);
				setVisable('BtnArrowRight', false);
			}
			_nowDisplayType = type
			return;
		}


		//setup 
		switch(type)
		{
			case 'text':
			{
				setVisable('BtnArrowLeft', false);
				setVisable('BtnArrowRight', false);
				//setArrowBtnVisible(false);
				break;
			}
			case 'images':
			{
				setVisable('BtnArrowLeft', true);
				setVisable('BtnArrowRight', true);
				//setArrowBtnVisible(true);
				setArrowBtnEvent(type);
				resetImages();
				break;
			}
			case 'videos':
			{
				setVisable('BtnArrowLeft', true);
				setVisable('BtnArrowRight', true);
				//setArrowBtnVisible(true);
				setArrowBtnEvent(type);
				resetVideos();
				break;
			}
		}
		_nowDisplayType = type
		
	}

	//-------------------------------------
	function setVisable( name, value)
	{
		if(value)
		{
			$('#' + name).css('visibility', 'visible');
			//visable ctrl
			if($('#' + name).hasClass('fadeOut'))
			{
				$('#' + name).removeClass('fadeOut');
				$('#' + name).addClass('fadeIn');
			}
		}
		else
		{			
			//invisable ctrl
			if($('#' + name).hasClass('fadeIn'))
			{
				$('#' + name).removeClass('fadeIn');
				$('#' + name).addClass('fadeOut');

				$('#' + name).on('transitionend', function(){
					$('#' + name).css('visibility', 'hidden');
					$('#' + name).off('transitionend');
				});
			}
		}	
	}

	//-------------------------------------
	//Display method
	function resetImages()
	{
		if(_imgData.length > 0)
		{
			$('#info_images').slick('slickGoTo', 0, true);
		}
	}

	//-------------------------------------	
	function resetVideos()
	{
		if(_videoData.length > 0)
		{
			$('#info_videos').slick('slickGoTo', 0, true);	
		}
	}

	//-------------------------------------	
	function stopVideo()
	{
		if(_videoData.length > 0)
		{
			var NowSlide_ = $('#info_videos').slick('slickCurrentSlide');
			var video_ = document.getElementById('video_' + NowSlide_);
			video_.currentTime = 0;
			video_.pause();
		}
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

		$('#display').css('left', (0.1533 * $winWidth_).toString() + 'px').css('top', (0.147 * $winHeight_).toString() + 'px');
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