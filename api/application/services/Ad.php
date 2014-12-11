<?php

class Application_Service_Ad
{
    /** @var  Application_Model_Ad */
    protected $model;

    public function __construct()
    {
        $db = Zend_Registry::get('db');
        $this->model = new Application_Model_Ad($db);
    }

    public function test()
    {
        return time();
    }

    public function insertQuestion($imageUrl, $question, array $validPoints)
    {
        return $this->model->insertQuestion($imageUrl, $question, $validPoints);
    }

    public function getRandomQuestion()
    {
        return $this->model->getRandomQuestion();
    }

    public function verify($questionId, array $respPoints)
    {
        $question = $this->model->get($questionId);
        $targetPts = $question['validPoints'];

        return $respPoints[0] >= $targetPts[0] &&
            $respPoints[0] <= $targetPts[2] &&
            $respPoints[1] >= $targetPts[1] &&
            $respPoints[1] <= $targetPts[3];
    }
}
