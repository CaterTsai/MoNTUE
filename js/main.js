//const
var cMAX_TEACHER_NUM_IN_PAGE = 12;
var cTEACHER_NUM_IN_ROW = 4;
var cTEACHER_BTN_CENTER = [951, 424];
var cTEACHER_BTN_POS = new Array(	[413, 111], [769, 111], [1125, 111], [1480, 111],
									[413, 424], [769, 424], [1125, 424], [1480, 424],
									[413, 728], [769, 728], [1125, 728], [1480, 728]
	);
var cTIMEOUT_CHECK_M = 1;
var cTIMEOUT_LIMIT_M = 1;
var Main = (function()
{
	var _selectId = -1
		,_isIdle = true
		,_isSelectItem = false
		,_timer = 0
		,_IdleHandle
		,_selectTeacherId = -1
		,_selectArea = ""
		,_pageNum = 0
		,_totalPage = 0		
		,_TeacherBtnData = [];

	function init()
	{
		setupTeacherPhoto();
	}

	function idleCheck()
	{
		if(_isIdle)
		{
			return;
		}

		if(_timer >= cTIMEOUT_LIMIT_M)
		{
			_isIdle = true;

			if(_isSelectItem)
			{
				onBtnClose();
			}

			if(_selectArea != "")
			{
				onBtnHome();
			}

			setVisibleSlow('LoopVideo', true);
			var video_ = document.getElementById('LoopVideo');
			video_.currentTime = 0;
			video_.play();
			
			setIdleCheck(false);
		}
		_timer += 1;

	}

	//-------------------------------------
	//Setting function
	//-------------------------------------
	function setTeacherBtnData( pageNum )
	{
		var StartId_ = (pageNum - 1) * cMAX_TEACHER_NUM_IN_PAGE;
		var EndId_ = (pageNum) * cMAX_TEACHER_NUM_IN_PAGE;
		EndId_ = (EndId_ < _TeacherBtnData.length) ? EndId_ : _TeacherBtnData.length;

		for(i = 0; i < cMAX_TEACHER_NUM_IN_PAGE; i++, StartId_++)
		{
			$('#teacherBtn_' + i).attr("src", "");
			$('#teacherBtn_' + i).off('click');
			$('#teacherText_' + i).empty();

			if(StartId_ < EndId_)
			{
				var ballId_ = Math.floor(i / cTEACHER_NUM_IN_ROW) + 1;
				$('#teacherBtn_' + i).attr("src", "assets/imgs/ball-" + ballId_.toString() + ".png");
				$('#teacherText_' + i).append(_TeacherBtnData[StartId_]['school'] + '<br><b>' + _TeacherBtnData[StartId_]['name'] + '</b> 老師');

				$('#teacherBtn_' + i).on(
					'click'
					,{PosId : i, TeacherDataId : StartId_}
					,onTeacherSelect
				);
			}
			//$('#teacher_' + BtnId_).addClass('blowUp');
		}
	}

	//-------------------------------------	
	function setupTeacherPhoto()
	{
		$('#BtnTeacher').empty();

		for(i = 0; i < cMAX_TEACHER_NUM_IN_PAGE; i++)
		{
			var PosX_ = cTEACHER_BTN_POS[i][0];
			var PosY_ = cTEACHER_BTN_POS[i][1];

			var NewDiv_ = document.createElement('div');
			NewDiv_.id = 'teacher_' + i;
			NewDiv_.className = 'TeacherDiv';
			NewDiv_.style.left = PosX_ + 'px';
			NewDiv_.style.top = PosY_ + 'px';

			var Btn_ = document.createElement('img');
			Btn_.id = 'teacherBtn_' + i;
			Btn_.className = 'TeacherBtn';

			var Text_ = document.createElement('p');
			Text_.id = 'teacherText_' + i;
			Text_.className = 'TeacherText';

			NewDiv_.appendChild(Btn_);
			NewDiv_.appendChild(Text_);

			$('#BtnTeacher').append(NewDiv_);
		}
	}

	//-------------------------------------
	function clearTeacherPage()
	{
		$('#infoArea').empty();
		for(i = 0; i < cMAX_TEACHER_NUM_IN_PAGE; i++)
		{
			$('#teacherBtn_' + i).attr("src", "");
			$('#teacherText_' + i).empty();

			if($('#teacher_' + i).hasClass('blowUp'))
			{
				$('#teacher_' + i).removeClass('blowUp');
			}
		}
	}

	//-------------------------------------	
	//Event
	function onLoopVideoClick()
	{
		setVisibleSlow('LoopVideo', false);
		_isIdle = false;

		setTimeout(function(){
			setAreaBtn(true);
			var video_ = document.getElementById('LoopVideo');
			video_.currentTime = 0;
			video_.pause();

			setIdleCheck(true);
		}, 800);
	}

	//-------------------------------------	
	function onAreaClick( event )
	{
		clearTeacherPage();
		setArea(event.data.area);

		PageTransitions.nextPage(
			{animation:11, showPage:1},
			function()
			{
				$.getJSON(
					"assets/" + event.data.area + ".json",
					function( json )
					{
						_TeacherBtnData = json['data'];
						_selectArea = json['area'];
						_pageNum = 1;

						_totalPage = Math.ceil(_TeacherBtnData.length / cMAX_TEACHER_NUM_IN_PAGE);
						setTeacherBtnData(_pageNum);
						
						setVisible('CtrlBtnDiv', true);

						//Display page ctrl btn
						setVisible('BtnHome', true);
						setVisible('BtnBack', true);

						$('#BtnBack').on('click', onBtnHome);

						blowUpAllBtn();
					}
				);
			}
		);
	}

	//-------------------------------------	
	function onNextPage()
	{
		_pageNum = (_pageNum + 1 > _totalPage)?1:_pageNum + 1;
		
		blowDownAllBtn(function(){
			setTeacherBtnData(_pageNum);
			blowUpAllBtn();
			$('#teacher_0').off('transitionend');
		});
	}

	//-------------------------------------		
	function onPreviousPage()
	{
		_pageNum = (_pageNum - 1 < 1)?_totalPage:_pageNum - 1;
		
		blowDownAllBtn(function(){
			setTeacherBtnData(_pageNum);
			blowUpAllBtn();
			$('#teacher_0').off('transitionend');
		});
	}

	//-------------------------------------	
	function onBtnHome()
	{
		$('#infoArea').empty();
		$('#photo').attr('src', "");
		_selectArea = "";
		PageTransitions.nextPage({animation:12, showPage:0});

		setVisible('BtnHome', false);
		setVisible('BtnBack', false);

		setVisible('CtrlBtnDiv', false);

		setVisible('itemBtnDiv', false);
		$('#selectImg').attr("src", "");
		$('#selectTeacher').attr('style', "");

		blowDownAllBtn();
	}

	//-------------------------------------	
	function onBtnBack()
	{
		setArea(_selectArea);
		$('#photo').attr('src', "");

		setVisible('itemBtnDiv', false);
		$('#selectImg').attr("src", "");
		$('#selectTeacher').attr('style', "");


		setVisible('CtrlBtnDiv', true);

		blowUpAllBtn();

		$('#BtnBack').on('click', onBtnHome);
	}

	//-------------------------------------	
	function onBtnItemSelect( type )
	{
		$('#PopupDiv').css('visibility', 'visible');

		var url_ = 'infoDisplay.php?type=' + type +'&id=' + _TeacherBtnData[_selectTeacherId]['id'] + '&area=' + _selectArea;
		$('#PopupFrame').attr('src', url_);

		//display pop-up frame
		if($('#PopupFrame').hasClass('blowDown'))
		{
			$('#PopupFrame').removeClass('blowDown');
		}
		$('#PopupFrame').addClass('blowUp');

		//display close button
		if($('#BtnClose').hasClass('blowDown'))
		{
			$('#BtnClose').removeClass('blowDown');
		}
		$('#BtnClose').addClass('blowUp');

		_isSelectItem = true;
	}

	//-------------------------------------	
	function onBtnClose()
	{
		if($('#PopupFrame').hasClass('blowUp'))
		{
			$('#PopupFrame').removeClass('blowUp');
			$('#PopupFrame').addClass('blowDown');
		}

		if($('#BtnClose').hasClass('blowUp'))
		{
			$('#BtnClose').removeClass('blowUp');
			$('#BtnClose').addClass('blowDown');
		}

		$('#PopupFrame').on(
			'transitionend'
			,function(){
				$('#PopupFrame').attr('src', "");
				$('#PopupDiv').css('visibility', 'hidden');
				$('#PopupFrame').off('transitionend');
			}
		);

		_isSelectItem = false;
	}

	//-------------------------------------
	function onTeacherSelect( event )
	{
		_selectId = event.data.PosId;
		_selectTeacherId = event.data.TeacherDataId;
		
		$('#selectTeacher').css('left', cTEACHER_BTN_POS[_selectId][0] + 'px').css('top', cTEACHER_BTN_POS[_selectId][1] + 'px');
		$('#selectImg').attr("src", $('#teacherBtn_' + _selectId).attr("src"));
		blowDownAllBtn();
		
		setVisible('CtrlBtnDiv', false);

		var transformX_ = cTEACHER_BTN_CENTER[0] - cTEACHER_BTN_POS[_selectId][0];
		var transformY_ = cTEACHER_BTN_CENTER[1] - cTEACHER_BTN_POS[_selectId][1];

		$('#selectTeacher').css('transform', 'translate(' + transformX_ +'px,' + transformY_ + 'px) scale(3.1)');
		$('#selectTeacher').on(
			'transitionend'
			,function()
			{
				$('#selectTeacher').off('transitionend');
				setVisible('itemBtnDiv', true);
				setTeacherInfo(_selectTeacherId);
				setTeacherPhoto(_selectTeacherId);

				$('#BtnBack').off('click');
				$('#BtnBack').on('click', onBtnBack);
			}
		);
	}

	//-------------------------------------
	//Switch
	function setAreaBtn(value)
	{
		if(value)
		{
			$('#BtnNorth').on('click', {area: "north"}, onAreaClick);
			$('#BtnCentral').on('click', {area: "central"}, onAreaClick);
			$('#BtnSouth').on('click', {area: "south"}, onAreaClick);
			$('#BtnEast').on('click', {area: "east"}, onAreaClick);
		}
		else
		{
			$('#BtnNorth').off('click');
			$('#BtnCentral').off('click');
			$('#BtnSouth').off('click');
			$('#BtnEast').off('click');
		}
	}

	//-------------------------------------
	function setIdleCheck(value)
	{
		if(value)
		{
			_IdleHandle = setInterval(idleCheck, 60000);// 1 minute
		    $(document).on("click", function() {
	        	_timer = 0;
		    });
		}
		else
		{
			window.clearInterval(_IdleHandle);
			$(document).off("click");
		}
	}

	//-------------------------------------
	function setVisible( name, value)
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
	function setVisibleSlow( name, value)
	{
		if(value)
		{
			$('#' + name).css('visibility', 'visible');
			//visable ctrl
			if($('#' + name).hasClass('fadeOutSlow'))
			{
				$('#' + name).removeClass('fadeOutSlow');
				$('#' + name).addClass('fadeInSlow');
			}
		}
		else
		{
			//invisable ctrl
			if($('#' + name).hasClass('fadeInSlow'))
			{
				$('#' + name).removeClass('fadeInSlow');
				$('#' + name).addClass('fadeOutSlow');

				$('#' + name).on('transitionend', function(){
					$('#' + name).css('visibility', 'hidden');
					$('#' + name).off('transitionend');
				});
			}
		}
	}


	//-------------------------------------
	// Teacher Animation
	function blowUpAllBtn( callback)
	{
		for(i = 0; i < cMAX_TEACHER_NUM_IN_PAGE; i++)
		{
			if($('#teacher_' + i).hasClass('blowDown'))
			{
				$('#teacher_' + i).removeClass('blowDown');
			}
			$('#teacher_' + i).addClass('blowUp');

			// $('#teacherBtn_' + i).addClass('shake');
			// $('#teacherBtn_' + i).addClass('shake-constant');
			// $('#teacherBtn_' + i).addClass('shake-slow');
		}

		if(callback != undefined)
		{
			$('#teacher_0').on('transitionend', callback);
		}

		setSwipeEvent(true);
	}

	//-------------------------------------
	function blowDownAllBtn( callback )
	{
		for(i = 0; i < cMAX_TEACHER_NUM_IN_PAGE; i++)
		{
			if($('#teacher_' + i).hasClass('blowUp'))
			{
				$('#teacher_' + i).removeClass('blowUp');

			}
			$('#teacher_' + i).addClass('blowDown');

			// $('#teacherBtn_' + i).removeClass('shake');
			// $('#teacherBtn_' + i).removeClass('shake-constant');
			// $('#teacherBtn_' + i).removeClass('shake-slow');
		}

		if(callback != undefined)
		{
			$('#teacher_0').on('transitionend', callback);
		}
		setSwipeEvent(false);
	}

	//-------------------------------------
	function blowEachBtn( id, max )
	{
		if(id < max)
		{
			$('#teacher_' + id).addClass('blowUp');	
			$('#teacherBtn_' + id).addClass('shake');
			$('#teacherBtn_' + id).addClass('shake-constant');
			$('#teacherBtn_' + id).addClass('shake-slow');
			setTimeout( 
				function(){
					blowEachBtn(id+1, max);
				},
				100
			);
		}
	}

	//-------------------------------------
	//Touch Event
	function setSwipeEvent( value )
	{
		if(value)
		{
			$('body').on('swipeup', onPreviousPage);
			$('body').on('swipedown', onNextPage);
		}
		else
		{
			$('body').off('swipeup');
			$('body').off('swipedown');
		}
	}

	//-------------------------------------
	//Info area
	function setArea( area)
	{
		$('#infoArea').empty();
		switch(area)
		{
			case "north":
			{
				$('#infoArea').append("北區基地學校");
				break;
			}
			case "central":
			{
				$('#infoArea').append("中區基地學校");
				break;
			}
			case "south":
			{
				$('#infoArea').append("南區基地學校");
				break;
			}
			case "east":
			{
				$('#infoArea').append("東區基地學校");
				break;
			}
		}
	}

	//-------------------------------------
	function setTeacherInfo( id )
	{
		$('#infoArea').empty();
		$('#infoArea').append(_TeacherBtnData[id]['school'] + '<br><b>' + _TeacherBtnData[id]['name'] + '</b> 老師');
	}

	//-------------------------------------
	function setTeacherPhoto()
	{
		if($('#photo').is(":hidden"))
		{
			$('#photo').show();
		}
		var photoPath_ = "assets/teachers/" + _selectArea + "/" + _TeacherBtnData[_selectTeacherId]['id'] + "/photo.jpg";
		$('#photo').attr('src', photoPath_);
	}

	//-------------------------------------
	function onPhotoError()
	{
		$('#photo').hide();
	}

	//-------------------------------------
	//resize
	function resize()
	{
		var $winHeight_ = $(window).height()
			,$winWidth_ = $(window).width();

		//title
		$('#title').css('left', (0.03 * $winWidth_).toString() + 'px').css('top', (0.048 * $winHeight_).toString() + 'px');
		$('#infoArea').css('left', (0.034 * $winWidth_).toString() + 'px').css('top', (0.154 * $winHeight_).toString() + 'px');
		$('#photoArea').css('left', (0.02969 * $winWidth_).toString() + 'px').css('top', (0.21944 * $winHeight_).toString() + 'px');
		$('#BtnHome').css('left', (0.032 * $winWidth_).toString() + 'px').css('top', (0.3935 * $winHeight_).toString() + 'px');
		$('#BtnBack').css('left', (0.0682 * $winWidth_).toString() + 'px').css('top', (0.3935 * $winHeight_).toString() + 'px');

		//Area Btn
		$('#BtnNorth').css('left', (0.19375 * $winWidth_).toString() + 'px').css('top', (0.39 * $winHeight_).toString() + 'px');
		$('#BtnCentral').css('left', (0.37571875 * $winWidth_).toString() + 'px').css('top', (0.39 * $winHeight_).toString() + 'px');
		$('#BtnSouth').css('left', (0.5573 * $winWidth_).toString() + 'px').css('top', (0.39 * $winHeight_).toString() + 'px');
		$('#BtnEast').css('left', (0.739 * $winWidth_).toString() + 'px').css('top', (0.39 * $winHeight_).toString() + 'px');

		//arrow btn
		$('#BtnUp').css('left', (0.926 * $winWidth_).toString() + 'px').css('top', (0.12 * $winHeight_).toString() + 'px');
		$('#BtnDown').css('left', (0.926 * $winWidth_).toString() + 'px').css('top', (0.7986 * $winHeight_).toString() + 'px');
		//$('#BtnLeft').css('left', (0.1468 * $winWidth_).toString() + 'px').css('top', (0.4593 * $winHeight_).toString() + 'px');
		//$('#BtnRight').css('left', (0.9346 * $winWidth_).toString() + 'px').css('top', (0.4593 * $winHeight_).toString() + 'px');

		//item btn
		$('#BtnIntro').css('left', (0.6094 * $winWidth_).toString() + 'px').css('top', (0.1435 * $winHeight_).toString() + 'px');
		$('#BtnDesign').css('left', (0.2344 * $winWidth_).toString() + 'px').css('top', (0.27 * $winHeight_).toString() + 'px');
		$('#BtnRecord').css('left', (0.689 * $winWidth_).toString() + 'px').css('top', (0.6176 * $winHeight_).toString() + 'px');
		$('#BtnFeedback').css('left', (0.3078 * $winWidth_).toString() + 'px').css('top', (0.7454 * $winHeight_).toString() + 'px');

		//popup frame
		$('#PopupFrame').css('left', (0.1 * $winWidth_).toString() + 'px').css('top', (0.1 * $winHeight_).toString() + 'px');
		$('#BtnClose').css('left', (0.84375 * $winWidth_).toString() + 'px').css('top', (0.14537 * $winHeight_).toString() + 'px');
	}

	//-------------------------------------
	//public
	return {
		init : init,
		resize : resize,
		onLoopVideoClick : onLoopVideoClick,
		onBtnHome : onBtnHome,
		onBtnBack : onBtnBack,
		onNextPage : onNextPage,
		onPreviousPage : onPreviousPage,
		onBtnItemSelect : onBtnItemSelect,
		onBtnClose : onBtnClose,
		onPhotoError : onPhotoError
	};
})();




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