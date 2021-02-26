<?php
class LoginController extends BaseController{

    public function login($request){

        if(isset($request) && !empty($request)){
            $email = $request['email'];
            $password = $request['password'];
        }
        
        $sql = $this->db->prepare("SELECT username, email, password, phone FROM users WHERE email = '".$email."'");
        $sql->execute();
        $data = $sql->fetch(PDO::FETCH_OBJ);

        if(password_verify($password, $data->password)){
            echo json_encode(["status" => true]);
        }else{
            echo json_encode(["status" => false]);
        }

    }
}