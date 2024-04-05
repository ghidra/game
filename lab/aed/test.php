<?php
error_reporting(E_ALL);
ini_set('display_errors',1);
//echo("we are here");
if ( !file_exists("test") ) {
     mkdir ("test", 0744);
 }
$dir=getcwd();//basename(__DIR__);
echo($dir);
$myfile = fopen($dir."/doing.txt", "w")or die("Unable to open file!");
fwrite($myfile, "Something written");
fclose($myfile);
echo("did it work");
?>