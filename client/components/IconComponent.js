'use strict';
import React    from 'react';

const IconComponent = ({id, name, avatar, className = 'icon-component', subClassNames = {img: 'avatarImg', name: 'name'}}) => {
  return (
    <div {...{className}}>
      <div className={subClassNames.name}>
        {name}
      </div>
      <div>
        <img {...{
          src: 'images/'+id+'.jpg',
          alt: avatar.alt,
          title: avatar.title,
          className: subClassNames.img
        }}
        />
      </div>
    </div>
  );
}

IconComponent.displayName = 'IconComponent';

export default IconComponent;
