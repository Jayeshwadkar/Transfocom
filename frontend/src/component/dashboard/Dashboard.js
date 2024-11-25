import React from 'react';
import MarketingDash from './MarketingDash';
import ProductionDash from './ProductionDash';
import './dashboard.css'
import StockDash from './StockDash';
const Dashboard = () => {
    



    return (
        <>         
        <div style={{backgroundColor:'#ffff'}}>   
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', }}>              
                <div style={{ width: '640px', height: '400px'}}>
                <MarketingDash/>
                </div>
                <div style={{ width: '700px', height: '400px'}}>
                <ProductionDash/>
                </div>
            </div>   
            <div style={{marginLeft:'10%'}}>  
            <StockDash/>    
            </div>
            </div>
        </>
    );
};

export default Dashboard;
