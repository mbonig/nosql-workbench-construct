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
                "Value": "Amazon Web Services, Inc."
            },
            {
                "Key": "DateCreated",
                "Value": "Sep 05, 2019, 11:50 AM"
            },
            {
                "Key": "DateLastModified",
                "Value": "Dec 01, 2019, 8:42 PM"
            },
            {
                "Key": "Description",
                "Value": "This data model represents Amazon DynamoDB schema for AWS discussion forums, an example of an application for discussion forums or message boards. Using AWS discussion forums, customers can engage with the developer community, ask questions, and reply to other customers' posts. Each AWS service has a dedicated forum. Anyone can start a new discussion thread by posting a message in a forum, and each thread receives any number of replies.\n\nThe important access patterns facilitated by this data model are:\n* Retrieval of a forum record using the forum’s name, facilitated by a table called Forum\n* Retrieval of a specific thread or all threads for a forum, facilitated by a table called Thread\n* Search for replies using the posting user’s email address, facilitated by the Reply table’s global secondary index called PostedBy-Message-Index\n\nFor more information, see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SampleData.CreateTables.html"
            }
        ]
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
