#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import {ExampleStack} from '../lib/example-stack';

const app = new cdk.App();
const model = require('./discussion-forum.json');
new ExampleStack(app, 'ExampleStack', {model});
