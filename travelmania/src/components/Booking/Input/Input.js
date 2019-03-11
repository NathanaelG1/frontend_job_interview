import React from 'react';
import styles from './Input.module.css';

const input = (props) => {
let inputElement = null;
const inputClasses = [styles.InputElement];
let validationError = null;
if (props.invalid && props.touched) {
    inputClasses.push(styles.Invalid);
     validationError = <p style={{fontSize: '2rem'}}>Please enter a valid {props.elementConfig.placeholder.toLowerCase()}!</p>;
} 
    


    inputElement = <input 
    className={inputClasses.join(' ')}
     onChange={props.changed} {...props.elementConfig} />;


return (
        <div className={styles.Container}>
        <label>{props.label}</label>
        {inputElement}
        {validationError}
    </div>
)

}

export default input;