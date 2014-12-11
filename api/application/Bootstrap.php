<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    protected function _initConfig()
    {
        Zend_Registry::set('config', $this->getOptions());
    }

    protected function _initDatabases()
    {
        $options = Zend_Registry::get('config');
        $params = array(
            'host' => $options['resources']['db']['params']['host'],
            'username' => $options['resources']['db']['params']['username'],
            'password' => $options['resources']['db']['params']['password'],
            'dbname' => $options['resources']['db']['params']['dbname']
        );
        $db_light = Zend_Db::factory($options['resources']['db']['adapter'], $params);
        Zend_Registry::set('db', $db_light);
    }
}
