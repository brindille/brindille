<?php

use Detection\MobileDetect as Mobile_Detect;

class DeviceDetectorService
{
  private $isMobile = false;
  private $isTablet = false;
  private $isIE = false;
  private $isEdge = false;
  private $isSafari = false;
  private $isFirefox = false;
  private $isChrome = false;
  private $isiOS = false;
  private $isAndroidOS = false;
  private $versionIE;

  private $mobileDetect;

  public function __construct()
  {
    $this->mobileDetect = new Mobile_Detect();

  }

  public function isMobile()
  {
    $this->isMobile = $this->mobileDetect->isMobile();
    $this->isTablet = $this->mobileDetect->isTablet();

    if ($this->isMobile && $this->isTablet) {
      $this->isMobile = false;
    }

    return $this->isMobile;
  }

  public function isiOS()
  {
    $this->mobileDetect = new Mobile_Detect();
    $this->isiOS = $this->mobileDetect->is('iOS');

    return $this->isiOS;
  }

  public function getIsOldIOS()
  {
    if(strpos($_SERVER['HTTP_USER_AGENT'], 'iPhone') || strpos($_SERVER['HTTP_USER_AGENT'],'iPad' ) || strpos($_SERVER['HTTP_USER_AGENT'], 'iPod' ) !== false){
      if (strpos($_SERVER['HTTP_USER_AGENT'], 'OS 9_0') !== false) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  public function isAndroidOS()
  {
    $this->mobileDetect = new Mobile_Detect();

    $this->isAndroidOS = $this->mobileDetect->isAndroidOS();

    return $this->isAndroidOS;
  }

  public function isTablet()
  {
    $this->mobileDetect = new Mobile_Detect();

    $this->isTablet = $this->mobileDetect->isTablet();

    return $this->isTablet;
  }

  public function getIsFirefox()
  {
    if (strlen(strstr($_SERVER['HTTP_USER_AGENT'], 'Firefox')) > 0) {
      $this->isFirefox = true;
    }

    return $this->isFirefox;
  }

  public function getIsOldFirefox()
  {

    $isFirefox = $this->getIsFirefox();

    if ($isFirefox) {
      $version = substr($_SERVER['HTTP_USER_AGENT'], -4, 2);

      if ((int)$version < 51) {
        $this->isOldFirefox = true;
      } else {
        $this->isOldFirefox = false;
      }
    } else {
      $this->isOldFirefox = false;

    }

    return $this->isOldFirefox;
  }

  public function getIsIE()
  {
    preg_match('/MSIE (.*?);/', $_SERVER['HTTP_USER_AGENT'], $matches);
    if(count($matches) < 2){
      preg_match("/(Trident\/(\d{2,}|7|8|9)(.*)rv:(\d{2,}))|(MSIE\ (\d{2,}|8|9)(.*)Tablet\ PC)|(Trident\/(\d{2,}|7|8|9))/", $_SERVER['HTTP_USER_AGENT'], $matches);
    }

    if (count($matches) > 1){
      $this->isIE = true;
      $this->versionIE = $matches[1];
    }

    return $this->isIE;
  }

  public function getIsEdge()
  {
    preg_match('/Edge\/\d{1,2}.\d{1,2}/', $_SERVER['HTTP_USER_AGENT'], $matches);

    if (count($matches) > 0){
      $this->isEdge = true;
    }
    return $this->isEdge;
  }

  public function getIEVersion()
  {
    if (true === self::getIsIE()) {
      return $this->versionIE;
    }

    return null;
  }

  public function getIsSafari()
  {
    if (strpos($_SERVER['HTTP_USER_AGENT'], 'Safari') && !strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')) {
      $this->isSafari = true;
    }

    return $this->isSafari;
  }

  public function getIsChrome()
  {
    if (strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome') > 0) {
      $this->isChrome = true;
    }

    return $this->isChrome;
  }
}

$app['device_service'] = function() {
  return new DeviceDetectorService();
};
