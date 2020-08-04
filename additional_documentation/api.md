## Swagger

### [API swagger](/swagger/docs)

### Introduction
Requests while the private endpoint is accessed via HMAC-SHA512 signed POST and GET requests using API keys. Both types of HTTP endpoints return results in JSON format.

~~~
Required headers:
'DATE-TIME' - Current date in milliseconds
'MERCHANT-ID' - Merchant ID, issued upon registration
'HMAC-SHA512' - Request signature
~~~

Pseudocode:
~~~
HMAC-SHA512 = HmacSha256Hex(
{ 'date-time': 'DATE-TIME' } + { path: RequestPath } + { RequestPayload }, apiKey)
~~~

apiKey - issued upon registration


Node.js code:
~~~
import * as crypto from 'crypto';
...
const parameters = _.assignIn({ 'date-time': dateTime, path: request.url }, request.body);
...
async getHmac(
    parameters,
    algorithm: string,
    secret: string,
  ): Promise<string> {
    if (typeof parameters === 'object') {
      parameters = JSON.stringify(parameters).replace(/%20/g, '+');
    }

    return crypto
      .createHmac(algorithm, secret)
      .update(parameters)
      .digest('hex');
  }
...
~~~