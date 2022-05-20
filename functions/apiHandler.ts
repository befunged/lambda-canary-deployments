import {ProxyHandler} from 'aws-lambda'

export const handler: ProxyHandler = async (event) => {

    throw new Error();

    return {
        body: JSON.stringify({
            message: 'API version 13',
            path: event.path,
        }),
        headers: {'Content-Type': 'application/json'},
        statusCode: 500,
    }
}
