<?php
/*
Схема таблицы в ClickHouse
CREATE TABLE IF NOT EXISTS `default`.log_query (
        event_date Date,
        query String,
        time_query DateTime,
        response String
    ) ENGINE = MergeTree(event_date, (event_date, query), 8192);
*/

require __DIR__ . '/vendor/autoload.php';

require('php/SuggestClient.php');
use Dadata\SuggestClient as SuggestClient;

class Tips {
    function getTips($query, $maxhelp)
    {

        $config = [
            'host' => 'localhost', 
            'port' => '8123', 
            'username' => 'default', 
            'password' => ''
        ];
        $db = new ClickHouseDB\Client($config);
        $db->database('default');
        $db->setTimeout(1000);       
        $db->setConnectTimeOut(5); 


        $token = '';
        $dadata = new SuggestClient($token);
        $data = array(
            'query' => $query,
            'count' => $maxhelp
        );
        $resp = $dadata->suggest("address", $data);
        $sug = array();
        foreach ($resp->suggestions as $suggestion) {
            $sug[] = $suggestion->value;
        }
        $db->insert('log_query', array( array(date('Y-m-d'), $query, time(),  json_encode($sug)) ));
        return $sug;
    }
}

if (isset($_GET['query']) && $_GET['query'] != '') {
    $query = strip_tags($_GET['query']);
    if ($query == '') {
        die ( json_encode(array()));        
    }
    $maxhelp = 6;
    if (is_numeric($maxhelp) && $maxhelp > 0 && $maxhelp < 20) {
        $maxhelp = $_GET['maxhelp'];
    }

    $tips = new Tips();
    die ( json_encode($tips->getTips($query, $maxhelp)) );
} 
die ( json_encode(array()));


