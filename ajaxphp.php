<?php


if ($_POST['firstname']) 
{ 
	$xml = new DOMDocument();
	$xml->load("LEGO_CAR.xml");
	//Get item Element
	$element = $xml->getElementsByTagName('CHASIS')->item(0);
	//Load child elements
	$PART = $element->getElementsByTagName('PART')->item(0);
	//Replace old elements with new
	$element->replaceChild($PART, $PART);
	$PART->nodeValue = $_POST['firstname'];
	print $xml->saveXML();
	$xml->save('test_chassis.xml');
}  
echo 'Thank you '. $_POST['firstname'] . ', says the PHP file';
?>