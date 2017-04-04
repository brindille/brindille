<?php

use Silex\Application;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;
use Silex\Provider\AssetServiceProvider;

require __DIR__.'/twig/BrindilleTwigExtension.php';

$app = new Application();

$app['assetVersion'] = 1;

$app->register(new ServiceControllerServiceProvider());
$app->register(new AssetServiceProvider(), array(
  'assets.version' => $app['assetVersion'],
  'assets.version_format' => '%s?v=%s'
));
$app->register(new TwigServiceProvider(), array(
  'twig.path' => __DIR__.'/../views'
));

$app->extend('twig', function($twig, $app) {
  $twig->addExtension(new BrindilleTwigExtension($app));
  return $twig;
});

return $app;
