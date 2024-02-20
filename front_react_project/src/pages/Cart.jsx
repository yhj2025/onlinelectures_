import React from 'react'
import { Link } from 'react-router-dom'

const Cart = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div>Cart</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ display: 'inline-block' , margin: '0 10px'}}>사과</p>  
            <p style={{ display: 'inline-block' , margin: '0 10px'}}>오렌지</p>
            <p style={{ display: 'inline-block' , margin: '0 10px'}}>바나나</p>
        </div>
    </div>
    )
}

export default Cart
