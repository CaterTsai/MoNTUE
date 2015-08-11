<?php
	//get value
	$type = isset($_GET["type"])?$_GET["type"]:NULL;
	$area = isset($_GET["area"])?$_GET["area"]:NULL;
	$teacherId = isset($_GET["id"])?$_GET["id"]:NULL;
?>

<!DOCTYPE html>
<html>
<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

	<link rel="stylesheet" type="text/css" href="slick/slick.css"/>
	<link rel="stylesheet" type="text/css" href="slick/slick-theme.css"/>

	<link rel="stylesheet" type="text/css" href="css/info.css" />
	<script type="text/javascript">
		var gSelectType = <?php echo "\"$type\";"?>;
		var gSelectArea = <?php echo "\"$area\";"?>;
		var gTeacherId = <?php echo "\"$teacherId\";"?>;
	</script>
</head>
<body bgcolor="#606060">
	
	<p id = "title" class = "titleText"></p>
	<input id = "BtnText" onclick = "Main.changeDisplay('text');" style = "position:absolute;" type = "image" src = "assets/imgs/btnText.png"/>
	<input id = "BtnImages" onclick = "Main.changeDisplay('images');" style = "position:absolute;" type = "image" src = "assets/imgs/btnImages.png"/>
	<input id = "BtnVideos" onclick = "Main.changeDisplay('videos');" style = "position:absolute;" type = "image" src = "assets/imgs/btnVideos.png"/>

	<!--Display Area-->
	<div id = "display" class = "displayDiv">
		<div id = "info_text" style = "overflow:auto;visibility: hidden;" class = "infoDiv fadeOut"></div>
		<div id = "info_images" style = "visibility: hidden;" class = "infoDiv fadeOut"></div>
		<div id = "info_videos" style = "visibility: hidden;" class = "infoDiv fadeOut"></div>
	</div>

	<input id = "BtnArrowLeft" style = "position:absolute;visibility: hidden;" class = "fadeOut" type = "image" src = "assets/imgs/arrowLeft_w.png"/>
	<input id = "BtnArrowRight" style = "position:absolute;visibility: hidden;" class = "fadeOut" type = "image" src = "assets/imgs/arrowRight_w.png"/>

	<script type = "text/javascript" src = "js/jquery-1.11.3.min.js"></script>
	<script type = "text/javascript" src = "slick/slick.min.js"/></script>
	<script type = "text/javascript" src = "js/info.js"/></script>
</body>
</html>