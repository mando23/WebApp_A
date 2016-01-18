$arrayBlock[arrayBlockCounter] // Object, which You have passed using AJAX

ob_start();
print_r("<pre>".print_r($aarrayBlock[arrayBlockCounter], true)."</pre>");
$var = ob_get_contents();
ob_end_clean();
$fp = fopen('somefile.htm', 'w');
fputs($fp, $var);
fclose($fp);