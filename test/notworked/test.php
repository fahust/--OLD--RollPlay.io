<?php 
ini_set("display_errors", 1);

$pdo = new PDO('mysql:host=192.168.1.28; dbname=test;port=5432; ','root','Skisoboy999!',array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));