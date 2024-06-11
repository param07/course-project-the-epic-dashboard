import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import "./LoginComponent.css"
import logo from '../images/homeProject.jpg'

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

class LoginComponent extends Component {

  constructor(props) {
    super(props);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleCreateUserSubmit = this.handleCreateUserSubmit.bind(this);
  }

  state = {
    showCreateUserForm: false,
  };

  handleClick = (e) => {
    const form = document.forms.loginDetails;
    form.username.value = "";
    form.password.value = "";
    this.setState({
      showCreateUserForm: true,
    });
    e.preventDefault();
  };

  handleBackClick = (e) => {
    const form = document.forms.createUserDetails;
    form.usernameadd.value = "";
    form.passwordadd.value = "";
    this.setState({
      showCreateUserForm: false,
    });
    e.preventDefault();
  };
  
  async createUser(userDetails,form) {
    const query = `mutation addmutation($userDetails: InputUser!){
        addUser(userDetails:$userDetails)
      }`;
      const res = await graphQLFetch(query,{userDetails});
      if(res.addUser){
        form.usernameadd.value = "";
        form.passwordadd.value = "";
        alert("User Created Successfully");
        //this.loadData();
      }else{
        alert("The user with this username already exists");
      }
  }

  async loginUser(loginDetails,form) {
    const query = `query getUser($loginDetails: LoginDetails!) {
      getUser(loginDetails: $loginDetails) {
        id
        username
      }
    }`;
    const res = await graphQLFetch(query, {loginDetails});
    console.log(res)
    if (res.getUser && res.getUser.username && res.getUser.username!="") {
      console.log("welcome user", res.getUser.username, res.getUser.id)
      localStorage.setItem("username", res.getUser.username)
      localStorage.setItem("userid", res.getUser.id)
      this.props.dispatch(push('/home'))
    } else {
      alert('Invalid username or password');
    }
  }

  handleLoginSubmit(e) {    
    e.preventDefault();
    const form = document.forms.loginDetails;
    if(form.username.value==""){
      alert("Please enter Userame")
    }else if(form.password.value==""){
      alert("Please enter Password")
    }else{
      const loginDetails = {
        username: form.username.value,
        password: form.password.value,
      }
      this.loginUser(loginDetails,form);
    }
    //this.dispatch(push('/home'));
  }

  handleCreateUserSubmit(e) {
    e.preventDefault();
    const form = document.forms.createUserDetails;
    if(form.usernameadd.value==""){
      alert("Please enter Userame")
    }else if(form.passwordadd.value==""){
      alert("Please enter Password")
    }else{
      const userDetails = {
        username: form.usernameadd.value,
        password: form.passwordadd.value,
        createDateTime:new Date(),
      };
      this.createUser(userDetails, form);
    }
    //loginUser(loginDetails,form);
    //this.dispatch(push('/home'));
  }

  render() {
    const { showCreateUserForm } = this.state;

    const createForm = (
      <div className='login-page-login-container'>
      <h3 style={{textAlign:"center", marginBottom:"20px"}}>User Creation</h3>
      <form name="createUserDetails" onSubmit={this.handleCreateUserSubmit}>
      <div style={{textAlign:"center"}}>
      </div>
      <div className="form-group">
        <label htmlFor="usrCreate">* Userame:</label>
        <input type="text" name="usernameadd" className="form-control" style={{ width: '50%' }} id="usrCreate" />
      </div>
      <div className="form-group">
        <label htmlFor="pwdCreate">* Password:</label>
        <input type="password" name="passwordadd" className="form-control" style={{ width: '50%' }} id="pwdCreate" />
      </div>
      <div className="button-container">
        <button type="submit" id="createUserSubmit" name="createUserSubmitButton" className="btn btn-default" style={{ background: 'red', color: 'white' }}>Add</button>
        <button className="btn btn-default" onClick={this.handleBackClick} style={{background:"red",color:"white"}}>Back</button>
      </div>
      <div>
        <p style={{paddingTop:"2%"}}>* Click Add to add a new user. Click Back to go to User Login Page</p>
      </div>
    </form>
    </div>
    )

    const loginForm =(
      <div className='login-page-login-container'>
      <h3 style={{textAlign:"center", marginBottom:"20px"}}>User login</h3>
      <form name="loginDetails" onSubmit={this.handleLoginSubmit}>
      <div style={{textAlign:"center"}}>
      </div>
      <div className="form-group">
        <label htmlFor="usrLogin">* Userame:</label>
        <input type="text" name="username" className="form-control" style={{width:"50%"}} id="usrLogin"/>
      </div>
      <div className="form-group">
        <label htmlFor="pwdLogin">* Password:</label>
        <input type="password" name="password" className="form-control" style={{width:"50%"}} id="pwdLogin"/>
      </div>
      <div className="button-container">
      <button type="submit" className="btn btn-default" style={{background:"red",color:"white"}}>Login</button>
      <button className="btn btn-default" id="createUserLogin" name="createUserLoginButton" style={{background:"red",color:"white"}} onClick={this.handleClick}>Create User</button>
      </div>
      <div>
        <p style={{paddingTop:"2%"}}>* Login if you are an existing user. Click on Create User to go to User Creation Page</p>
      </div>
    </form>
    </div>
    )

    return(
    <div style={{padding:"5%", backgroundImage: `url(${logo})`, backgroundSize: "cover"}}>
      <h1 style={{ color: "#800f00",textAlign: "center",fontFamily: "cursive",fontSize: "4em",textShadow: "2px 2px #808080" }}>Mirage</h1>
      <div style={{paddingLeft:"30%",paddingBottom:"5%"}}>
      {showCreateUserForm ? createForm : loginForm}
      </div>
      
    </div>
    );
  }


}

export default connect()(LoginComponent);