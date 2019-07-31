import React from "react";

const Indirect = props => {
  console.log("indirect:" + JSON.stringify(props));

  return (
    <ul className="box">
      <h3>Indirect Sub</h3>

      {props.indirectdata.location.state.data.inDirectSubs &&
        props.indirectdata.location.state.data.inDirectSubs.map((el, i) => {
          return <li key={i}>{el}</li>;
        })}
    </ul>
  );
};

export default Indirect;
