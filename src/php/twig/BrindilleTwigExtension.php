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
      new Twig_SimpleFunction('brindillePage', function () {
        $args = func_get_args();
        $path = $this->app['available_routes'][array_shift($args)];
        
        if (isset($path)) {
          // Replace dynamic params with function parameters (in order)
          $argCount = preg_match_all('/{[a-z]+}/', $path);
          for ($i = 0; $i < $argCount; $i++) {
            $path = preg_replace('/{[a-z]+}/', $args[$i], $path);
          }

          // Url pattern is different depending on number of language
          if ($this->app['isMultilingual']) {
            return '/'.$this->app['lang'].'/'.$path;
          }
          return '/'.$path;
        }
        return '';
      })
    );
  }
}