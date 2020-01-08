import React from 'react';
import classes from './Order.module.css';

const order = (props) => {
    const ingredients = [];
    //console.log(ingredients)
    //turns ingredients into array of ingrdients
    for(let ingredientName in props.ingredients) {
        ingredients.push(
            {
                name: ingredientName, 
                amount: props.ingredients[ingredientName]
            }
        );
            //console.log(ingredientName)
    }

    const ingredientOutput = ingredients.map(ig => {
        return <span  style={{
                        textTransform: 'capitalize',
                        display: 'inline-block',
                        margin: '0 8px',
                        border: '1px solid #ccc',
                        padding: '5'}}
                        key={ig.name} > {ig.name} ({ig.amount})</span>
    })
   
    return( 
        <div className={classes.Order}>
            <p>Ingredients: {ingredientOutput}</p>
            <p>Price: <strong>USD {Number.parseFloat(props.price).toFixed(2)}</strong></p>
        </div>
    ); 
};

export default order;
