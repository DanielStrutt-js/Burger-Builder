import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component{
    
    state = {

        // number of ingredients in burger

        ingredients: {
            salad:0,
            bacon:0,
            cheese:0,
            meat: 0,
        },
        //total price of burger
        totalPrice: 4,
        //can you buy burger: true or false
        purchasable: false,
        purchasing: false

    }

    updatePurchaseSate (ingredients) {
        
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey]
        }).reduce((sum, el)=>{
            return sum +el;
        }, 0);
        this.setState({purchasable: sum>0})
    }

    //handler for adding ingredients
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients [type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchaseSate(updatedIngredients);
    };



    removeIngredientHandler = (type) =>  {
       
        const oldCount = this.state.ingredients [type];
         //Stop removal of ingredient if no ingredient is there
         if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchaseSate(updatedIngredients);
    };

    //open Modal
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }
    //closeModal
    purchaseCancelHandler = () =>{
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        alert('You continue!');
    }
    
    render() {

        //if ingredient is equal or less than 0 disable info is active
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
            return(
               <Aux>
                   <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                       <OrderSummary ingredients={this.state.ingredients}
                                     price={this.state.totalPrice}
                                     purchaseCanceled={this.purchaseCancelHandler}
                                     purchaseContinued={this.purchaseContinueHandler}
                                      />
                    </Modal>
                   <Burger ingredients={this.state.ingredients} />
                   <BuildControls
                        ingredientAdded={this.addIngredientHandler} 
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice} />
               </Aux>
            );
        }

}


export default BurgerBuilder;