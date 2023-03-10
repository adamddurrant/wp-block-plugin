//Global scope function to register a block
wp.blocks.registerBlockType("quizblock/quiz-test", {
  title: "Are you paying attention?",
  icon: "smiley",
  category: "common",
  attributes: {
    skyColor: {
      type: "string",
    },
    grassColor: {
      type: "string",
    },
  },
  //This returns elements in editor
  edit: function (props) {
    function updateSkyColor(e) {
      props.setAttributes({ skyColor: e.target.value });
    }
    function updateGrassColor(e) {
      props.setAttributes({ grassColor: e.target.value });
    }
    return (
      <div>
        <input
          type='text'
          placeholder='sky color'
          onChange={updateSkyColor}
          value={props.attributes.skyColor}
        />
        <input
          type='text'
          value={props.attributes.grassColor}
          placeholder='grass color'
          onChange={updateGrassColor}
        />
      </div>
    );
  },
  save: function (props) {
    //This returns elements on actual front-end
    return (
      <div>
        <p>
          The sky colour is{" "}
          <span className='sky-color'>{props.attributes.skyColor}</span> and the
          grass colour is {props.attributes.grassColor}
        </p>
      </div>
    );
  },
});
