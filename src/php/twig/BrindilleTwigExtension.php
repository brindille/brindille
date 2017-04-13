<?php

use Pimple\Container;

class BrindilleTwigExtension extends Twig_Extension
{

  protected $app;

  public function __construct(Container $app) {
    $this->app = $app;
  }

  public function getFunctions()
  {
    return array(
      new Twig_SimpleFunction('brindillePage', function ($page) {
        if ($this->app['isMultilingual']) {
          return '/'.$this->app['lang'].'/'.$page;
        }
        return '/'.$page;
      })
    );
  }
}