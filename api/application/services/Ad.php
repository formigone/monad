<?php

class Application_Service_Ad {
    /** @var  Application_Model_Ad */
    protected $model;

    public function __construct()
    {
        $db = Zend_Registry::get('db');
        $this->model = new Application_Model_Ad($db);
    }

    public function test()
    {
        return 23;
    }

    public function insertQuestion($imageUrl, $question, array $validPoints)
    {
        return $this->model->insertQuestion($imageUrl, $question, $validPoints);
    }
}
