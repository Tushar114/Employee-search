import React from 'react';

const Indirect = (props) => {
    
    return (
        <ul className="box">
                <h3>Indirect Sub</h3>

                {
                    props.indirectdata.location.state.data.indirectSub &&
                    props.indirectdata.location.state.data.indirectSub.map((el,i)=>{
                        return (
                            
                            <li key={i}>
                                {el}
                            </li>
                        );
                    })
                }
            </ul>
    
    );

}

export default Indirect;