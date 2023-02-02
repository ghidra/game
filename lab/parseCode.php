<?php
///------------------
$path    = getcwd()."/aed";
//$files = scandir($path);
$files = array_diff(scandir($path), array('.', '..'));

///------------------

///cache
$directory = new stdClass();//hold each objects in file object

$fileName = '';
$objectOpen = false;
$objectName = "";

///global objects for tracking inside blocks of code
$blockTriggerArray=array();
$blockCounter=0;
$blockIndex=-1;//the number to move in and around if I have to.

///flags to keep track of us inside blocks of code
$insideMultiLineComment=false;
$insideObject=false;
$insideClass=false;
$insideFunction=false;

function isDeclarativeLine($checkline){
    $splitAtEqual = explode( "=",$checkline );
    return (count($splitAtEqual)>1);
}
function processRemoveComment($checkline){
    $splitAtLineComment = explode("//",$checkline);
    $cleanLine = (!empty($splitAtLineComment[0]) )?$checkline:$splitAtLineComment[0];
    $splitAtComment = explode("//",$cleanLine);
    return (!empty(trim($splitAtComment[0])) )?$splitAtComment[0]:"";
}
function checkForBlock($checkline,$index,$bnested=true){
    //bnested means this is NOT looking for multiline comments
    $debug = false;
    $debugMultilineComments = false;

    //checkline is the incoming line to investigate
    //index is the incoming global blockindex. 
    //blocktrigger array, list of booleans...

    global $blockTriggerArray,$blockCounter,$blockIndex,$insideMultiLineComment;
    global $directory,$fileName,$objectOpen,$objectName;
    $cleanLine = $checkline;
    $isDeclarative = isDeclarativeLine($checkline);
    
    //look for the end
    //start by finding if we are at the end of a block yet
    //if the blocktriggerindex[incoming block index] is true, we are looking for the end of the block

    $blockEnd=($bnested)?"}":"*/";

    if($blockTriggerArray[$index]){//block still open, looking for ending
        //we are inside a code block
        if( (!$isDeclarative&&$bnested) || !$bnested ){ //not a declarive line if a code block, or we are looking for a multiline block end
            if(strpos($checkline,$blockEnd)!== false){//we ARE the end of the block
                //END FOUND
                //debug print
                if($debug && !$insideMultiLineComment){
                    echo str_repeat("&nbsp&nbsp&nbsp&nbsp",$blockIndex).$blockIndex .":". $cleanLine . "<br>";
                    //echo str_repeat("&nbsp&nbsp&nbsp&nbsp",$blockIndex).'-----------------------******** <br>';
                }

                if(!$bnested){//handle multiline comment end
                    $insideMultiLineComment=false;
                }

                $blockTriggerArray[$index]=false;//we are no longer looking for the end
                $blockIndex--;

                $splitLine=explode($blockEnd,$checkline);
                $cleanLine=(!empty($splitLine[1]))?$splitLine[1]:"";
            }

        }else{//this prints inside of bnested
            if($debug && !$insideMultiLineComment){
                echo str_repeat("&nbsp&nbsp&nbsp&nbsp",$blockIndex+1).$blockIndex ." : ". $cleanLine . "<br>";
            }
        }
    }

    //---------------------------------
    //look for a block start
    // a ROOT block start is a declarative statement..and on the root
    $startFound=false;
    $useBlockStart="";

    if( $blockIndex<0 && $isDeclarative && $bnested ){//looking FOR NEW BLOCKS
        if( strpos($checkline,"function")!== false ){//NEW BLOCK FOUND
            $useBlockStart = "function"; //this is the block starter
            $startFound = true;

            $splitAtEqual = explode( "=",$checkline );
            $splitAtParenthesis = explode( "(",$checkline );
            $argumentString = explode( ")",$splitAtParenthesis[1] );
            $arguments=explode(",",$argumentString[0]);

            //$objectOpen=true;
            $directory->{$fileName}->{$splitAtEqual[0]} = new stdClass();
            $directory->{$fileName}->{$splitAtEqual[0]}->arguments = $arguments;
        }
        
        //$objects[$objectCounter]=
        //$objectCounter++;

    }else{
        //THESE ARE BLOCKS INSIDE THE MAIN BLOCK
        $blocks = ($bnested)?array("function(","for(","if(","while(","function ","for ","if ","while "):array("/*");
        foreach($blocks as $blockStart){
            if( strpos($checkline,$blockStart)!== false ){
                $useBlockStart=$blockStart;//this is the block starter
                $startFound=true;
                break 1;
            }
        }
    }
    /// we are at the beginning of a block new or nested inside
    if($startFound){
        if(!$bnested){
            $insideMultiLineComment=true;
        }
        
        $blockCounter++;
        $blockIndex++;
        $blockTriggerArray[$blockIndex]=true;

        $splitLine=explode($useBlockStart,$checkline);
        $cleanLine=(!empty($splitLine[0]) )?$checkline:"";

        if($debug && !$insideMultiLineComment){
            //echo str_repeat("&nbsp&nbsp&nbsp&nbsp",max($blockIndex,0)).'********-----------------------<br>';
            echo str_repeat("&nbsp&nbsp&nbsp&nbsp",max($blockIndex,0)).$blockIndex.":".$cleanLine . "<br>";
        }
    }
    //---------------------------------

    return $cleanLine;
}

//--------------------------
//--------------------------
/*
$tmpFileIndex=3;
if (isset($_GET['i'])){
    $tmpFileIndex=$_GET['i']+2;
}
$currentfile = $path."/".$files[$tmpFileIndex];
*/

foreach($files as $f){
    //reset globals

    //echo $f.'<br><br>';
    $blockTriggerArray=array();
    $blockCounter=0;
    $blockIndex=-1;//the number to move in and around if I have to.

    ///flags to keep track of us inside blocks of code
    $insideMultiLineComment=false;
    $insideObject=false;
    $insideClass=false;
    $insideFunction=false;
    ///

    $currentfile = $path."/".$f;
    $fileName=$f;
    $directory->{$fileName} = new stdClass();

    $myfile = fopen( $currentfile, "r") or die("Unable to open file!");

    //we look at this file, one line at a time.
    //skip multiline comments by looking for the /**/ strings, and skip empty lines completely
    //we remove comments from the line, and remove entire comment lines
    while( ($line = fgets($myfile)) !== false){//loop each line in the file
        if( !ctype_space($line) && !ctype_space(checkForBlock($line,$blockIndex,false)) && !$insideMultiLineComment ){//skip empty string, and skip multiline comments
            $noCommentLine = processRemoveComment($line);
            if(!empty($noCommentLine) ){
                $cleanLine = checkForBlock($noCommentLine,$blockIndex);
            }
        }
    }
    //echo fread($myfile,filesize($currentfile));
    fclose($myfile);

}


///now print it all out
foreach($directory as $file_name => $object){
    echo $file_name."<br><br>";
    foreach($object as $key => $value){
        echo $key;
        if(strlen($object->{$key}->arguments[0])>0){
            $astr = " (";
            foreach($object->{$key}->arguments as $argument){
                $astr.= $argument.", ";
            }
            echo substr($astr,0,-2).")<br>";
        }else{
            echo "<br>";
        }
    }
    echo '<br>------------------------<br>';
}

/*
foreach($functions as $function){
    echo $function->name . "<br>";
}
*/

?> 