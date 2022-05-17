import {ProxyHandler} from 'aws-lambda'

export const handler: ProxyHandler = async (event) => {

    return {
        body: JSON.stringify({
            message: 'API version 9 - add api gw alarm',
            path: event.path,
        }),
        headers: {'Content-Type': 'application/json'},
        statusCode: 500,
    }
}
