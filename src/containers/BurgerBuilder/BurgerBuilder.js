import React, {Component} from 'react';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import errorHandler from '../../hoc/ErrorHandler/ErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component{
    
    state = {

        // number of ingredients in burger

        ingredients: null,
        //total price of burger
        totalPrice: 4,
        //can you buy burger: true or false
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get('https://react-my-burger-b9ddb.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients: response.data});  
        } )
        .catch(error => {
            this.setState({error:true})
    })
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
    //     //alert('You continue!');
    //     this.setState({loading: true});
    //     const order = {
    //         ingredients: this.state.ingredients,
    //         price: this.state.totalPrice,
    //         customer: {
    //             name: 'daniel strutt',
    //             address: {
    //                 street: 'paper street',
    //                 zipCode: '75015',
    //                 country: 'France',
    //             },
    //             email: 'test@test.com'
    //         },
    //         deliveryMethod: 'fastest'
    //     }
    //     //Post order to firebase
    //     axios.post('/orders.json', order)
    //          //once sent close modal and loading spinner
    //         .then(response => {this.setState({loading: false, purchasing: false})
    //     })
    //         //if error close modal and loading spinner
    //         .catch(error => {this.setState({loading: false, purchasing: false});
    // });

    //loops through ingredients, turnes each ingredient into a string then pushes them into queryParams array
    const queryParams = [];
    for (let i in this.state.ingredients){
        queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    }
    queryParams.push('price=' + this.state.totalPrice)
    //console.log(queryParams)
    //joings each string in queryParams together 
    const queryString = queryParams.join('&');
    //console.log( queryString)
    //takes queryString and adds it to path
    this.props.history.push({
        pathname: '/checkout',
        search: '?'+ queryString
    });

    }
    
    render() {

        //if ingredient is equal or less than 0 disable info is active
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        
        let orderSummary = null;
        
        //if ingredients is null show spinner instead of burger
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>
        if (this.state.ingredients){
            burger = (
                <React.Fragment>     
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                         ingredientAdded={this.addIngredientHandler} 
                         ingredientRemoved={this.removeIngredientHandler}
                         disabled={disabledInfo}
                         purchasable={this.state.purchasable}
                         ordered={this.purchaseHandler}
                         price={this.state.totalPrice} />
                 </React.Fragment>
         );
         orderSummary = <OrderSummary ingredients={this.state.ingredients}
                        price={this.state.totalPrice}
                        purchaseCanceled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}/>
        }
         //if Post request is being sent show loading spinner
         if (this.state.loading){
            orderSummary = <Spinner />
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


export default errorHandler (BurgerBuilder, axios);