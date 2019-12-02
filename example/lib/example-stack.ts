import cdk = require('@aws-cdk/core');
import {WorkbenchDataModel} from '../../src/construct/lib/index';
import {AttributeType} from "@aws-cdk/aws-dynamodb";

export class ExampleStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new WorkbenchDataModel(this, 'WorkbenchModel', {
            model: {
                ModelName: 'Example',
                ModelMetadata: {
                    Author: "Matthew Bonig",
                    DateCreated: new Date().toISOString(),
                    DateLastModified: new Date().toISOString(),
                    Description: "An example use-case"
                },
                DataModel: [
                    {
                        TableName: 'Example',
                        KeyAttributes: {
                            PartitionKey: {
                                AttributeType: AttributeType.STRING,
                                AttributeName: 'Something'
                            }
                        }
                    }
                ]
            }
        });
    }
}
