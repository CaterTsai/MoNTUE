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
	<link rel="stylesheet" type="text/css" href="css/info.css" />
	<script type="text/javascript">
		var gSelectType = <?php echo "\"$type\";"?>;
		var gSelectArea = <?php echo "\"$area\";"?>;
		var gTeacherId = <?php echo "\"$teacherId\";"?>;
	</script>
</head>
<body bgcolor="#606060">
	
	<input id = "BtnText" style = "position:absolute;" type = "image" src = "assets/imgs/btnText.png"/>
	<input id = "BtnImages" style = "position:absolute;" type = "image" src = "assets/imgs/btnImages.png"/>
	<input id = "BtnVideos" style = "position:absolute;" type = "image" src = "assets/imgs/btnVideos.png"/>

	<!--Display Area-->
	<div id = "display" class = "displayDiv">
		<div id = "display_text"></div>
		<div id = "display_images"></div>
		<div id = "display_vidoes"></div>
	</div>

	<script type = "text/javascript" src = "js/jquery-1.11.3.min.js"/>
	<script type = "text/javascript" src = "js/info.js"/>
</body>
</html>