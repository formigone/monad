<?php

class Application_Service_Session
{
    /** @var  Application_Model_Session */
    protected $model;

    public function __construct()
    {
        $db = Zend_Registry::get('db');
        $this->model = new Application_Model_Session($db);
    }

    public function test()
    {
        return time();
    }

    public function newSession() {
        return $this->model->newSession();
    }

    public function seekToken($id) {
        return $this->model->seekToken($id);
    }

    public function checkToken($token) {
        return $this->model->checkToken($token);
    }

    public function deleteSession($id) {
        return $this->model->deleteSession($id);
    }
}
