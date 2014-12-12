<?php

class Application_Model_Session
{
    /**
     * @var Zend_Db_Adapter_Pdo_Mysql
     */
    protected $db;

    const TABLE_MONAD_SESSION = 'monadSession';
    const ATTEMPT_HARD_LIMIT = 5;

    public function __construct(Zend_Db_Adapter_Pdo_Mysql $db){
        $this->db = $db;
    }

    public function newSession() {
        $token_gen = function($n = 20) {
            $r = '';
            $c = array_merge(range('A', 'Z'), range('a', 'z'), range('0', '9'));
            for($i = 0; $i < $n; $i++) {
                $r .= $c[rand(0, count($c) - 1)];
            }
            return $r;
        };
        $token = $token_gen();

        $sess = $this->db->insert(self::TABLE_MONAD_SESSION, [
            'token' => $token
        ]);

        return $this->db->lastInsertId();
    }

    public function seekToken($id) {
        $select = $this->db->select()
            ->from(self::TABLE_MONAD_SESSION)
            ->where('id = ?', $id)
            ->limit(1);

        $sess = $select->query()->fetch();
        $return = null;
        if(!empty($sess['token'])) {
            $attempts = $sess['attempts'] + 1;
            $token = ($sess['attempts'] < self::ATTEMPT_HARD_LIMIT ? $sess['token'] : null);
            $update = $this->db->update(self::TABLE_MONAD_SESSION, [
                'attempts' => $attempts
            ], 'id = ' . $this->db->quote((int)$id, 'INTEGER'));

            if(!empty($sess['token']) && empty($token)) {
                $this->deleteSession($id);
            }

            $return = ['token' => $token, 'attempts' => $attempts];
        }

        return $return;
    }

    public function checkToken($token) {
        $select = $this->db->select()
            ->from(self::TABLE_MONAD_SESSION)
            ->where('token = ?', $token)
            ->limit(1);

        $sess = $select->query()->fetch();
        if(!empty($sess['token']) && $sess['attempts'] <= self::ATTEMPT_HARD_LIMIT) {
            return true;
        } else {
            return false;
        }
    }

    public function deleteSession($id) {
        return $this->db->delete(self::TABLE_MONAD_SESSION, 'id = ' . $this->db->quote((int)$id, 'INTEGER'));
    }
}