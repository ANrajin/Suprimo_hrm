<?php
require $base_uri . '/Controllers/BaseController.php';

if ($uri == "/api/roles") {
	require $base_uri . "/Controllers/RolesController.php";

	$RolesController = new RolesController();

	if ($request == "GET") {
		$RolesController->index();
	}
}


/**
* HTTP GET request routes
*/
if($request == "GET" && preg_match("~^/api/(\w+)/?$~", $uri, $matches)){
    if($matches[1] == 'users'){
        require $base_uri . "/Controllers/UsersController.php";
        $UsersController = new UsersController();
        $UsersController->index();
    }
}


/**
* HTTP POST request routes
*/
if ($request == "POST" && preg_match("~^/api/(\w+)/?$~", $uri, $matches)) {
    if($matches[1] == 'login'){
        require $base_uri . "/Controllers/LoginController.php";
		$LoginController = new LoginController();
		$LoginController->login($_POST);
    }
    elseif($matches[1] == 'users'){
        require $base_uri . "/Controllers/UsersController.php";
        $UsersController = new UsersController();
        $UsersController->create($_POST['name'],$_POST['email'],$_POST['phone'],password_hash($_POST['password'], PASSWORD_DEFAULT),$_POST['role'],$_FILES['file']['name'],$_FILES['file']['tmp_name']);
    }
}


/**
*HTTP Update request routes
*/
if (preg_match("~^/api/(\w+)/update/?$~", $uri, $matches) && $request == "POST") {
    if($matches[1] == 'users'){
        require $base_uri . "/Controllers/UsersController.php";
		$UsersController = new UsersController();
		$UsersController->update($_POST);
    }
}


/**
* HTTP DELETE request routes
*/
if(preg_match("~^/api/(\w+)/(\d+)/?$~", $uri, $matches) && $request == "DELETE"){
	$id = $matches[2];

	if($matches[1] == "users"){
		require $base_uri . "/Controllers/UsersController.php";
		$UsersController = new UsersController();
		$UsersController->destroy($id);
	}
}
