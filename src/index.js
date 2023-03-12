//ADMIN VARIANT OF COMPONENT
import {
  TextControl,
  Flex,
  FlexBlock,
  FlexItem,
  Button,
  Icon,
  PanelBody,
  PanelRow,
} from "@wordpress/components";
import "./index.scss";
import {
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
} from "@wordpress/block-editor";
import { ChromePicker } from "react-color";

//This is an immediately invoked function expression (note the syntax)
(function () {
  //This invokes every time data changes on the block editor as a whole
  //This is being used to block the update button if a correct answer is not selected on one or more quiz blocks
  let locked = false;

  wp.data.subscribe(function () {
    const blockResults = wp.data
      .select("core/block-editor")
      .getBlocks()
      .filter(function (block) {
        return (
          block.name == "quizblock/quiz-test" &&
          block.attributes.correctAnswer == undefined
        );
      });
    console.log(blockResults);

    if (blockResults.length && locked == false) {
      locked = true;
      //lock the post
      wp.data.dispatch("core/editor").lockPostSaving("noanswer");
      //Add an error message
      wp.data
        .dispatch("core/notices")
        .createNotice(
          "error",
          "Please select a correct answer in the quiz block",
          {
            id: "noanswer",
            isDismissible: false,
          }
        );
    }
    if (!blockResults.length && locked) {
      locked = false;
      //unlock the post
      wp.data.dispatch("core/editor").unlockPostSaving("noanswer");
      //remove error message
      wp.data.dispatch("core/notices").removeNotice("noanswer");
    }
  });
})();

//Global scope function to register a block and its attributes
wp.blocks.registerBlockType("quizblock/quiz-test", {
  title: "Are you paying attention?",
  icon: "smiley",
  category: "common",
  example: {
    //Shows a preview of component in WP
    attributes: {
      question: "What colour is the sky on a clear day?",
      correctAnswer: 2,
      answers: ["red", "green", "blue"],
      alignment: "left",
      bgColor: "#ebebeb",
    },
  },
  description: "An in-content quiz to keep your readers engaged.",
  attributes: {
    question: {
      type: "string",
    },
    answers: {
      type: "array",
      default: [""],
    },
    correctAnswer: {
      type: "number",
      default: undefined,
    },
    bgColor: {
      type: "string",
      default: "#EBEBEB",
    },
    alignment: {
      type: "string",
      default: "left",
    },
  },
  //This returns elements in editor
  edit: EditComponent,
  //This returns elements on actual front-end
  save: function (props) {
    return null;
  },
});

//Wordpress UI Component
function EditComponent(props) {
  function handleQuestion(value) {
    props.setAttributes({ question: value });
  }

  function deleteAnswer(indexToDelete) {
    const newAnswers = props.attributes.answers.filter(function (x, index) {
      return index != indexToDelete;
    });
    props.setAttributes({ answers: newAnswers });
    if (indexToDelete == props.attributes.correctAnswer) {
      props.setAttributes({ correctAnswer: undefined });
    }
  }

  function markAsCorrect(index) {
    props.setAttributes({ correctAnswer: index });
  }

  return (
    <div
      className='edit-block'
      style={{ backgroundColor: props.attributes.bgColor }}
    >
      <BlockControls>
        <AlignmentToolbar
          value={props.attributes.alignment}
          onChange={(val) => props.setAttributes({ alignment: val })}
        />
      </BlockControls>
      <InspectorControls>
        {/* This allows us to add a control in the right panel of Wordpress */}
        <PanelBody title='Background Colour' initialOpen={true}>
          <PanelRow>
            <ChromePicker
              disableAlpha={true}
              color={props.attributes.bgColor}
              onChangeComplete={(val) => {
                props.setAttributes({ bgColor: val.hex });
              }}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <TextControl
        label={"Question:"}
        style={{ fontSize: "20px" }}
        value={props.attributes.question}
        onChange={handleQuestion}
      />
      <p style={{ fontSize: "13px", margin: "20px 0 8px 0" }}>Answers:</p>
      {props.attributes.answers.map(function (answer, index) {
        return (
          <Flex>
            <FlexBlock>
              <TextControl
                autoFocus={answer == undefined}
                value={answer}
                onChange={(newValue) => {
                  const newAnswers = props.attributes.answers.concat([]);
                  newAnswers[index] = newValue;
                  props.setAttributes({ answers: newAnswers });
                }}
              />
            </FlexBlock>
            <FlexItem>
              <Button onClick={() => markAsCorrect(index)}>
                <Icon
                  icon='marker'
                  className={
                    props.attributes.correctAnswer == index
                      ? "marker-correct"
                      : "marker"
                  }
                />
              </Button>
            </FlexItem>
            <FlexItem>
              <Button
                onClick={() => deleteAnswer(index)}
                className='mark-as-delete'
              >
                Delete
              </Button>
            </FlexItem>
          </Flex>
        );
      })}
      <Button
        onClick={() => {
          if (props.attributes.answers.length <= 5) {
            props.setAttributes({
              answers: props.attributes.answers.concat([""]),
            });
          }
          undefined;
        }}
        variant='primary'
        style={{ marginTop: "10px" }}
        className={props.attributes.answers.length == 6 ? " tooMany" : ""}
      >
        Add another answer
      </Button>
    </div>
  );
}
