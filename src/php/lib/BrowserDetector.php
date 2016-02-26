<?php

use Detection\MobileDetect as Mobile_Detect;

/**
* Language detector
*/
class BrowserDetector
{
  private static $isMobile = false;
  private static $isTablet = false;
  private static $isIE = false;
  private static $isEdge = false;
  private static $isFirefox = false;
  private static $isiOS = false;
  private static $isAndroidOS = false;
  private static $versionIE;

  public static function isMobile()
  {
    $detect = new Mobile_Detect;

    self::$isMobile = $detect->isMobile();
    self::$isTablet = $detect->isTablet();

    if (self::$isMobile && self::$isTablet) {
      self::$isMobile = false;
    }

    return self::$isMobile;
  }

  public static function isiOS()
  {
    $detect = new Mobile_Detect;

    self::$isiOS = $detect->isiOS();

    return self::$isiOS;
  }

  public static function isAndroidOS()
  {
    $detect = new Mobile_Detect;

    self::$isAndroidOS = $detect->isAndroidOS();

    return self::$isAndroidOS;
  }

  public static function isTablet()
  {
    $detect = new Mobile_Detect;

    self::$isTablet = $detect->isTablet();

    return self::$isTablet;
  }

  public static function getIsFirefox()
  {
    if (strlen(strstr($_SERVER['HTTP_USER_AGENT'], 'Firefox')) > 0) {
      self::$isFirefox = true;
    }

    return self::$isFirefox;
  }

  public static function getIsIE()
  {
    preg_match('/MSIE (.*?);/', $_SERVER['HTTP_USER_AGENT'], $matches);
    if(count($matches) < 2){
      preg_match('/Trident\/\d{1,2}.\d{1,2}; rv:([0-9]*)/', $_SERVER['HTTP_USER_AGENT'], $matches);
    }

    if (count($matches) > 1){
      self::$isIE = true;
      self::$versionIE = $matches[1];
    }

    return self::$isIE;
  }

  public static function getIsEdge()
  {
    preg_match('/Edge\/\d{1,2}.\d{1,2}/', $_SERVER['HTTP_USER_AGENT'], $matches);

    if (count($matches) > 0){
      self::$isEdge = true;
    }
    return self::$isEdge;
  }

  public static function getIEVersion()
  {
    if (true === self::getIsIE()) {
      return self::$versionIE;
    }

    return null;
  }
}
