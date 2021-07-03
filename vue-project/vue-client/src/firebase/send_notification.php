<?php
 function send_notification(){
     $url = "https://fcm.googleapis.com/fcm/send"

     $fields = array(
         "to"=>$_REQUEST['token'],
         "notification"=> array(
            "body"=> $_REQUEST['message'],
            "title"=> $_REQUEST['title'],
            "icon"=> $_REQUEST['icon'],
            "click_action"=> "https://google.com"
         ) 
    );
    $headers = array(
        'Authorization: key=AAAARM00d9E:APA91bEcfQN2ExtZW8jWicDTK2ajYJinj88Fx6BFCNvVu9zpiVYEftgNNiyepDdK3WDFgFBlIn37c6PEjhaMFBmgd2NjtwmrxvQTwfT14zUBnLvc2wqLRa8r1dp4WsvLHovNw50qyWcZ',
        'Content-Type:application/json',

    )
    $ch = curl_init();
    curl_setopt($ch,CURLOPT_URL,$url);
    curl_setopt($ch,CURLOPT_POST, true);
    curl_setopt($ch,CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch,CURLOPT_POSTFIELDS, json_encode($fields));
    $result = curl_exec($ch);
    print($result);
    curl_close($ch);
 }
 send_notification();