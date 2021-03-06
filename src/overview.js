import React from 'react';
import Indirect from './indirect';
import {Link, Router} from 'react-router-dom';

const Overview = (props) => {
  console.log(props);
  
    return (
        <>  
            <div style={{padding:'10px'}}>
                <Link to="/">Back</Link>
            </div>
            
        <div className="Overview" >
            <h1 style={{fontWeight:'400'}}>Hello, {props.location.state.data.name} !</h1>
            <div className="content">
            <ul className="box">
                <h3>Direct Sub</h3>
                {
                  props.location.state.data.directSubs && 
                  props.location.state.data.directSubs.map((el,i)=>{
                        return (
                            
                            <li key={i}>
                                {el}
                            </li>
                        );
                    })
                }
                
            </ul>
           {props.location.state.data.inDirectSubs && <Indirect indirectdata={props}/>} 
                </div>
           <div className="clear">
               
               </div>  
        </div>
        </>
    );

} 

export default Overview;