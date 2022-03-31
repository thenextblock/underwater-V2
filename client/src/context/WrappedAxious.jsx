import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

class Service {
  constructor(token) {
    this.token = token;
    let request = axios.create({
      baseURL: API_URL,
      headers: { Authorization: "Bearer " + this.token },
      contentType: "application/json",
    });
    request.interceptors.response.use(this.handleSuccess, this.handleError);
    this.request = request;
  }

  handleSuccess(response) {
    return response;
  }

  handleError = (error) => {
    console.log("--- Wrapped Axous Class Error ---");
    console.log(error);
    console.log("Error Code : ", error.response);
    console.log("--------------------------");

    //this.redirectTo(document, '/login?'+error.response.status);
    // switch (error.response.status) {
    // 	case 401:
    // 		this.redirectTo(document, '/login?401')
    // 		break;
    // 	case 404:
    // 		this.redirectTo(document, '/404')
    // 		break;
    // 	default:
    // 		this.redirectTo(document, '/')
    // 		break;
    // }

    return error.response;
    //return Promise.reject(error)
  };

  redirectTo = (document, path) => {
    document.location = path;
  };
}

export default Service;
