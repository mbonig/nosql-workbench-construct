import cdk = require('@aws-cdk/core');
import {WorkbenchDataModel} from '../../src/construct/lib/index';
import {StackProps} from "@aws-cdk/core";

export interface ExampleStackProps extends StackProps {
    model: any;
}

export class ExampleStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: ExampleStackProps) {
        super(scope, id, props);

        new WorkbenchDataModel(this, 'WorkbenchModel', {
            model: props.model
        });
    }
}
