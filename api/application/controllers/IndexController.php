<?php

class IndexController extends Zend_Controller_Action
{
    /** @var Application_Service_Ad service */
    protected $service;

    public function init()
    {
        $this->service = new Application_Service_Ad();
    }

    public function indexAction()
    {
        $hello = [
            'service' => 'MONAD',
            'testNum' => $this->service->test()
        ];

        $this->_helper->getHelper('json')->sendJson($hello);
    }

    public function getQuestion()
    {
        
    }
}
