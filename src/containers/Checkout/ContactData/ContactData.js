import React, { Component } from 'react';
import axios from '../../../axios-orders';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';


class ContactData extends Component{
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ""
        },
        loading: false,
    }

    orderHandler = (event) => {
        //event.prevent default prevents form from sending request and reloading page
        event.preventDefault();
        //console.log(this.props.ingredients)
            //alert('You continue!');
        this.setState({loading: true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'daniel strutt',
                address: {
                    street: 'paper street',
                    zipCode: '75015',
                    country: 'France',
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        //Post order to firebase
        axios.post('/orders.json', order)
             //once sent close modal and loading spinner
            .then(response => {
                this.setState({loading: false});
                this.props.history.push('/');
        })
            //if error close modal and loading spinner
            .catch(error => {this.setState({loading: false, purchasing: false});
    });
    }

    render () {
        let form = (
        <form>
            <input className={classes.Input} type='text' name='name' placeholder='Your Name' />
            <input className={classes.Input} type='email' name='email' placeholder='Your Email' />
            <input className={classes.Input} type='text' name='street' placeholder='Street' />
            <input className={classes.Input} type='text' name='postal code' placeholder='Postal Code' />
            <Button btnType='Success' clicked={this.orderHandler}>ORDER</Button>
        </form>);
       
       if (this.state.loading) {
            form = <Spinner/>
        }

        return (
            <div className={classes.ContactData} >
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;