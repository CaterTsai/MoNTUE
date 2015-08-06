//const
var cMAX_TEACHER_NUM_IN_PAGE = 15;

var cTEACHER_BTN_CENTER = 7;
var cTEACHER_BTN_POS = new Array(	[372, 118], [670, 118], [967, 118], [1264, 118], [1562, 118],
									[372, 432], [670, 432], [967, 432], [1264, 432], [1562, 432],
									[372, 735], [670, 735], [967, 735], [1264, 735], [1562, 735]
	);


var Main = (function()
{
	var _selectId = -1
		,_selectTeacherId = -1
		,_selectArea = ""
		,_pageNum = 0
		,_totalPage = 0		
		,_TeacherBtnData = [];

	function init()
	{
		$('#BtnNorth').on('click', {area: "north"}, onAreaClick);
		$('#BtnCentral').on('click', {area: "central"}, onAreaClick);
		$('#BtnSouth').on('click', {area: "south"}, onAreaClick);
		$('#BtnEast').on('click', {area: "east"}, onAreaClick);

		setupTeacherPhoto();
	}

	//-------------------------------------
	//Teacher Button
	
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
						blowUpAllBtn();
						setCtrlVisable(true);


						// setTimeout( 
						// 	function(){
						// 		blowEachBtn(0, json['data'].length);
						// 	},
						// 	100
						// );
					}
				);
			}
		);
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
				$('#teacherBtn_' + i).attr("src", "assets/imgs/ball-1.png");
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
	function onBtnUp()
	{
		$('#infoArea').empty();
		PageTransitions.nextPage({animation:12, showPage:0});
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
	}

	//-------------------------------------
	function onTeacherSelect( event )
	{
		_selectId = event.data.PosId;
		_selectTeacherId = event.data.TeacherDataId;

		$('#selectTeacher').css('left', cTEACHER_BTN_POS[_selectId][0] + 'px').css('top', cTEACHER_BTN_POS[_selectId][1] + 'px');
		$('#selectImg').attr("src", $('#teacherBtn_' + _selectId).attr("src"));
		$('#teacher_' + _selectId).hide();
		blowDownAllBtn();
		setCtrlVisable(false);

		var transformX_ = cTEACHER_BTN_POS[cTEACHER_BTN_CENTER][0] - cTEACHER_BTN_POS[_selectId][0];
		var transformY_ = cTEACHER_BTN_POS[cTEACHER_BTN_CENTER][1] - cTEACHER_BTN_POS[_selectId][1];

		$('#selectTeacher').css('transform', 'translate(' + transformX_ +'px,' + transformY_ + 'px) scale(3.1)');
		$('#selectTeacher').on(
			'transitionend'
			,function()
			{
				$('#selectTeacher').off('transitionend');
				setItemBtnVisable(true);
				setTeacherInfo(_selectTeacherId);
			}
		);
	}

	//-------------------------------------
	function setCtrlVisable( value)
	{
		if(value)
		{
			//Display ctrl
			if($('#CtrlBtnDiv').hasClass('fadeOut'))
			{
				$('#CtrlBtnDiv').removeClass('fadeOut');
				$('#CtrlBtnDiv').addClass('fadeIn');
			}
		}
		else
		{
			//Display ctrl
			if($('#CtrlBtnDiv').hasClass('fadeIn'))
			{
				$('#CtrlBtnDiv').removeClass('fadeIn');
				$('#CtrlBtnDiv').addClass('fadeOut');
			}
		}
	}

	//-------------------------------------
	function setItemBtnVisable( value)
	{
		if(value)
		{
			//Display ctrl
			if($('#itemBtnDiv').hasClass('fadeOut'))
			{
				$('#itemBtnDiv').removeClass('fadeOut');
				$('#itemBtnDiv').addClass('fadeIn');
			}
		}
		else
		{
			//Display ctrl
			if($('#itemBtnDiv').hasClass('fadeIn'))
			{
				$('#itemBtnDiv').removeClass('fadeIn');
				$('#itemBtnDiv').addClass('fadeOut');
			}
		}
	}	

	//-------------------------------------
	function blowUpAllBtn( callback)
	{
		for(i = 0; i < cMAX_TEACHER_NUM_IN_PAGE; i++)
		{
			if($('#teacher_' + i).hasClass('blowDown'))
			{
				$('#teacher_' + i).removeClass('blowDown');
			}
			$('#teacher_' + i).addClass('blowUp');
		}

		if(callback != undefined)
		{
			$('#teacher_0').on('transitionend', callback);
		}
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
		}

		if(callback != undefined)
		{
			$('#teacher_0').on('transitionend', callback);
		}
		
	}

	//-------------------------------------
	// function blowEachBtn( id, max )
	// {
	// 	if(id < max)
	// 	{
	// 		$('#teacher_' + id).addClass('blowUp');	
	// 		$('#teacherBtn_' + id).addClass('shake-constant');
	// 		setTimeout( 
	// 			function(){
	// 				blowEachBtn(id+1, max);
	// 			},
	// 			100
	// 		);
	// 	}
	// }

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
	//resize
	function resize()
	{
		var $winHeight_ = $(window).height()
			,$winWidth_ = $(window).width();

		//title
		$('#title').css('left', (0.03 * $winWidth_).toString() + 'px').css('top', (0.048 * $winHeight_).toString() + 'px');

		$('#infoArea').css('left', (0.034 * $winWidth_).toString() + 'px').css('top', (0.154 * $winHeight_).toString() + 'px');

		//Area Btn
		$('#BtnNorth').css('left', (0.19375 * $winWidth_).toString() + 'px').css('top', (0.39 * $winHeight_).toString() + 'px');
		$('#BtnCentral').css('left', (0.37571875 * $winWidth_).toString() + 'px').css('top', (0.39 * $winHeight_).toString() + 'px');
		$('#BtnSouth').css('left', (0.5573 * $winWidth_).toString() + 'px').css('top', (0.39 * $winHeight_).toString() + 'px');
		$('#BtnEast').css('left', (0.739 * $winWidth_).toString() + 'px').css('top', (0.39 * $winHeight_).toString() + 'px');

		//arrow btn
		$('#BtnUp').css('left', (0.4849 * $winWidth_).toString() + 'px').css('top', (0.0462 * $winHeight_).toString() + 'px');
		$('#BtnLeft').css('left', (0.1468 * $winWidth_).toString() + 'px').css('top', (0.4593 * $winHeight_).toString() + 'px');
		$('#BtnRight').css('left', (0.9346 * $winWidth_).toString() + 'px').css('top', (0.4593 * $winHeight_).toString() + 'px');

		//item btn
		$('#BtnIntro').css('left', (0.6094 * $winWidth_).toString() + 'px').css('top', (0.1435 * $winHeight_).toString() + 'px');
		$('#BtnDesign').css('left', (0.2344 * $winWidth_).toString() + 'px').css('top', (0.27 * $winHeight_).toString() + 'px');
		$('#BtnRecord').css('left', (0.689 * $winWidth_).toString() + 'px').css('top', (0.6176 * $winHeight_).toString() + 'px');
		$('#BtnFeedback').css('left', (0.3078 * $winWidth_).toString() + 'px').css('top', (0.7454 * $winHeight_).toString() + 'px');

		//popup frame
		$('#PopupFrame').css('left', (0.1 * $winWidth_).toString() + 'px').css('top', (0.1 * $winHeight_).toString() + 'px');
		$('#BtnClose').css('left', (0.88698 * $winWidth_).toString() + 'px').css('top', (0.0269 * $winHeight_).toString() + 'px');
	}

	//-------------------------------------
	//public
	return {
		init : init,
		resize : resize,
		onBtnUp : onBtnUp,
		onNextPage : onNextPage,
		onPreviousPage : onPreviousPage,
		onBtnItemSelect : onBtnItemSelect,
		onBtnClose : onBtnClose
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