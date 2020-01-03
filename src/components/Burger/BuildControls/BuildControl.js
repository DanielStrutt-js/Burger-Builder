import React from 'react';

import classes from './BuildControl.module.css';

//burger builder buttons for removing or adding ingredients
const buildControl =(props) => (
        <div className={classes.BuildControl}>
            <div className={classes.Label}>{props.label}</div>
            
            <button //remove ingredient button
                className={classes.Less}
                //onclick remove ingredient 
                onClick={props.removed}
                //if number of ingredient is equal to or less than  0 disable button 
                disabled={props.disabled} >Less</button>
            <button //add ingredient button
                className={classes.More} 
                //onclick add ingredient
                onClick={props.added} >More</button>
        </div>

);

export default buildControl;