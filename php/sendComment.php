<?php



$name =     $_POST['comment_name'];
$email =    $_POST['comment_email'];
$phone =    $_POST['comment_phone'];
$text =     $_POST['comment_text'];
$from =     $_POST['comment_from'];
$to =       $_POST['comment_to'];
$room =     $_POST['comment_room'];
$RECIPIENT = "petr.elias@wecreateweb.cz";
$SUBJECT = "Nová zpráva od ".$name." na najitrach.cz";
$messageBody = "<h3>Automatická zpráva z najitrach.cz:</h3>";
$messageBody .= "<strong>Jméno a příjmení:</strong> ".$name."<br/>";
$messageBody .= "<strong>Email:</strong> <a href='mailto:".$email."' title='".$name."'>".$email."</a><br/>";
if($phone!="Telefon" && $phone!=""){
    $messageBody .= "<strong>Telefon:</strong> ".$phone."<br/>";
}
if($text!="Vzkaz" && $text!=""){
    $messageBody .= "<strong>Vzkaz:</strong><p>".$text."</p>";
}
if($from!="Rezervace od" && $from!="" && $to!="Rezervace do" && $to!=""){
    $messageBody .= "<strong>Rezervace:</strong><br/>".$room." od ".$from." do ".$to."";
}

if (sendEmail($RECIPIENT, $messageBody, $SUBJECT)){
    echo "SENT";
}

function sendEmail($to, $message, $subject) {
    global $email;
    $mime_boundary = "----MSA Shipping----" . md5(time());
    $body .= "--" . $mime_boundary . "\n";
    $body .= "Content-Type: text/html; charset=UTF-8\n";
    $body .= "Content-Transfer-Encoding: 8bit\n\n";
    $body .= "<html>\n";
    $body .= "<body style=\"font-family:Verdana, Verdana, Geneva, sans-serif; font-size:12px; color:#666666;\">\n";
    $body .= $message;
    $body .= "</body></html>";
    $headers .= "MIME-Version: 1.0\n";
    $headers .= "Content-Type: multipart/alternative; boundary=\"" . $mime_boundary . "\"\n";
    $headers .= "From: ".$email."\n";
    if (mail($to, $subject, $body, $headers) == true) {
        return true;
    }
    return false;
}

?>