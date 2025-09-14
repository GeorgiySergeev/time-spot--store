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
    'path' => '/2025/09/07/product-s-1-4_uid_68bd39b1dc59a.png',
    'title' => 'Product s 1 3',
    'mime' => 'image/png',
    'type' => 'image',
    'description' => '',
    'tags' => 
    array (
    ),
    'size' => 27023,
    'colors' => 
    array (
      0 => '#bca96e',
      1 => '#d7d3c0',
      2 => '#cec49f',
      3 => '#7c6c45',
      4 => '#8c845c',
    ),
    'width' => 290,
    'height' => 256,
    '_hash' => 'c236e3e5b0c966ee108a849274017792',
    '_created' => 1757231410,
    '_modified' => 1757231541,
    '_cby' => '689ba5ac67483c2ea1276086',
    'altText' => 'product-s-1-4.png',
    'thumbhash' => '169-25-130-4-128-37-119-246-113-119-194-231-122-248-152-135-143-138-137-48-116-25-122-124-6',
    'folder' => '',
    '_id' => '68bd393267483c8e43c081bd',
    '_mby' => '689ba5ac67483c2ea1276086',
  ),
));

?><?php Cockpit()->module("content")->updateRefs($asset["_id"], $asset);