## Exchange service
The service is intended for sending requests to the exchange.
The request body must be encrypted with the API key. The encryption algorithm sha-512

### sendMessage
The function accepts a request object:
request<T = any>(config: AxiosRequestConfig): Observable<AxiosResponse<T>>;

```
{
    clientId:'a0b63d87-6433-4ca4-86cb-f05f89f0d5b0'
    userId:'28d9e7f1-7a6b-42ac-8bee-c823d0e5546a'
    currencyId:'NRON'
    amount:1.00
    additionalData: 'b0weew-6433-4ca4-86cb-f05f89f0sgsb'
}
```
Required header in request:
```
    HMAC-SHA512:cda8836b82e1993d924b035043bd039c7a5701b282d7b1ba710c49d4cb6ec12a97ae4b44889049ed2b4ec512352d2d6a067735acc219e6e74c228b7b18fca3dc
```