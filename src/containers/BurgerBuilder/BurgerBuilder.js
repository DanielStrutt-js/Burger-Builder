import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

import Spinner from '../../components/UI/Spinner/Spinner';
import errorHandler from '../../hoc/ErrorHandler/ErrorHandler';
import * as burgerBuilderActions from '../../store/actions/index';



class BurgerBuilder extends Component{
    
    state = {
        purchasing: false,
        
    }

    componentDidMount () {
        this.props.onInitIngredients();
    }

    updatePurchaseSate (ingredients) {
        
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey]
        }).reduce((sum, el)=>{
            return sum +el;
        }, 0);
        return sum > 0;
    }

    //handler for adding ingredients
    

    //open Modal
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }
    //closeModal
    purchaseCancelHandler = () =>{
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');

    }
    
    render() {

        //if ingredient is equal or less than 0 disable info is active
        const disabledInfo = {
            ...this.props.ing
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        
        let orderSummary = null;
        
        //if ingredients is null show spinner instead of burger
        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner/>

        if (this.props.ings){
            burger = (
                <React.Fragment>     
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                         ingredientAdded={this.props.onIngredientAdded} 
                         ingredientRemoved={this.props.onIngredientRemove}
                         disabled={disabledInfo}
                         purchasable={this.updatePurchaseSate(this.props.ings)}
                         ordered={this.purchaseHandler}
                         price={this.props.price} />
                 </React.Fragment>
         );
         orderSummary = <OrderSummary ingredients={this.props.ings}
                        price={this.props.price}
                        purchaseCanceled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}/>
        }
        
        
            return(
               <React.Fragment>
                   <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                       {orderSummary}
                    </Modal>
                    {burger}
                   
               </React.Fragment>
            );
        }

}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice,
        error: state.error
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemove: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(errorHandler (BurgerBuilder, axios));