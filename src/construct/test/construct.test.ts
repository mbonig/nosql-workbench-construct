import {expect as expectCDK, haveResource} from '@aws-cdk/assert';
import {App, Stack} from '@aws-cdk/core';
import {WorkbenchDataModel} from '../lib/index';
import 'should';

const dataModel = require("./data/discussion-forum.json");



test('Forum Table built with correct properties', () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    // WHEN
    new WorkbenchDataModel(stack, 'MyTestConstruct', {model: dataModel});
    // THEN

    expectCDK(stack).to(haveResource("AWS::DynamoDB::Table", {
        "TableName": 'Forum',
        "KeySchema": [
            {
                "AttributeName": "ForumName",
                "KeyType": "HASH"
            }
        ],
        "AttributeDefinitions": [
            {
                "AttributeName": "ForumName",
                "AttributeType": "S"
            }
        ],
        "ProvisionedThroughput": {
            "ReadCapacityUnits": 5,
            "WriteCapacityUnits": 5
        },
        "Tags": [
            {
                "Key": "Author",
                "Value": "Amazon Web Services Inc."
            },
            {
                "Key": "DateCreated",
                "Value": "Sep 05 2019 11:50 AM"
            },
            {
                "Key": "DateLastModified",
                "Value": "Dec 01 2019 8:42 PM"
            }
        ]
    }));
});


test('Table gets prefix if given', () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    // WHEN
    new WorkbenchDataModel(stack, 'MyTestConstruct', {model: dataModel, prefix: 'test-'});
    // THEN

    expectCDK(stack).to(haveResource("AWS::DynamoDB::Table", {
        "TableName": 'test-Forum'
    }));
});

test('Thread Table has correct properties', () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    new WorkbenchDataModel(stack, 'MyTestConstruct', {model: dataModel});


    expectCDK(stack).to(haveResource("AWS::DynamoDB::Table", {
        "TableName": 'Thread',
        "KeySchema": [
            {
                "AttributeName": "ForumName",
                "KeyType": "HASH"
            },
            {
                "AttributeName": "Subject",
                "KeyType": "RANGE"
            }
        ],
        "AttributeDefinitions": [
            {
                "AttributeName": "ForumName",
                "AttributeType": "S"
            },
            {
                "AttributeName": "Subject",
                "AttributeType": "S"
            }
        ],
        "ProvisionedThroughput": {
            "ReadCapacityUnits": 5,
            "WriteCapacityUnits": 5
        }
    }));

});
test('Reply Table built with correct properties including gsi', () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    new WorkbenchDataModel(stack, 'MyTestConstruct', {model: dataModel});


    expectCDK(stack).to(haveResource("AWS::DynamoDB::Table", {
        "KeySchema": [
            {
                "AttributeName": "Id",
                "KeyType": "HASH"
            },
            {
                "AttributeName": "ReplyDateTime",
                "KeyType": "RANGE"
            }
        ],
        "AttributeDefinitions": [
            {
                "AttributeName": "Id",
                "AttributeType": "S"
            },
            {
                "AttributeName": "ReplyDateTime",
                "AttributeType": "S"
            },
            {
                "AttributeName": "PostedBy",
                "AttributeType": "S"
            },
            {
                "AttributeName": "Message",
                "AttributeType": "S"
            }
        ],
        "GlobalSecondaryIndexes": [
            {
                "IndexName": "PostedBy-Message-Index",
                "KeySchema": [
                    {
                        "AttributeName": "PostedBy",
                        "KeyType": "HASH"
                    },
                    {
                        "AttributeName": "Message",
                        "KeyType": "RANGE"
                    }
                ],
                "Projection": {
                    "ProjectionType": "ALL"
                },
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 5,
                    "WriteCapacityUnits": 5
                }
            }
        ],
        "ProvisionedThroughput": {
            "ReadCapacityUnits": 5,
            "WriteCapacityUnits": 5
        }
    }));

});


/*

test('SNS Topic Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  // WHEN
  new WorkbenchDataModel(stack, 'MyTestConstruct', { dataModel });
  // THEN
  expectCDK(stack).to(haveResource("AWS::SNS::Topic"));
});*/
