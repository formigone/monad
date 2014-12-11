<?php

class Application_Model_Ad
{
    /**
     * @var Zend_Db_Adapter_Pdo_Mysql
     */
    protected $db;

    const TABLE_MONAD_AD = 'monadAd';

    public function __construct(Zend_Db_Adapter_Pdo_Mysql $db){
        $this->db = $db;
    }

    public function insertQuestion($imageUrl, $question, array $validPoints) {
        return $this->db->insert(self::TABLE_MONAD_AD, [
                'image' => $imageUrl,
                'question' => $question,
                'validPoints' => json_encode($validPoints)
            ]
        );
    }

    public function getRandomQuestion()
    {
        $select = $this->db->select()
            ->from(['Ad' => self::TABLE_MONAD_AD], ['id', 'image', 'question'])
            ->limit(1)
            ->order(new Zend_Db_Expr('RAND()'));

        return $select->query()->fetch();
    }
}