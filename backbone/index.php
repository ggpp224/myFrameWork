<?php
header('Content-Type: text/plain');
$arr = array();
$list = array();

$len = rand(3,10);
for($i=0;$i<$len;$i++){
	array_push($arr,array("name"=>"name".$i,"age"=>rand(0,10000)));	
}


$obj = array("list"=>$arr);

if($_GET["action"]=="create"){
	$o = array("name"=>"gp","age"=>rand(0,10000),"address"=>"addr");
	echo json_encode($o);
}else if($_GET["action"]=="list"){
	$len=$_GET["limit"];
	if(!$len){
		$len = 10;
	}
	for($i=0;$i<$len;$i++){
		$aa=array("first"=>$i,"second"=>"ddd");
		array_push($list,array("name"=>"name".$i,"lastmod"=>rand(0,10000),"size"=>$aa));	
	}	
	$total = array("totalCount"=>340,"list"=>$list);
	echo json_encode($total);
}else if($_GET["action"]=="list2"){
	for($i=0;$i<$len;$i++){
		$aa=array("first"=>$i,"second"=>"ddd".rand(0,100));
		array_push($list,array("name"=>"name".$i,"age"=>rand(0,10000),"size"=>$aa));	
	}	
	echo json_encode($list);
}else if($_GET["action"]=="list3"){
	for($i=0;$i<$len;$i++){
		$aa=array("first"=>$i,"second"=>"ddd".rand(0,100));
		array_push($list,array("name"=>"name".$i,"address"=>$aa));	
	}	
	echo json_encode($list);
}else{
	echo json_encode($obj);
}

?>
