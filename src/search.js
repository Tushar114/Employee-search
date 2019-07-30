import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Overview from './overview';
import Suggestion from './suggestion';
import './App.css';
let empData = {};
let indirectArray = [];
class Search extends Component {

    state = {
        query: '',
        result:[],
        searchResult: [],
        noSubordinates: false,
        dataLoadDirect: false,
        dataLoadIndirect: false,
        noDataFound: false
    }
     getInfo = () => {
        axios.get('http://api.additivasia.io/api/v1/assignment/employees')
        .then(res=>{
            console.log(res);
            this.setState({result: res.data});
        }).catch(err=>{
            console.log(err);
        });
    }
    handleInputChange = (e) => {
        e.preventDefault();
        this.setState({query: e.target.value});
        //     , 
        //     () => {
        //     if (this.state.query && this.state.query.length > 1) {
        //       if (this.state.query.length % 2 === 0) {
        //         this.getInfo()
        //       }
        //     } else if (!this.state.query) {
        //     }
        //   });
    }
    getEmpData = (e) => {
        e.preventDefault();
        if(indirectArray.length>0){
            indirectArray = [];
        }
        axios.get(`http://api.additivasia.io/api/v1/assignment/employees/${this.state.query}`)
        .then(res => {
            if(res.data[1]){
                empData['name'] = this.state.query;
                debugger;
                empData['directSub'] = res.data[1]["direct-subordinates"];
                let response = res.data[1]["direct-subordinates"];
                response.forEach((el)=>{
                    this.getSubData(el);
                }); 
               
                   
            }else{
                this.setState({noSubordinates:true});
            }
            
        
           
        }).catch(err=>{
            if(err.response){
                if(err.response.status=== 404){
                    this.setState({noDataFound: true});
                }
            }
        });
    }  

    getSubData = (name) => {
        axios.get(`http://api.additivasia.io/api/v1/assignment/employees/${name}`)
        .then(res => {
            debugger;
             // console.log('SubData:'+JSON.stringify(res.data));
              //console.log('indirect:'+ res.data[1]["direct-subordinates"] );
             if(res.data[1]){
              indirectArray.push(...res.data[1]["direct-subordinates"])
              empData['indirectSub'] = indirectArray;
             
              setTimeout(()=>{
                this.setState({dataLoadDirect: true});
              },250);             
             }else{
                 this.setState({dataLoadDirect: true});
             }
              
        }).catch(err=>{
            console.log(err);
        })
    } 
    render(){
    
        return(
            <>
            <div className="App">
            
                <form onSubmit={this.getEmpData}>
                <input className="input-text"
                    placeholder="Enter employee name"
                    value={this.state.query}
                    onChange={this.handleInputChange}
                    autoComplete="on"
                />
                
                <button className="search-btn">Search</button>
                {/* <Suggestion results={this.state.result}/> */}
                </form>
                
            </div>
            {this.state.noDataFound && <h3 style={{textAlign:'center'}}>No Data Found...</h3>}
            {this.state.noSubordinates && <h2 style={{textAlign:'center'}}>No Subordinates</h2>}
            
            {this.state.dataLoadDirect && this.props.history.push('/overview', {data: empData})}
            </>
        );
    }

}

export default withRouter(Search);