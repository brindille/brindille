<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Gaufrette\Exception\FileNotFound;

use Silex\Application;

// Get the routes for our app
$app['available_routes'] = $app['yaml_service']->parse('routes.yaml');
$app['default_route'] = array_values($app['available_routes'])[0];
$app['available_langs'] = $app['yaml_service']->parse('languages.yaml');
$app['default_lang'] = array_values($app['available_langs'])[0];
$app['isMultilingual'] = count($app['available_langs']) > 1 ? true : false;


function getLanguageFromRequest (Request $request, Application $app) {
  if ($app['isMultilingual']) {
    $langRequested = $request->attributes->get('lang');
    return in_array($langRequested, $app['available_langs']) ? $langRequested : $app['default_lang'];
  }
  return $app['default_lang'];
}

function getPageFromRequest (Request $request) {
  return str_replace('_ajax', '', $request->attributes->get('_route'));
}

/**
 * Populate twig data depending on route
 */
$dataMiddleware = function (Request $request, Application $app) {
  $app['lang'] = getLanguageFromRequest($request, $app);
  $app['page'] = getPageFromRequest($request);

  $app['twig_datas'] = array(
    'page' => $app['page'],
    'lang' => $app['lang'],
    'isMultilingual' => $app['isMultilingual'],
    'ua' => $_SERVER['HTTP_USER_AGENT'],
    'assetVersion' => $app['assetVersion'],
    'isMobile' => $app['device_service']->isMobile(),
    'isiOS' => $app['device_service']->isiOS(),
    'isAndroid' => $app['device_service']->isAndroidOS(),
    'isTablet' => $app['device_service']->isTablet(),
    'isIE' => $app['device_service']->getIsIE(),
    'isEdge' => $app['device_service']->getIsEdge(),
    'ieVersion' => $app['device_service']->getIEVersion(),
    'isFirefox' => $app['device_service']->getIsFirefox(),
    'isTouchDevice' => $app['device_service']->isTablet() || $app['device_service']->isMobile(),
    'baseUrl' => $request->getBaseUrl(),
    'rootUrl' => 'http://'.$_SERVER['HTTP_HOST'] . '/',
    'currentUrl' => 'http://'.$_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],
    'Global' => $app['yaml_service']->parse('global.yaml'),
    'Main' => $app['yaml_service']->parse($app['lang'].'/main.yaml'),
    ucfirst($app['page']) => $app['yaml_service']->parse($app['lang'].'/pages/'.$app['page'].'.yaml')
  );
};

function createResponse ($content) {
  return new Response($content, 200, array(
    'Cache-Control' => 'public, s-max-age=300, max-age=300, must-revalidate',
    'Vary' => 'User-Agent'
  ));
}

function createJsonResponse ($content) {
  return new JsonResponse($content, 200, array(
    'Cache-Control' => 'public, s-max-age=300, max-age=300, must-revalidate',
    'Vary' => 'User-Agent'
  ));
}

/**
 * Render Content of page, excluding layout
 */
$renderInner = function(Request $request, Application $app) {
  // Add this as security just in case the XHR call is not made from our app
  $params = $request->query->all();
  if (!isset($params['t'])) {
    return $renderFull($request, $app);
  }

  $page = $app['twig_datas']['page'];
  $html = $app['twig']->render('sections/'.$page.'/'.$page.'.html', $app['twig_datas']);

  return createJsonResponse(array('html' => $html));
  // return $app->json(array('html' => $html), 200, array(
  //   'Cache-Control' => 'public, s-max-age=300, max-age=300, must-revalidate',
  //   'Vary' => 'User-Agent'
  // ));
};

/**
 * Render Full Page
 */
$renderFull = function(Request $request, Application $app) {
  return createResponse($app['twig']->render('index.html', $app['twig_datas']));
};

// For each route we create two controller functions
foreach ($app['available_routes'] as $id => $url) {
  $path = $app['isMultilingual'] ? '{lang}/'.$url : $url;

  // When route requested by Ajax we only serve the inner content of the page
  $app->get($path, $renderInner)
    ->bind($id.'_ajax')
    ->when('request.isXmlHttpRequest()')
    ->before($dataMiddleware);

  // Else we render the page inside the global layout
  $app->get($path, $renderFull)
    ->bind($id)
    ->before($dataMiddleware);
}

// In case we don't manage '/' route in routes.yaml, to be sure that '/' will go to default route
if ($app['default_route'] !== '') {
  $app->get('/', function () use ($app) {
    $path = $app['isMultilingual'] ? $app['default_lang'].'/'.$app['default_route'] : $app['default_route'];
    return $app->redirect($path);
  });
}

$app->error(function (\Exception $e, Request $request, $code) use ($app) {
  $base = $request->getBaseUrl();
  $path = '/'.$app['default_route'];
  if ($app['isMultilingual']) {
    $path = $base.'/'.$app['default_lang'].$path;
  } else {
    $path = $base.$path;
  }
  if (404 === $code) {
    return $app->redirect($path);
  }
  if ($e instanceof NotFoundHttpException) {
    return $app->redirect($path);
  }
  if ($e instanceof FileNotFound) {
    return $app->redirect($path);
  }
});
