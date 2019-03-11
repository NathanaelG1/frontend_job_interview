import React, { Component } from 'react';
import styles from './Booking.module.css';
import axios from 'axios';
import Flights from './Flights/Flights';
import Aux from 'react-aux';
import Input from './Input/Input';
import moment from 'moment';
import airports from 'airport-codes';


export default class Booking extends Component {

 

    state = {
        orderAttempted: false,
        orderSuccessful: false,
        orderConfirmation: '',
        orderFailedMessage: '',
        flightData: [],
        orderTicket: null,
        placeOrderForm: {
        firstName: {
            label: '',
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'First Name'
            },
            value: '',
            validation: {
                required: true,
                minLength: 3
            },
            valid: false,
            touched: false,
        },
        lastName: {
            label: '',
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Last Name'
            },
            value: '',
            validation: {
                required: true,
                minLength: 3
            },
            valid: false,
            touched: false,
            
        },
        bags: {
            label: '',
            elementType: 'input',
            elementConfig: {
                type: 'number',
                placeholder: '# of bags'
            },
            value: '',
            validation: {
                required: true,
                type: 'bags'
            },
            valid: false,
            touched: false,
        }
    }
}

    componentWillMount() {
        axios.get('/flights')
        .then(flights => {
            const flightData = flights.data.flights;
            console.log(flightData);
            this.setState({
                flightData: flightData
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    orderTicket(flightInfo) {
        let formattedData = [];
        formattedData.push({
            airline: flightInfo.airline,
            cost: flightInfo.cost,
            departureDate: moment(flightInfo.departs.when).format('dddd, MMMM Do YYYY'),
            departureTime: moment(flightInfo.departs.when).format('h:mm a'),
            departureLocation: airports.findWhere({iata: flightInfo.departs.airport}).get('name'),
            destination: airports.findWhere({iata: flightInfo.arrives.airport}).get('name'),
            arrivalDate: moment(flightInfo.arrives.when).format('dddd, MMMM Do YYYY'),
            arrivalTime: moment(flightInfo.arrives.when).format('h:mm a'),
            flightNumber: flightInfo.number ,
        })
        this.setState({orderTicket: formattedData});
        const orderPage = document.getElementById('orderPage');
        orderPage.style.display = "block";
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        if (rules.type === 'email') {
    
            if (!value.includes("@", 3)) {
                isValid = false;
            } else if (!value.includes(".com", (value.length - 4))) {
                isValid = false;
            }
    
            }

        if (rules.type === 'bags') {
            if (value < 1){
                isValid = false;
            }
        }
        
        return isValid;
    }

    inputChangedHandler(event, inputIdentifier) {
        const updatedElement = this.state.placeOrderForm[inputIdentifier];
        const updatedForm = this.state.placeOrderForm;
        updatedElement.value = event.target.value;
        updatedElement.isValid = this.checkValidity(updatedElement.value, updatedElement.validation);
        updatedElement.touched = true;
        updatedForm[inputIdentifier] = updatedElement;
        this.setState({
            placeOrderForm: updatedForm
        })
    }

    validateForm() {
        
            let formValid = true;
        
            for (let key in this.state.placeOrderForm) {
                if (!this.state.placeOrderForm[key].isValid) {
                    console.log(this.state.placeOrderForm[key].isValid)
                    formValid = false;
                }
            }    
            return formValid;
        }
    

    placeOrder(flightNumber) {
        if (this.validateForm()){
            const reqBody = {
              "first_name": this.state.placeOrderForm.firstName.value.toString(),
              "last_name": this.state.placeOrderForm.lastName.value.toString(),
              "flight_number": flightNumber.toString(),
              "bags": this.state.placeOrderForm.bags.value,
            }
            axios.post('/book', reqBody)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        orderAttempted: true,
                        orderSuccessful: true,
                        orderConfirmation: response.data.confirmation
                    });
                } else {
                    this.setState({
                        orderAttempted: true,
                        orderFailedMessage: response.data.message
                    });
                }
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            alert("Please correct any errors in your input, then try again.");
        }
    }



    closeOrderPage() {
        const orderPage = document.getElementById('orderPage');
        orderPage.style.display = "none";  
        this.setState({
            orderAttempted: false,
            orderSuccessful: false
        });  
    }


    render() {
        const orderPage = document.getElementById('orderPage');
        window.onclick = (event) => {
            if (event.target === orderPage) {
              this.closeOrderPage();
            }
          }

        let orderSummary = '';
        if (this.state.orderTicket) {
            const ticket = this.state.orderTicket[0];
            let inputElementsArray = [];
            for (let key in this.state.placeOrderForm) {
                inputElementsArray.push({
                    id: key,
                    config: this.state.placeOrderForm[key]
                })
            }

        
        if (!this.state.orderAttempted && !this.state.orderSuccessful)  {
                orderSummary = (
                <Aux>
                <p>From: {ticket.departureLocation}</p>
                <p>To: {ticket.destination}</p>
                {ticket.departureDate === ticket.arrivalDate ?
                 <p>Departure Date: {ticket.departureDate}</p>
                :
                <p>{ticket.departureDate} - {ticket.arrivalDate}</p>
                }
                <p>{ticket.departureTime} - {ticket.arrivalTime}</p>
                <p>Total: ${ticket.cost.toFixed(2)}</p>

                <div className={styles.orderForm}>
                {inputElementsArray.map((input, index) => {
                    return (
                        <Input
                        className={styles.input}
                        key={index.toString()}
                        invalid={!input.config.isValid}
                        elementType={input.config.elementType}
                        elementConfig={input.config.elementConfig}
                        value={input.config.value} 
                        label={input.config.label}
                        touched={input.config.touched}
                        changed={(event) => this.inputChangedHandler(event, input.id)}
                            ></Input>
                    );

                })}
                <button id="orderTicket" 
                        className={styles.orderTicket}
                        onClick={()=>this.placeOrder(ticket.flightNumber)}>Order Ticket</button>
                </div>
                </Aux>
            )
        } else if (this.state.orderAttempted && this.state.orderSuccessful) {
                orderSummary = (
                    <Aux>
                    <p>From: {ticket.departureLocation}</p>
                    <p>To: {ticket.destination}</p>
                    {ticket.departureDate === ticket.arrivalDate ?
                     <p>Departure Date: {ticket.departureDate}</p>
                    :
                    <p>{ticket.departureDate} - {ticket.arrivalDate}</p>
                    }
                    <p>{ticket.departureTime} - {ticket.arrivalTime}</p>

                    <h3>Thanks for ordering with Travelmania! Your order has been confirmed,
                        confirmation number: {this.state.orderConfirmation}
                    </h3>

                    </Aux>
                );
            } else if (this.state.orderAttempted && !this.state.orderSuccessful) {
                orderSummary = (
                    <Aux>
                    <p>From: {ticket.departureLocation}</p>
                    <p>To: {ticket.destination}</p>
                    {ticket.departureDate === ticket.arrivalDate ?
                     <p>Departure Date: {ticket.departureDate}</p>
                    :
                    <p>{ticket.departureDate} - {ticket.arrivalDate}</p>
                    }
                    <p>{ticket.departureTime} - {ticket.arrivalTime}</p>

                    <h3>Sorry, your order could not be completed. {this.state.orderFailedMessage}
                     Please try a different flight.</h3>

                    </Aux>
                );
               
            }

        }

        const menu = (
            <div className={styles.menuWrapper}>
            <h1 className={styles.menuHeader}>Please select your preferred flight:</h1>
            <div className={styles.ticketHeader}>
                <p className={styles.ticketHeader_p1}>Airline</p>
                <p className={styles.ticketHeader_p2}>Cost</p>
                <div className={styles.ticketHeader_dcontainer}>
                <h3 style={{width: '100%'}}>Departing</h3>
                <p className={styles.ticketHeader_dcontainer_p1}>From</p>
                <p className={styles.ticketHeader_dcontainer_p2}>At</p>
                    </div>
                <p className={styles.ticketHeader_p2}>Departure Date</p>
                <div className={styles.ticketHeader_acontainer}>
                <h3 style={{width: '100%'}}>Arriving</h3>
                <p className={styles.ticketHeader_acontainer_p1}>At</p>
                <p className={styles.ticketHeader_acontainer_p2}>By</p>
                    </div>
                <p className={styles.ticketHeader_p2}>Arrival Date</p>
                <p className={styles.ticketHeader_p1}>Flight No.</p>
                </div>
            {this.state.flightData ?
                this.state.flightData.map((flights, index) => {
                const departureSplit = flights.departs.when.split('T');
                const arrivalSplit = flights.arrives.when.split('T');
                    return (
                        <div className={styles.flightCard}
                             onClick={()=>this.orderTicket(flights)} key={index}>
                    <Flights
                        key={index}
                        airline={flights.airline}
                        cost={flights.cost}
                        departureDate={departureSplit[0]}
                        departureTime={moment(flights.departs.when).format('h:mm a')}
                        departureLocation={flights.departs.airport}
                        destination={flights.arrives.airport}
                        arrivalDate={arrivalSplit[0]}
                        arrivalTime={moment(flights.arrives.when).format('h:mm a')}
                        flightNumber={flights.number}                        
                        ></Flights>
                        </div>
                    )
                })
               
            :
            <h2>Loading...</h2>
            }
            <div id="orderPage" className={styles.orderPage}>
            <div className={styles.orderPage_content}>
            <span onClick={this.closeOrderPage.bind(this)} className={styles.close}>&times;</span>
                    {orderSummary}
                </div>
                </div>
            </div>
        )
        return menu;

    }
}