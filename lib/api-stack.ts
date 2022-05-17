import * as cdk from '@aws-cdk/core'
import * as apiGw from '@aws-cdk/aws-apigateway'
import * as cd from '@aws-cdk/aws-codedeploy'
import * as cw from '@aws-cdk/aws-cloudwatch'
import * as lambda from '@aws-cdk/aws-lambda'
import {Lambda} from './helpers'
import { TreatMissingData } from '@aws-cdk/aws-cloudwatch'

const aliasName = 'stage'

export class ApiStack extends cdk.Stack {
    readonly apiURL: cdk.CfnOutput

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        // Function and its alias
        const handler = new Lambda(this, 'apiHandler')
        const stage = new lambda.Alias(this, 'apiHandlerStage', {
            aliasName,
            version: handler.currentVersion,
        })

        // API endpoint
        const api = new apiGw.LambdaRestApi(this, 'restApi', {
            restApiName: 'restApi',
            handler: stage,
            deployOptions: {stageName: 'staging'},
        })

        const lambdaErrorsAlarm = new cw.Alarm(this, 'lambdaFailure', {
            alarmName: 'lambdaFailure',
            alarmDescription: 'Lambda latest deployment errors > 0',
            metric: new cw.Metric({
                metricName: 'Errors',
                namespace: 'AWS/Lambda',
                statistic: 'sum',
                dimensionsMap: {
                    Resource: `${handler.functionName}:${aliasName}`,
                    FunctionName: handler.functionName,
                },
                period: cdk.Duration.minutes(1),
            }),
            threshold: 1,
            evaluationPeriods: 1,
        })

        const apiGateway500sAlarm = new cw.Alarm(this, 'apigwFailure', {
            alarmName: 'apigwFailure',
            alarmDescription: 'API gateway latest deployment errors > 0',
            metric: new cw.Metric({
                metricName: '5XXError',
                namespace: 'AWS/APIGateway',
                statistic: 'sum',
                 dimensionsMap: {
                     ApiName: 'restApi',
                     Stage: 'staging',
                },
                period: cdk.Duration.minutes(1),
            }),
            threshold: 1,
            evaluationPeriods: 1,
            treatMissingData: TreatMissingData.MISSING
        })

        new cd.LambdaDeploymentGroup(this, 'canaryDeployment', {
            alias: stage,
            deploymentConfig: cd.LambdaDeploymentConfig.CANARY_10PERCENT_5MINUTES,
            alarms: [lambdaErrorsAlarm, apiGateway500sAlarm],
            autoRollback: {
                failedDeployment: true, // default: true
                stoppedDeployment: true, // default: false
                deploymentInAlarm: true, // default: true if you provided any alarms, false otherwise
            },
        })

        this.apiURL = new cdk.CfnOutput(this, 'apiURL', {
            value: api.url,
        })
    }
}
