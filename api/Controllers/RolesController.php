<?php

class RolesController extends BaseController
{
	public function index()
	{
		$sql = $this->db->prepare("SELECT * FROM roles");
		$sql->execute();
		if ($sql->rowCount() > 0) {
			while ($row = $sql->fetchObject()) {
				$data[] = $row;
			}
		}

		echo json_encode($data);
	}
}
