<?php

class BaseController
{
    protected $db;
    protected $dir;

    function BaseController()
    {
        $this->db = DB::connect();
        $this->dir = $_SERVER['DOCUMENT_ROOT'];
    }
}
