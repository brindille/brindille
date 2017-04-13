<?php

use Gaufrette\Filesystem;
use Gaufrette\Adapter\Local as LocalAdapter;
use Symfony\Component\Yaml\Parser as YamlParser;

class YamlParserService
{
  private $parser;
  private $adapterData;
  private $filesystemData;
  private $adapterConfig;
  private $filesystemConfig;

  public function __construct()
  {
    $this->adapterData = new LocalAdapter(__DIR__.'/../../../data/');
    $this->filesystemData = new Filesystem($this->adapterData);

    $this->parser = new YamlParser();
  }

  public function parse($url)
  {
    return $this->parser->parse($this->filesystemData->read($url));
  }
}

$app['yaml_service'] = function() {
  return new YamlParserService();
};
