<?php

class IndexController extends Zend_Controller_Action
{
    /** @var Application_Service_Ad service */
    protected $service;
    protected $resp;

    public function init()
    {
        $this->service = new Application_Service_Ad();
        $this->resp = [
            'status' => false,
            'data' => null
        ];
    }

    public function postDispatch(){
        $this->_helper->getHelper('json')->sendJson($this->resp);
    }

    public function indexAction()
    {
        $this->resp['status'] = true;
        $this->resp['data'] = [
            'service' => 'MONAD',
            'time' => $this->service->test()
        ];
    }

    /**
     * Get a random ad image, with its accompanying required action.
     *
     * @path /index/get-question
     * @method GET
     *
     * @return object [id{int}, image{string}, question{string}]
     */
    public function getQuestionAction()
    {
        $this->resp['data'] = $this->service->getRandomQuestion();
    }

    /**
     * Create a new ad with an accompanying required action.
     *
     * @path /index/insertQuestion
     * @method POST
     *
     * @postParam imageUrl string Absolute URL (**url encoded**) to ad image
     * @postParam question string Concise action that the user is asked to perform
     * @postParam validPoints string Eight Comma-separated ints representing four [x,y] coords indication sub-image where the action is expected
     *
     * @return string|json
     */
    public function insertQuestionAction()
    {
        $req = $this->getRequest();

        if ($req->isPost() || 1) {
            $imageUrl = filter_var(urldecode($req->getParam('imageUrl', FILTER_SANITIZE_URL)));
            $question = filter_var($req->getParam('question', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
            $validPoints = explode(',', $req->getParam('validPoints'));

            if (count($validPoints) === 4) {
                foreach ($validPoints as &$point) {
                    $point = (int) $point;
                }

                $this->resp['status'] = $this->service->insertQuestion($imageUrl, $question, $validPoints);
            } else {
                $this->resp['data'] = 'Invalid target coordinates';
            }
        } else {
            $this->resp['data'] = 'Invalid action';
        }
    }

    /**
     * Verify that a given [x,y] is within the required target for a given ad
     *
     * @path /index/verify
     * @method POST
     *
     * @postParam id int Ad id
     * @postParam resp string Two Comma-separated ints representing the [x,y] coords from the user action
     *
     * @return string|json
     */
    public function verifyAction()
    {
        $req = $this->getRequest();

        if ($req->isPost() || 1) {
            $questionId = (int)$req->getParam('id');
            $respPoints = explode(',', $req->getParam('resp'));

            if (count($respPoints) === 2) {
                foreach ($respPoints as &$point) {
                    $point = (int)$point;
                }

                $this->resp['status'] = $this->service->verify($questionId, $respPoints);
            } else {
                $this->resp['data'] = 'Invalid target coordinates';
            }
        } else {
            $this->resp['data'] = 'Invalid action';
        }
    }
}
