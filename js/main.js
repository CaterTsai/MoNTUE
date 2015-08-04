//const
var cMAX_TEACHER_NUM_IN_PAGE = 15;

var cTEACHER_BTN_POS = new Array(	[372, 118], [670, 118], [967, 118], [1264, 118], [1562, 118],
									[372, 432], [670, 432], [967, 432], [1264, 432], [1562, 432],
									[372, 735], [670, 735], [967, 735], [1264, 735], [1562, 735]
	);


var Main = (function()
{
	var _selectPhoto = -1
		,_pageNum = 0
		,_totalPage = 0
		,_TeacherBtnData = [];

	function init()
	{
		$('#BtnNorth').on('click', {type: "north"}, onAreaClick);
		$('#BtnCentral').on('click', {type: "central"}, onAreaClick);
		$('#BtnSouth').on('click', {type: "south"}, onAreaClick);
		$('#BtnEast').on('click', {type: "east"}, onAreaClick);

		setupTeacherPhoto();
	}

	//-------------------------------------
	//Teacher Button
	
	function onAreaClick( event )
	{
		clearTeacherPage();
		switch(event.data.type)
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

		PageTransitions.nextPage(
			{animation:11, showPage:1},
			function()
			{
				$.getJSON(
					"assets/" + event.data.type + ".json",
					function( json )
					{
						_TeacherBtnData = json['data'];
						_pageNum = 1;
						_totalPage = Math.ceil(_TeacherBtnData.length / cMAX_TEACHER_NUM_IN_PAGE);
						setTeacherBtnData(_pageNum);
						// $.each(json['data'], function(key, value){
							
						// 	$('#teacherBtn_' + key).attr("src", "assets/imgs/ball-1.png");
						// 	$('#teacherText_' + key).append(value['school'] + '<br><b>' + value['name'] + '</b> 老師');

						// 	$('#teacher_' + key).on(
						// 		'click', {id: key}, 
						// 		function(event){
						// 			//FlipTeacherPhoto(event.data.id);
						// 		}
						// 	);
						// 	$('#teacher_' + key).addClass('blowUp');

						// });

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
		$('#areaName').empty();
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
			$('#teacherText_' + i).empty();

			if(StartId_ < EndId_)
			{
				$('#teacherBtn_' + i).attr("src", "assets/imgs/ball-1.png");
				$('#teacherText_' + i).append(_TeacherBtnData[StartId_]['school'] + '<br><b>' + _TeacherBtnData[StartId_]['name'] + '</b> 老師');	
			}
			

			//$('#teacher_' + BtnId_).addClass('blowUp');
		}
		blowUpAllBtn();
	}

	//-------------------------------------	
	function onNextPage()
	{
		_pageNum = (_pageNum + 1 > _totalPage)?1:_pageNum + 1;
		
		blowDownAllBtn(function(){
			setTeacherBtnData(_pageNum);
			blowUpAllBtn(undefined);
		});
	}

	//-------------------------------------		
	function onPreviousPage()
	{
		_pageNum = (_pageNum - 1 < 1)?_totalPage:_pageNum - 1;
		
		blowDownAllBtn(function(){
			setTeacherBtnData(_pageNum);
			blowUpAllBtn(undefined);
		});
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
		$('#BtnLeft').css('left', (0.1468 * $winWidth_).toString() + 'px').css('top', (0.4593 * $winHeight_).toString() + 'px');
		$('#BtnRight').css('left', (0.9346 * $winWidth_).toString() + 'px').css('top', (0.4593 * $winHeight_).toString() + 'px');

	}

	//-------------------------------------
	//public
	return {
		init : init,
		resize : resize,
		onNextPage : onNextPage,
		onPreviousPage : onPreviousPage
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