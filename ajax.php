<?php
if ($_POST['array'])	
{ 
	//$json = utf8_encode($_POST['array']);
	//$obj = json_decode($json);
	//$obj = $_POST['array'];
	//var_dump(json_decode($json));
	//var_dump(json_decode($json, true));
	
 	 // include class file
/* 	include("XML/Serializer.php");

	// create object
	$serializer = new XML_Serializer();

	// create array to be serialized

	// add XML declaration
	$serializer->setOption("addDecl", true);

	// indent elements
	$serializer->setOption("indent", " ");

	// set name for root element
	$serializer->setOption("rootName", "library");

	// represent scalar values as attributes instead of element
	$serializer->setOption("scalarAsAttributes", true);
      
	// perform serialization
	$result = $serializer->serialize($obj);

	// check result code and display XML if success
	if($result === true) 
	{
	echo $serializer->getSerializedData();
	}   
	//$xml = $serializer->getSerializedData(); */

	$xml = new DOMDocument();
	$xml->loadXML($_POST['array']);
	
	print $xml->saveXML();
	$xml->save('test_chassis.xml');
//echo 'Thank you '. $serializer->getSerializedData() . ', says the PHP file';
} 


?>
