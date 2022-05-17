import {ProxyHandler} from 'aws-lambda'

export const handler: ProxyHandler = async (event) => {

    return {
        body: JSON.stringify({
            message: 'API version 12',
            path: event.path,
        }),
        headers: {'Content-Type': 'application/json'},
        statusCode: 500,
    }
}
