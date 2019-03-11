import React from 'react';
import logo from '../../img/footerLogo.png';
import styles from './Footer.module.css';

const footer = (props) => {
    return (
    <div className={styles.footer}>
        <img 
        src={logo} 
        alt="Travelmania"
        className={styles.footerLogo}
        ></img>
        </div>
    );
}

export default footer;