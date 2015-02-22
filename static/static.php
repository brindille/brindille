<?php
require_once 'php/OnePage-SEO/Client.php';

$client = new Client();
// $client->setPhantomJs(__DIR__ . '/php/OnePage-SEO/phantom/bin/linux/phantomjs');
$client->setPhantomJs(__DIR__ . '/php/OnePage-SEO/phantom/bin/mac/phantomjs');
$client->setScript(__DIR__ . '/php/OnePage-SEO/phantom/script.js');
$url = $_GET['url'];
$client->setUrl($url);

$html = $client->send();

// Set correct URL
$re = "/<meta property=\"og:url\" content=\"[a-zA-Z:\\/\\/#!-_]*\">/";
$html = preg_replace($re, '<meta property="og:url" content="'.$url.'">', $html);

echo $html;