import React, { Component } from 'react';
import Aux from 'react-aux';
import headerPhoto from '../../img/logo.jpg';
import styles from './Header.module.css';

export default class Header extends Component { 

render() {
    const header = <header className={styles.header}>
            <img
                src={headerPhoto}
                alt=""
                className={styles.headerPhoto}         
                >            
            </img>

        </header>

    return (
        <Aux>
        {header}
        </Aux>
    );
}

}