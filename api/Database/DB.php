<?php

class DB
{
	protected static $host = "localhost";
	protected static $db = "suprimo";
	protected static $username = "root";
	protected static $password = "";


	public static function connect()
	{
		$dsn = "mysql:host=" . self::$host . ";dbname=" . self::$db . "";

		try {
			$conn = new PDO($dsn, self::$username, self::$password);
			// set the PDO error mode to exception
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			return $conn;
		} catch (PDOException $e) {
			echo "Connection failed: " . $e->getMessage();
		}
	}
}
