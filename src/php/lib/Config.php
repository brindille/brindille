<?php

/**
* Config
*/
class Config
{

  private static $keys = [];

  public static function get($fileName, $key)
  {
    self::$keys = include(__DIR__ . '/../../../config/'. $fileName .'.php');
    return self::$keys[$key];
  }
}