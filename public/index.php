<?php
  require_once '../vendor/autoload.php';
  require_once '../src/php/bundle.php';

  /* --------------------------------------------------------
  Twig setup
  --------------------------------------------------------*/
  $twigAbstraction = new TwigAbstraction();

  /* --------------------------------------------------------
  Routing
  --------------------------------------------------------*/
  $router = new Router($twigAbstraction->getTwigInstance());

  echo $router->render();
