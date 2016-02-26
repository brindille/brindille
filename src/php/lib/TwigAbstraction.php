<?php

/**
* Twig abstraction
*/
class TwigAbstraction
{
  private $twig;
  private $loader;
  private $settings;

  public function __construct()
  {
    $this->loader = new Twig_Loader_Filesystem(__DIR__ . '/' . Config::get('twig', 'viewsDir'));
    $this->defineSettings();
    $this->twig = new Twig_Environment($this->loader, $this->settings);
    $this->twig->clearCacheFiles();
  }

  public function registerExtensions($extensions)
  {
    foreach ($extensions as $extension) {
      $this->twig->addExtension($extension);
    }
  }

  public function registerFilters($filters)
  {
    foreach ($filters as $filter) {
      $this->twig->addFilter($filter);
    }
  }

  public function getTwigInstance() {
    return $this->twig;
  }

  private function defineSettings()
  {
    if (Config::get('app', 'cache') === true) {
      $this->settings = array(
        'cache' => Config::get('twig', 'cacheDir'),
      );
    } else {
      $this->settings = array();
    }
  }

  private function isDevMode()
  {
    return (Config::get('app', 'env') === 'dev' || Config::get('app', 'env') === 'preprod');
  }

}