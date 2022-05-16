import {ProxyHandler} from 'aws-lambda'

let counter: number = 0;

export const handler: ProxyHandler = async (event) => {

    let statusCode: number = 200;
    let message: string = 'API version 6 has been deployed!'

    if (counter > 10) {
        statusCode = 500;
        message = 'API version 6 has been deployed! : Throwing 500'
    }

    counter++;

    return {
        body: JSON.stringify({
            message: message,
            path: event.path,
        }),
        headers: {'Content-Type': 'application/json'},
        statusCode: statusCode,
    }
}
