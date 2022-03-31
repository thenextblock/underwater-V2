import React, { Component } from "react";
import Context from "./Context";
import Service from "./WrappedAxious";

const API_URL = process.env.REACT_APP_API_URL;
// const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
// const HOST = process.env.REACT_APP_BLOCKCHAIN_HOST_1;

class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      service: new Service(),
      user: null,
      twoFaEnabled: false,
      jwtToken: null,
      sid: null,
      isLoggedIn: false,

      accountAddress: null,
      walletBalance: 0.0,

      transactions: null,
    };
  }

  setJwtToken = async (_data) => {
    console.log("PROVIDER SET JWT TOKEN FUNCTION:  ", _data);
    const { token, success, data: user } = _data;
    this.setState({ jwtToken: token });
    this.setState({ isLoggedIn: success });
    this.setState({ user: user });
    this.setState({ service: new Service(token) });
  };

  logout = () => {
    this.setState({ jwtToken: null });
    this.setState({ isLoggedIn: false });
  };

  login = async (username, password) => {
    const loginData = {
      username: username,
      password: password,
    };

    // const response = await
    //     axios.post(`${API_URL}/user/login`, loginData)
    //         .catch(function (error) {
    //             console.log('login error : ', error);
    //                 return false;
    // });

    const response = await this.state.service.request.post(
      `${API_URL}/user`,
      loginData
    );
    console.log("Logon response : ", response);

    const { data } = response;

    console.log("----- Login response ----");
    console.log(data);
    console.log("-------------------------");

    if (data && response.status === 200) {
      await this.setJwtToken(data);
    }
    return response;
  };

  // getBlackBalance = async () => {
  //   console.log("GET BLACK BALANCE FROM API ");
  //   const { data: response } = await this.state.service.request.get(
  //     `${API_URL}/user/balance`
  //   );
  //   console.log(response);
  //   return response.data.blackBalance;
  // };

  async componentDidMount() {
    console.log("APP PROVIDER DID MOUNT ... ");
  }

  render() {
    const handlers = {
      login: this.login,
      logout: this.logout,
    };
    return (
      <Context.Provider value={{ globalstate: this.state, handlers: handlers }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default Provider;
