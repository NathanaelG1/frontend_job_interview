import React from 'react';
import styles from './Flights.module.css';

 const flights = (props) => {

    return (   
        <ul className={styles.list}>
        <li className={styles.list_li1}>{props.airline}</li>
        <li className={styles.list_li2}>${props.cost.toFixed(2)}</li>
        <li className={styles.list_li1}>{props.departureLocation}
            <p className={styles.splitCell} >{props.departureTime}</p></li>
        <li className={styles.list_li2}>{props.departureDate}</li>
        <li className={styles.list_li2}>{props.destination}
            <p className={styles.splitCell2}>{props.arrivalTime}</p></li>
        <li className={styles.list_li2}>{props.arrivalDate}</li>
        <li className={styles.list_li1}>{props.flightNumber}</li>
    </ul>
    )
 
   
}

export default flights;