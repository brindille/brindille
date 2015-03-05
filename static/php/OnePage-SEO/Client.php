<?php
class Client
{
    private $phantomJs;
    private $script;
    private $url;
    private $domx;
    private $snapshotDir;
    private $response;

    public function __construct()
    {
        $this->phantomJs = __DIR__ + '/phantom/bin/linux/phantomjs';
        $this->script = __DIR__ + '/phantom/script.js';
    }

    public function setPhantomJs($path)
    {
        $this->phantomJs = $path;
    }

    public function getPhantomJs()
    {
        return $this->phantomJs;
    }

    public function setScript($path)
    {
        $this->script = $path;
    }

    public function getScript()
    {
        return $this->script;
    }

    public function setUrl($url)
    {
        $this->url = $url;
    }

    public function getUrl()
    {
        return $this->url;
    }

    public function setSnapshotDir($path)
    {
        $this->snapshotDir = $path;
    }

    public function getSnapshotDir()
    {
        return $this->snapshotDir;
    }

    public function send()
    {
        if(null === $this->url) {
            throw new Exception("Error Processing Request: No URL provided", 1);
        }

        $this->response = shell_exec($this->phantomJs . ' ' . $this->script . ' ' . $this->url . ' 2>&1');
        $this->response = $this->clearHTML();

        return $this->response;
    }

    private function clearHTML()
    {

        $dom = new DOMDocument();
        $dom->loadHTML($this->response, LIBXML_NOWARNING);

        $script = $dom->getElementsByTagName('script');
        $remove = [];
        foreach($script as $item) {
            $remove[] = $item;
        }

        foreach ($remove as $item) {
            $item->parentNode->removeChild($item);
        }

        $this->domx = new DOMXPath($dom);
        $this->removeStyles('p');
        $this->removeStyles('h2');
        $this->removeStyles('div');
        $this->removeStyles('img');

        $masks = $this->domx->query("//*[contains(@class, 'mask')]");
        foreach($masks as $mask) {
            $mask->setAttribute("style", "opacity: 0;");
        }

        $headers = $this->domx->query("//*[contains(@class, 'small')]");
        foreach($headers as $header) {
            $header->setAttribute('style', '');
        }

        $footers = $this->domx->query("//footer");
        foreach($footers as $footer) {
            $footer->setAttribute('style', 'opacity: 1;');
        }

        $headers = $this->domx->query("//*[contains(@class, 'header-content')]");
        foreach($headers as $header) {
            $header->parentNode->removeChild($header);
        }

        $loaders = $this->domx->query("//*[contains(@class, 'load-indicator')]");
        foreach($loaders as $loader) {
            $loader->parentNode->removeChild($loader);
        }

        $html = $dom->saveHTML();
        return $html;
    }

    private function removeStyles($tag)
    {
        $items = $this->domx->query("//".$tag."[@style]");
        foreach($items as $item) {
            $item->removeAttribute("style");
        }
    }
}