<?php

class IndexController extends Zend_Controller_Action
{
    public function init()
    {
//        $this->serviceFactory = new ServiceFactory();
    }

    public function indexAction()
    {
        $hello = ['hello' => 'MONAD'];

        $this->_helper->getHelper('json')->sendJson($hello);
    }
}
