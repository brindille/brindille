<?php
// Social media bots
$bots = array(
    'facebookexternalhit/1.1 (+https://www.facebook.com/externalhit_uatext.php)',
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Pinterest/0.1 +http://pinterest.com/',
    'Google (+https://developers.google.com/+/web/snippet/)',
    'Google-StructuredDataTestingTool; +http://www.google.com/webmasters/tools/richsnippets'
  );
// If its a crawler or a social media bot
if(isset($_GET['_escaped_fragment_']) ||
    in_array($_SERVER['HTTP_USER_AGENT'], $bots) ||
    strpos($_SERVER['HTTP_USER_AGENT'], 'Twitterbot')) {

    if(isset($_GET['_escaped_fragment_'])) {
        // The case of the crawler
        $fragment = $_GET['_escaped_fragment_'];
        $startFragment = substr($fragment, 0, 1);
        if($startFragment != '/') {
            $fragment = '/'.$fragment;
        }
    } else {
        // Social media bot
        $fragment = $_SERVER["REQUEST_URI"];
    }

    $http = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https://' : 'http://';
    $url = $http.$_SERVER['HTTP_HOST'].$fragment;

    // Redirect to static content
    Header( "HTTP/1.1 301 Moved Permanently" );
    header('Location: '.$http.$_SERVER['HTTP_HOST'].'/static.php?url='.$url);
    die();
}
?>