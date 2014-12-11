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
            'testNum' => $this->service->test()
        ];
    }

    public function getQuestionAction()
    {

    }

    /**
     * Create a new ad with an accompanying required action.
     *
     * @path /insertQuestion
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

            foreach ($validPoints as &$point) {
                $point = (int) $point;
            }

            $this->resp['status'] = $this->service->insertQuestion($imageUrl, $question, $validPoints);
        } else {
            $this->resp['data'] = 'Invalid action';
        }
    }
}
