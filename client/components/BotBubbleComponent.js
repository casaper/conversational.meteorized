'use strict';

import React    from 'react';


const BotBubbleComponent = ({text, templateVars, className = 'botsinglebubble-component', subClassNames = {txtContainer: 'text'}}) => {
  // ToDo: Template engine implementation
  // for now: vars to fill in with template string in eval
  const {name, email, fieber, persons} = templateVars;
  return (
    <div {...{className}}>
      <div className={subClassNames.txtContainer}>
        {eval('`' + text + '`')}
      </div>
    </div>
  );
}

BotBubbleComponent.displayName = 'BotBubbleComponent';


export default BotBubbleComponent;
