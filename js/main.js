//const
var cMAX_TEACHER_NUM_IN_PAGE = 3;

//var cTEACHER_PHOTO_POS = new Array()
var Main = (function()
{
	var _selectPhoto = -1;
	var _pageNum = 0;
	function init()
	{
		$('#BtnNorth').on('click', {type: "north"}, onAreaClick);
		$('#BtnCenter').on('click', {type: "center"}, onAreaClick);
		$('#BtnSouth').on('click', {type: "south"}, onAreaClick);
		$('#BtnEast').on('click', {type: "east"}, onAreaClick);

		setupTeacherPhoto();
	}

	//-------------------------------------
	//Teachers
	function onAreaClick( event )
	{
		clearTeacherPage();
		switch(event.data.type)
		{
			case "north":
			{
				$('#title').append("<h1>北</h1>");
				break;
			}
			case "center":
			{
				$('#title').append("<h1>中</h1>");
				break;
			}
			case "south":
			{
				$('#title').append("<h1>南</h1>");
				break;
			}
			case "east":
			{
				$('#title').append("<h1>東</h1>");
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
						$.each(json['data'], function(key, value){
							
							$('#teacherPhoto_' + key).attr("src", "assets/teachers/" + value['id'] + "/photo.png");
							$('#teacherBtn_' + key).attr("src", "assets/imgs/BtnTeacher.gif");
							$('#teacherBtn_' + key).addClass('fadeIn');

							$('#teacher_' + key).on(
								'click', {id: key}, 
								function(event){
									FlipTeacherPhoto(event.data.id);
									$('#teacher-info').empty();
									$('#teacher-info').append("<h2>" + value['info'] + "</h2>");
								}
							);
							$('#teacher_' + key).addClass('blowUp');

						});
					}
				);
			}
		);
	}

	//-------------------------------------
	function clearTeacherPage()
	{
		$('#title').empty();
	}

	//-------------------------------------	
	function setupTeacherPhoto()
	{
		$('#teachers-photo').empty();
		var UnitWidth_ = 200;
		var UnitHeight_ = 200;
		for(i = 0; i < cMAX_TEACHER_NUM_IN_PAGE; i++)
		{
			var PosX_ = i % 5 * UnitWidth_;
			var PosY_ = Math.floor(i / 5) * UnitHeight_;


			var NewDiv_ = document.createElement('div');
			NewDiv_.id = 'teacher_' + i;
			NewDiv_.className = 'Teacher';
			NewDiv_.style.left = PosX_ + 'px';
			NewDiv_.style.top = PosY_ + 'px';

			var photo_ = document.createElement('img');
			photo_.id = 'teacherPhoto_' + i;
			photo_.className = 'TeacherPhoto';
			
			var Btn_ = document.createElement('img');
			Btn_.id = 'teacherBtn_' + i;
			Btn_.className = 'TeacherPhoto';

			NewDiv_.appendChild(photo_);
			NewDiv_.appendChild(Btn_);

			$('#teachers-photo').append(NewDiv_);
		}
	}

	//-------------------------------------	
	function FlipTeacherPhoto( id )
	{
		

		if(id == _selectPhoto)
		{
			return;
		}

		if(_selectPhoto != -1)
		{
			//flip back
			$('#teacherPhoto_' + _selectPhoto).removeClass('fadeIn');
			$('#teacherPhoto_' + _selectPhoto).addClass('fadeOut');

			$('#teacherBtn_' + _selectPhoto).removeClass('fadeOut');
			$('#teacherBtn_' + _selectPhoto).addClass('fadeIn');
		}

		$('#teacherPhoto_' + id).removeClass('fadeOut');
		$('#teacherPhoto_' + id).addClass('fadeIn');
		
		$('#teacherBtn_' + id).removeClass('fadeIn');
		$('#teacherBtn_' + id).addClass('fadeOut');

		_selectPhoto = id;
	}

	//-------------------------------------
	//public
	return {
		init : init
	};
})();




//------------------------------
//Main
window.onload
{
	Main.init();
}