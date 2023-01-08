<?php
///------------------
$path    = getcwd()."/aed";
$files = scandir($path);
$files = array_diff(scandir($path), array('.', '..'));

//print_r($files);
$tmpFileIndex=3;
$currentfile = $path."/".$files[$tmpFileIndex];
echo $files[$tmpFileIndex]."<br>";

//"php://filter/resource=" .
$myfile = fopen( $currentfile, "r") or die("Unable to open file!");
///------------------

///cache
$functions = array();
$variables = array();
$objects = new stdClass();

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
    global $blockTriggerArray,$blockCounter,$blockIndex,$insideMultiLineComment;
    $cleanLine = $checkline;
    
    ///look for the end
    $blockEnd=($bnested)?"}":"*/";
    if($blockTriggerArray[$index]){
        if( (!isDeclarativeLine($checkline)&&$bnested) || !$bnested ){
            if(strpos($checkline,$blockEnd)!== false){
                if(!$bnested){
                    $insideMultiLineComment=false;
                }
                //echo $blockCounter ." : ".$blockIndex."     ". $line . "<br>";
                //echo '-----------------------******** <br>';
                $blockTriggerArray[$index]=false;
                $blockIndex--;

                $splitLine=explode($blockEnd,$checkline);
                $cleanLine=(!empty($splitLine[1]))?$splitLine[1]:"";
            }else{
                if($insideMultiLineComment){//this prints inside of multi line comments
                //    echo $blockCounter ." : ".$blockIndex."     ". $line . "<br>";
                }
            }

        }else{//this prints inside of bnested
        //    echo $blockCounter ." : ".$blockIndex."     ". $line . "<br>";
        }
    }

    //look for a block start
    $blocks = ($bnested)?array("for(","if(","while("):array("/*");
    foreach($blocks as $blockStart){
        //$splitAtMultiLineStart = explode($blockStart,$line);
        if( strpos($checkline,$blockStart)!== false ){
            if(!$bnested){
                $insideMultiLineComment=true;
            }
            //echo '********-----------------------<br>';
            //echo $line . "<br><br>";
            $blockCounter++;
            $blockIndex++;
            $blockTriggerArray[$blockIndex]=true;

            $splitLine=explode($blockStart,$checkline);
            $cleanLine=(!empty($splitLine[0]) )?$checkline:"";
        }
    }
    return $cleanLine;
}

//--------------------------
while( ($line = fgets($myfile)) !== false){//loop each line in the file
    if( !ctype_space($line) && !ctype_space(checkForBlock($line,$blockIndex,false)) && !$insideMultiLineComment ){//skip empty string, and skip multiline comments

        $noCommentLine = processRemoveComment($line);
        if(!empty($noCommentLine) ){

            $singleElement = checkForBlock($noCommentLine,$blockIndex);

            if( $blockIndex<0 && isDeclarativeLine($noCommentLine) ){//this is a line with assigments (ie x=0)
                
                $splitAtEqual = explode( "=",$noCommentLine );
                $splitAtDots = explode(".",$splitAtEqual[0]);//split out the dots
                $parents = count($splitAtDots)-1;//get number of parents
            
        
                if($parents>0 && !property_exists($objects,$parents[0])){//add to object if it doesnt exist
                    $parentRoot = $splitAtDots[0];
                    //echo $parentRoot . '<br>';
                    $objects->{$parentRoot}=new stdClass();
                    $objects->{$parentRoot}->functions=array();
                    $objects->{$parentRoot}->variables=array();
                    $objects->{$parentRoot}->objects=new stdClass();
                }
                
                //echo $splitAtEqual[1] . "---".strpos($splitAtEqual[1],"function")."<br>";
                ///////////////////
                //FIND FUNCTIONS
                if(strpos($splitAtEqual[1],"function")!== false){
                    //echo $splitAtEqual[0]."<br>";
                    //echo $splitAtComment[0]."<br>";
                    
                    $function = new stdClass();//make a new objectto hold class data
                    $function->name = $splitAtDots[count($splitAtDots)-1];

                    $startInsideParenthesis = explode("(",$splitAtEqual[1]);
                    $insideParenthesis = explode(")",$startInsideParenthesis[1]);
                    
                    $function->arguments = array();
                    $function->arguments = explode(",",$insideParenthesis[0]);
                    //echo $splitAtEqual[0]. " --- " . $insideParenthesis[0]."<br>";
                    
                    array_push($functions,$function);
                }
                ///////////////////
            }
            
        }
        
    }
}
//echo fread($myfile,filesize($currentfile));
fclose($myfile);

///now print it all out
echo '<br><br><br><br>------------------------<br><br><br>';
foreach($objects as $key => $value){
    echo $key . "<br>";
}
echo '<br>------------------------<br>';
foreach($functions as $function){
    echo $function->name . "<br>";
}

?> 