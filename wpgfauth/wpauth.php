<?php
/*
Plugin Name: GameFroot Auth
Plugin URI: http://gamefroot.com/
Description: Used to externally authenticate WP users with the GameFroot Server
Version: 1.0
Author: Lloyd Weehuizen
Author URI: http://gamefroot.com
*/

const API_URL = 'http://192.168.1.232:8081/api/';

function gamefroot_auth_check_login($username,$password)
{
    require_once('./wp-includes/user.php');

    if ($username == '')
        return;

    $result = post(API_URL . 'authentication/login', array('username' => $username, 'password' => $password));

    if ($result['status'] == 'ok')
    {

		$userarray = array();
    	$userarray['user_login'] = $username;
    	$userarray['user_email'] = $result['email'];
		$userarray['user_pass'] = $password;

		if ($id = username_exists($username))
	    {
			$userarray['ID'] = $id;
			wp_update_user($userarray);
		}
		else
	    {
	        wp_insert_user($userarray);
		}
	}
	else
	{
		return new WP_Error(401, 'Invalid username or password');
	}
}

function gamefroont_auth_check_registration($username, $email, $errors)
{
	$password = $_REQUEST['password'];

	$result = post(API_URL . 'authentication/register', array('username' => $username, 'email' => $email, 'password' => $password));
	if ($result['status'] == 'usernameexists')
    {
    	$errors->add( 'username_error', __( '<strong>ERROR</strong>: Username in use', 'my_textdomain' ) );
    }
    elseif ($result['status'] == 'emailexists')
    {
    	$errors->add( 'email_error', __( '<strong>ERROR</strong>: Email in use', 'my_textdomain' ) );
    }
    elseif ($result['status'] != 'ok')
    {
    	$errors->add( 'username_error', __( '<strong>ERROR</strong>: Internal error', 'my_textdomain' ) );
    }

	return $errors;
}

function post($url, $data)
{

	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
	curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
	curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
	curl_setopt($ch, CURLOPT_AUTOREFERER, true);
	@curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
	$response = curl_exec($ch);

	$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	if ($http_status != 200)
		return array('status' => 'fail', 'message' => 'http error ' . $http_status . ': ' . $response);

	return json_decode($response, true);
}

add_action('wp_authenticate', 'gamefroot_auth_check_login', 1, 2 );