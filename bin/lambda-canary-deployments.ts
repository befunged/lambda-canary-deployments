#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import {PipelineStack} from '../lib/pipeline-stack'

const app = new cdk.App()
new PipelineStack(app, 'PipelineStack', {
    env: {region: process.env.REGION || 'eu-west-1'},
})
