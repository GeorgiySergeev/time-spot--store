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
    'path' => '/2025/09/07/product-s-1-10_uid_68bd39f878f97.png',
    'title' => 'Product s 1 3',
    'mime' => 'image/png',
    'type' => 'image',
    'description' => '',
    'tags' => 
    array (
    ),
    'size' => 13211,
    'colors' => 
    array (
      0 => '#be985b',
      1 => '#edc979',
      2 => '#745432',
      3 => '#cabeac',
      4 => '#8f6333',
    ),
    'width' => 224,
    'height' => 244,
    '_hash' => '54563f7c028afb94e7a86c3e6e04184d',
    '_created' => 1757231410,
    '_modified' => 1757231615,
    '_cby' => '689ba5ac67483c2ea1276086',
    'altText' => 'product-s-1-10.png',
    'thumbhash' => '100-74-130-5-0-35-46-241-71-217-132-203-89-57-96-9-40-124-7-120-130-125-134-217-71',
    'folder' => '',
    '_id' => '68bd393267483c8e43c081bd',
    '_mby' => '689ba5ac67483c2ea1276086',
  ),
));

?><?php Cockpit()->module("content")->updateRefs($asset["_id"], $asset);