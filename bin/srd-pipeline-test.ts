#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SrdPipelineTestStack } from '../lib/srd-pipeline-test-stack';

const app = new cdk.App();
new SrdPipelineTestStack(app, 'SrdPipelineTestStack', {

});