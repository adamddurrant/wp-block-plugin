<?php

/*
Plugin Name: Quiz Block Plugin
Description: Adds a Q&A style quiz to test readers throughout pieces of content
Version: 1.0
Author: Adam
Author URI: adamdurrant.co.uk
*/


//Prevents code from being triggered when users visit this php file URL
if (!defined('ABSPATH')) exit;

class QuizBlock
{
  function __construct()
  {
    add_action('enqueue_block_editor_assets', array($this, 'adminAssets'));
  }

  function adminAssets()
  {
    wp_enqueue_script('quizblockscript', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element'));
  }
}

//Instantiates the class
$quizblock = new QuizBlock();
