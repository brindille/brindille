<?php

use Symfony\Component\Yaml\Parser;

/**
* El router!
*/
class Router
{
  private $isPartial = false;
  private $pageInfos = [];
  private $datas = [];
  private $page;
  private $twig;
  private $db;

  public function __construct($twig)
  {
    $this->twig = $twig;
    $this->yamlParser = new Parser();
    $this->isPartial = isset($_GET['c']);

    $this->_registerData('Global', 'global.yaml');
    $this->defaultPage = $this->datas['Global']['defaultRoute'];

    $pageTest = isset($_GET['p']) ? $_GET['p'] : $this->defaultPage;
    $this->pageInfos = explode('/', $pageTest);

    $this->pageFromPath = isset($this->pageInfos[0]) && $this->pageInfos[0] !== '' ? $this->pageInfos[0] : $this->defaultPage;
    $this->page = $this->_authorizePages($this->pageFromPath) ? $this->pageFromPath : $this->defaultPage;

    $this->_setDatas();
    $this->_checkSpecialPages();
  }


  /**
   * Render the desired page in partial or in complete
   */
  public function render()
  {
    $result = '';

    if ($this->isPartial) {
      $html = $this->twig->render('sections/'.$this->page.'/'. $this->page.'.html', $this->datas);
      $jsonArray = [
        'page' => $html
      ];
      return json_encode($jsonArray);
    }

    return $this->twig->render('index.html', $this->datas);
  }

  /**
   * Register yaml data from given path in $this->data[$key]
   * @param  String $key  key where to save the data
   * @param  String $path path to the yaml starting from the data folder
   */
  private function _registerData($key, $path)
  {
    $this->datas[$key] = $this->yamlParser->parse(file_get_contents(__DIR__ . '/../../data/' . $path));
  }

  /**
   * Set datas for twig templates
   */
  private function _setDatas()
  {
    $this->_setStaticData();
    $this->_registerData(ucfirst($this->page), 'pages/' . $this->page . '.yaml');
    $this->_mergePageInfosAndDatas();
  }

  /*
    prevent unknown path
  */

  private function _authorizePages($pageName)
  {
    return in_array($pageName, $this->datas['Global']['routes']);
  }

  /**
   * Common datas
   */
  private function _setStaticData()
  {
    $this->datas['page'] = $this->page;
    $this->datas['rooturl'] = 'http://'.$_SERVER['HTTP_HOST'] . '/';
    $this->datas['currenturl'] = 'http://'.$_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    $this->datas['base'] = Config::get('app', 'serverBase');
    $this->datas['isMobile'] = BrowserDetector::isMobile();
    $this->datas['isTablet'] = BrowserDetector::isTablet();
    $this->datas['isMobileTablet'] = BrowserDetector::isMobile() || BrowserDetector::isTablet();
    $this->datas['isFirefox'] = BrowserDetector::getIsFirefox();
    $this->datas['isIE'] = BrowserDetector::getIsIE();
    $this->datas['isEdge'] = BrowserDetector::getIsEdge();
    $this->datas['IEVersion'] = (int) BrowserDetector::getIEVersion();
    $this->datas['isiOS'] = BrowserDetector::isiOS();
    $this->datas['isAndroidOS'] = BrowserDetector::isAndroidOS();
  }

  /**
   * Merge pageInfos and datas
   */
  private function _mergePageInfosAndDatas()
  {
    $this->datas['pageInfos'] = [];
    $this->datas['pageInfos'] = array_merge($this->datas['pageInfos'], $this->pageInfos);
  }

  /**
   * Some pages need a specific treatment
   */
  private function _checkSpecialPages() {}
}
