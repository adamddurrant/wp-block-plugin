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
    add_action('init', array($this, 'adminAssets'));
  }

  function adminAssets()
  {
    wp_register_style('quizblockstyles', plugin_dir_url(__FILE__) . 'build/index.css');
    wp_register_script('quizblockscript', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
    register_block_type('quizblock/quiz-test', array(
      'editor_script' => 'quizblockscript',
      'editor_style' => 'quizblockstyles',
      'render_callback' => array($this, 'theHTML')
    ));
  }

  function theHTML($attributes)
  {
    if (!is_admin()) {
      //Enqueuing scripts and styles here ensures they are only loaded if the block is used
      //The dependency 'wp-element' is the WP version of React
      wp_enqueue_script('quizFrontendScript', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element'));
      wp_enqueue_style('quizFrontendStyle', plugin_dir_url(__FILE__) . 'build/frontend.css');
    }
    ob_start(); ?>

    <div class="anchor">
      <pre style="display:none;"><?php echo wp_json_encode($attributes); ?></pre>
    </div>

<?php return ob_get_clean();
  }
}

//Instantiates the class
$quizblock = new QuizBlock();
