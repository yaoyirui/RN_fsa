
// const httpServerCors = 'http://192.168.0.108:8184/starFSAAppIntf/';
const httpServerCors = 'http://192.168.248.139:8184/starFSAAppIntf/';
const defaultOptionsCors = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
 };

module.exports = {
    httpServerCors,
    defaultOptionsCors
};
