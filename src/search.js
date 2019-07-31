import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Overview from "./overview";
import Suggestion from "./suggestion";
import "./App.css";
let empData = null;
let indirectArray = [];
class Search extends Component {
  state = {
    query: "",
    result: [],
    searchResult: null,
    noSubordinates: false,
    dataLoadDirect: false,
    dataLoadIndirect: false,
    noDataFound: false
  };
  getInfo = () => {
    axios
      .get("http://api.additivasia.io/api/v1/assignment/employees")
      .then(res => {
        console.log(res);
        this.setState({ result: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };
  handleInputChange = e => {
    e.preventDefault();
    this.setState({ query: e.target.value });
    //     ,
    //     () => {
    //     if (this.state.query && this.state.query.length > 1) {
    //       if (this.state.query.length % 2 === 0) {
    //         this.getInfo()
    //       }
    //     } else if (!this.state.query) {
    //     }
    //   });
  };
  getEmpData = async e => {
    e.preventDefault();
    if (indirectArray.length > 0) {
      indirectArray = [];
    }

    const fetchSubOrdinated = async name => {
      return await axios
        .get(`http://api.additivasia.io/api/v1/assignment/employees/${name}`)
        .then(res => {
          if (res.data[1]) {
            return {
                data : res.data[1]["direct-subordinates"]
            }
          }
          return {
              data : [],
              status : 'No SubOrdinated Present'
          };
        }).catch(err => {
          if (err.response) {
            if (err.response.status === 404) {
              return {
                  data: [],
                  status : 'Error'
              }
            }
          }
        });
    };


    const strctData = {
        name: this.state.query,
        directSubs : (await fetchSubOrdinated(this.state.query)).data,
        inDirectSubs: []
    }

    for(let i =0; i< strctData.directSubs.length; i++){
        strctData.inDirectSubs = [...strctData.inDirectSubs, ...(await fetchSubOrdinated(strctData.directSubs[i])).data ]
    }

    strctData.inDirectSubs.forEach(async item=>{
        const moreInDirect = (await fetchSubOrdinated(item)).data
        if(moreInDirect && moreInDirect.length>0){
            strctData.inDirectSubs = [...strctData.inDirectSubs, ...moreInDirect]
        }
    })

    strctData.inDirectSubs = [...new Set(strctData.inDirectSubs)]
    
    setTimeout(()=>{
        this.setState({searchResult: strctData});
    },500); 
  };

  render() {
    return (
      <>
        <div className="App">
          <form onSubmit={this.getEmpData}>
            <input
              className="input-text"
              placeholder="Enter employee name"
              value={this.state.query}
              onChange={this.handleInputChange}
              autoComplete="on"
            />

            <button className="search-btn">Search</button>
            {/* <Suggestion results={this.state.result}/> */}
          </form>
        </div>
        {this.state.noDataFound && (
          <h3 style={{ textAlign: "center" }}>No Data Found...</h3>
        )}
        {this.state.noSubordinates && (
          <h2 style={{ textAlign: "center" }}>No Subordinates</h2>
        )}

        {this.state.searchResult &&
          this.props.history.push("/overview", { data: this.state.searchResult })}
      </>
    );
  }
}

export default withRouter(Search);
