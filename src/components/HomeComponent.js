import React, { useState, useContext } from 'react';

import MyCollection from './MyCollections';
import CollectionExpandedView from './CollectionExpandedView';

import { CollectionsContext } from '../context/CollectionsContext';

const HomeComponent = props => {
    const user = props.user
    const currentCollection = useContext(CollectionsContext).currentCollection

    if(currentCollection === null) {
        return (
            <div>
                <MyCollection user={user}/>
            </div>
        );
    }
    else { 
        return (
            <div>
                <MyCollection user={user}/>
                <CollectionExpandedView userId={user?.id}/>
            </div>
        );
    }
}

export default HomeComponent;