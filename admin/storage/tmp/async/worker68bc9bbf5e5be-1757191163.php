<?php

if (isset($_GET['async'])) {
    \session_write_close();
}

// include cockpit
include('/var/www/vhosts/websphere.miy.link/websphere.miy.link/admin/bootstrap.php');

function Cockpit() {

    static $instance;

    if (!isset($instance)) {
        $instance = Cockpit::instance('/var/www/vhosts/websphere.miy.link/websphere.miy.link/admin', array (
  'app_space' => NULL,
  'base_route' => '/admin',
  'base_url' => '/admin',
));
        $GLOBALS['APP'] = $instance;
    }

    return $instance;
}

register_shutdown_function(function() {
    $error = error_get_last();

    if ($error && $error['type'] === E_ERROR) {
        // Log fatal error
        Cockpit()->trigger('error', [$error]);
    }

    // Delete worker script after execution
    if (file_exists(__FILE__))  unlink(__FILE__);
});

extract(array (
  'asset' => 
  array (
    'path' => '/2025/08/12/1_uid_689ba7aa0c910.jpg',
    'title' => '1',
    'mime' => 'image/jpeg',
    'type' => 'image',
    'description' => '',
    'tags' => 
    array (
    ),
    'size' => 127738,
    'colors' => 
    array (
      0 => '#a4806b',
      1 => '#222321',
      2 => '#d8d9d7',
      3 => '#e6cfa8',
      4 => '#553724',
    ),
    'width' => 959,
    'height' => 1280,
    '_hash' => '65e31c792e3fbafff703ae020b58d18a',
    '_created' => 1755031465,
    '_modified' => 1757191103,
    '_cby' => '689ba5ac67483c2ea1276086',
    'altText' => '1.jpg',
    'thumbhash' => '219-40-6-21-4-239-122-181-165-218-55-86-122-119-107-166-159-133-248-76-120',
    'folder' => '68b6f2a567483ca31cc44b8e',
    '_id' => '689ba7aa67483c24b883c37a',
    '_mby' => '689ba5ac67483c2ea1276086',
  ),
));

?><?php Cockpit()->module("content")->updateRefs($asset["_id"], $asset);