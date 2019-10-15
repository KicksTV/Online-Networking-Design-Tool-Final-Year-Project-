<?php
//The parent class
class Computer {
  // Private property inside the class
  private $ip_address;
 
  //Public setter method
  public function setIPAddress($ip_address)
  {
    $this -> ip_address = $ip_address;
  }
 
 
}
 
 
//The child class inherits the code from the parent class
class Laptop extends Computer {
  //No code in the child class
}
 
 
//Create an instance from the child class
$Laptop1 = new Laptop();
  
// Set the value of the class’ property.
// For this aim, we use a method that we created in the parent
$Laptop1 -> setIPAddress('192.168.1.1');
  
