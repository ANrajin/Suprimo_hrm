<?php
class UsersController extends BaseController
{
    private function getUsers(){
        try{
            $sql = $this->db->prepare("SELECT a.*, b.role FROM users a INNER JOIN roles b ON b.id = a.role_id");
            $sql->execute();
            if ($sql->rowCount() > 0) {
                while ($row = $sql->fetchObject()) {
                    $data[] = $row;
                }
            }

            return $data;
        }catch(\Exception $e){
            return array("msg" => $e->getMessage());
        }
    }
    
    public function index(){
        try{
            $sql = $this->db->prepare("SELECT a.*, b.role FROM users a INNER JOIN roles b ON b.id = a.role_id");
            $sql->execute();
            if ($sql->rowCount() > 0) {
                while ($row = $sql->fetchObject()) {
                    $data[] = $row;
                }
            }

            echo json_encode($data);
        }catch(\Exception $e){
            echo json_encode(array("status" => $e->getMessage()));
        }
    }

    /**
    * Store newly created user
    */
    public function create($name, $email, $phone, $password, $role, $img, $tmp_img)
    {
    	if(!is_dir($this->dir."\uploads")){
    		mkdir($this->dir. "\uploads");
    	}

        try{
            $sql = $this->db->prepare("INSERT INTO users (role_id, username, email, phone, password, image) VALUES ('".$role."', '".$name."', '".$email."','".$phone."','".$password."', '".$img."')");

            if($sql->execute()){
                move_uploaded_file($tmp_img, $this->dir."/uploads/".$img);
                echo json_encode(array("status" => "200", 'users' => $this->getUsers()));
            }else{
                echo json_encode(array("status" => "404"));
            }
        }catch(\Exception $e){
            echo json_encode(array("status" => $e->getMessage()));
        }
    }



    /**
    *Edit a user
    */
    public function edit($id){
        try{
            $sql = $this->db->prepare("SELECT * FROM users WHERE id = '".$id."'");
            $sql->execute();
            $data = $sql->fetch(PDO::FETCH_OBJ);

            echo json_encode($data);
        }catch(\Exception $e){
            echo json_encode(array("status" => $e->getMessage()));
        }
    }
    
    
    
    /**
    * Update users
    */
    public function update($request){
        try{
            $sql = $this->db->prepare("UPDATE users SET role_id = '".$request['role_id']."', username = '".$request['name']."', email = '".$request['email']."', phone = '".$request['phone']."' WHERE id = '".$request['id']."'");

            if($sql->execute()){
                echo json_encode(array('status' => '200', 'users' => $this->getUsers()));
            }else{
                echo json_encode(array("status" => "404"));
            }
        }catch(\Exception $e){
            echo json_encode(array("status" => $e->getMessage()));
        }
    }



    /**
    * DELETE user data
    */
    public function destroy($id){
        try{

            $sql = $this->db->prepare("SELECT image FROM users WHERE id = '".$id."'");
            $sql->execute();
            $image = $sql->fetch(PDO::FETCH_OBJ);

            if($sql->rowCount() == "1"){
                $sqli = $this->db->prepare("DELETE FROM users WHERE id = '".$id."'");
                if ($sqli->execute()) {
                    //delete the image
                    unlink($this->dir."/uploads/".$image->image);
                    echo json_encode(array('status' => '200', 'users' => $this->getUsers()));
                }else{
                    echo json_encode(array("status" => "404"));
                }
            }else{
                echo json_encode(array("status" => "404"));
            }
        }catch(\Exception $e){
            echo json_encode(array("status" => $e->getMessage()));
        }
    }
}
