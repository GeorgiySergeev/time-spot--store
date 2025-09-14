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
    'path' => '/2025/09/02/photo_2024-07-30_18-20-06_uid_68b6f3dc3eb5b.jpg',
    'title' => 'Photo 2024 07 30 18 20 06',
    'mime' => 'image/jpeg',
    'type' => 'image',
    'description' => '',
    'tags' => 
    array (
    ),
    'size' => 138721,
    'colors' => 
    array (
      0 => '#2d3139',
      1 => '#c9c9c5',
      2 => '#7c7d7c',
      3 => '#949c94',
      4 => '#8c8c9c',
    ),
    'width' => 1073,
    'height' => 1280,
    '_hash' => '5a6120e40f6dc33fb172f9a1349f1f76',
    '_created' => 1756820444,
    '_modified' => 1757681430,
    '_cby' => '689ba5ac67483c2ea1276086',
    'altText' => 'photo_2024-07-30_18-20-06.jpg',
    'thumbhash' => '209-247-9-14-0-180-136-246-117-118-135-135-152-152-150-131-103-121-134-5-67-184-32',
    'folder' => '68b6f2a567483ca31cc44b8e',
    '_id' => '68b6f3dc67483c9f62989855',
    '_mby' => '689ba5ac67483c2ea1276086',
  ),
));

?><?php Cockpit()->module("content")->updateRefs($asset["_id"], $asset);