// Styles
require('normalize.css/normalize.css');
require('../styles/Main.scss');

import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Scroll   from 'smoothscroll';

import Logs from '../../collections/Logs.js';

// JSON data beeing imported
import Defaults     from './defaults.json';
import Conversation from './conversation.json';

// Components
import BotPartComponent          from './BotPartComponent.js';
import BotPartPastComponent      from './BotPartPastComponent.js';
import ClientAnswerComponent     from './ClientAnswerComponent.js';
import ClientAnswerPastComponent from './ClientAnswerPastComponent.js';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      path: 'init',
      templateVars: {
        name:   null,
        email:  null,
        fieber: null,
        persons: Defaults.persons
      }
    };
    this.conversationLog = [];
    this.Conversation    = Conversation;

    // bind this to Callbacks
    this.updatePathState = this.updatePathState.bind(this);
    this.handleInputfieldEnter = this.handleInputfieldEnter.bind(this);
    this.handleForwardTimeout = this.handleForwardTimeout.bind(this);
  }


  componentDidUpdate() {
    const answerBottom = document.getElementsByClassName('conversation-part')[0].lastChild;
    Scroll(answerBottom);

  }

  componentDidMount() {
  }

  /**
   * Callbacks
   */


  handleForwardTimeout({index, time = 2000}) {
    // create propper path info for the log
    const params = {index, path: this.Conversation[this.state.path].user.answers[0].path};
    this.forwardTimeoutId = setTimeout(() => {
      this.updatePathState(null, params)
    }, time, this, params);
  }


  /**
   * Callbacks for Client Bubbles
   */
  updatePathState(evt, {path, index = null}) {
    // put the paths actual state to the log
    const entry = {
      stateAtPos: JSON.stringify(this.state),
      index
    };
    this.conversationLog.push(entry);
    // trigger next path
    this.setState({path: path});
  }

  handleInputfieldEnter({evt, path, index, changeVal}) {
    /* ToDo: chrome complains about this enter detection beeing deprecated */
    if(evt.key === 'Enter') {

      // make the state change dynamicly
      let templateVars = {
        name:   this.state.templateVars.name,
        email:  this.state.templateVars.email,
        fieber: this.state.templateVars.fieber,
        persons: Defaults.persons
      };
      templateVars[changeVal] = evt.target.value;
      this.conversationLog.push({
        stateAtPos: JSON.stringify({path: this.state.path, templateVars: this.state.templateVars, usersInput:  evt.target.value}),
        index
      });
      this.setState({path, templateVars});
    }
  }

  render() {
    const {botHere} = this.state;
    return (
      <div className="Main">
        <div className="conversation-bubbles">
          { this.renderPastPart(this.conversationLog) }
          <span  className="activePart">
            { this.renderBotPart({bots: Conversation[this.state.path].bots, style: this.botPartStyle}) }
          </span>
          <div className="clientAnswerTarget"></div>
        </div>
        <div className="conversation-part">
          <ClientAnswerComponent {...{
            answers: Conversation[this.state.path].user.answers,
            botHere,
            callbacks: {
              updatePathState:       this.updatePathState,
              handleForwardTimeout:  this.handleForwardTimeout,
              handleInputfieldEnter: this.handleInputfieldEnter
            },
            style: this.answerStyle
          }} />
        </div>
      </div>
    );
  }


  /**
   * Bot Bubble render
   */
  renderBotPart({bots, style, subClassnames = { BotPartComponent: 'botbubble-component'}}) {
    // map bots - > there can be more than one bot part.
    return bots.map(({id, texts}, key) => {

      /* Handle random bot text */
      texts = texts.map((text, textKey) => {
        if(!Array.isArray(text)) { // if it isn't an array there is only one option
          return text;
        } else {  // arrays contain different options for randomness
          // overwrite the Conversation thing with the actual so that
          // the log will render the random choice displaying the past
          this.Conversation[this.state.path].bots[key].texts[textKey] = text[Math.floor(Math.random()*text.length)];
          return this.Conversation[this.state.path].bots[key].texts[textKey];
        }
      });
      /* END Handle random bot text */

      return (
        <BotPartComponent key={key} {...{
          texts,
          index:        key,
          className:    subClassnames.BotPartComponent,
          botIdentity:  Defaults.botIdentitys[id],
          templateVars: this.state.templateVars,
          style
        }} />
      );
    });
  }

  /**
   * The past Conversation is beeing rendered with the this.conversationLog property
   */
  renderPastPart(
    conversation,
    className = 'conversation-part-past',
    subClassNames = {
      BotPartPastComponent: 'botpartpast-component',
      ClientAnswerPastComponent: 'user-answers-past'
    }
  ) {
    return conversation.map((step, stepKey) => {
      const stateAtPos = JSON.parse(step.stateAtPos); // get the striggified state from the past
      return (
        <div {...{className}} key={'conv_'+stepKey} >
          <BotPartPastComponent key={stepKey} {...{
            path:         stateAtPos.path,
            className:    subClassNames.BotPartPastComponent,
            bots:         Conversation[stateAtPos.path].bots,
            templateVars: stateAtPos.templateVars,
            botIdentitys: Defaults.botIdentitys
          }} />

          <ClientAnswerPastComponent key={'client_'+stepKey} {...{
            stepKey,
            answer:    this.Conversation[stateAtPos.path].user.answers,
            index: step.index,
            stateAtPos,
            className: subClassNames.ClientAnswerPastComponent
          }} />
        </div>
      );
    });
  }

  renderBotPartsPast({
    bubbles,
    templateVars,
    subClassNames = {
      BotPartPastComponent: 'botbubblepast-component'
    }
  }) {
    return bubbles.map(({id, texts}, key) => {
      return (
        <BotPartPastComponent {...{
          texts,
          templateVars,
          index:       key,
          className:   subClassNames.BotPartPastComponent,
          botIdentity: Defaults.botIdentitys[id]
        }} />
      );
    });
  }
}

App.propTypes = {
  logs: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('logs');

  return {
    logs: Logs.find({}).fetch()
  };
}, App);
