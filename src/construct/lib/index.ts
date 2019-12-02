import sns = require('@aws-cdk/aws-sns');
import subs = require('@aws-cdk/aws-sns-subscriptions');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/core');
import {AttributeType, Table} from "@aws-cdk/aws-dynamodb";
import {Tag} from "@aws-cdk/core";


export class WorkbenchDataModel extends cdk.Construct {

    constructor(scope: cdk.Construct, id: string, props: WorkbenchDataModelProps) {
        super(scope, id);

        this.buildTables(props);

    }

    private buildTables(props: WorkbenchDataModelProps) {
        for (let table of props.model.DataModel) {
            const newTable = new Table(this, `${props.prefix}${table.TableName}-table`, {
                tableName: `${props.prefix || ''}${table.TableName}`,
                partitionKey: {
                    name: table.KeyAttributes.PartitionKey.AttributeName,
                    type: table.KeyAttributes.PartitionKey.AttributeType as AttributeType
                },
                sortKey: table.KeyAttributes.SortKey ? {
                    name: table.KeyAttributes.SortKey.AttributeName,
                    type: table.KeyAttributes.SortKey.AttributeType as AttributeType,
                } : undefined
            });
            if (table.GlobalSecondaryIndexes) {
                for (const gsi of table.GlobalSecondaryIndexes) {
                    newTable.addGlobalSecondaryIndex({
                        indexName: gsi.IndexName,
                        partitionKey: {
                            name: gsi.KeyAttributes.PartitionKey.AttributeName,
                            type: gsi.KeyAttributes.PartitionKey.AttributeType as AttributeType
                        },
                        sortKey: gsi.KeyAttributes.SortKey ? {
                            name: gsi.KeyAttributes.SortKey.AttributeName,
                            type: gsi.KeyAttributes.SortKey.AttributeType as AttributeType
                        } : undefined
                    })
                }
            }
            Tag.add(newTable, "Author", this.sanitizeTag(props.model.ModelMetadata.Author));
            Tag.add(newTable, "DateCreated", this.sanitizeTag(props.model.ModelMetadata.DateCreated));
            Tag.add(newTable, "DateLastModified", this.sanitizeTag(props.model.ModelMetadata.DateLastModified));
        }
    }

    sanitizeTag(value: string) {
        return value.substring(0, 255).replace(/[^\s\w.-=_:\/\+]/g, '')
    }
}


export interface WorkbenchDataModelProps {
    /**
     * an objcet that represents the data model exported from the NoSQL Workbench for Amazon DynamoDB
     *
     * e.g. {
            "ModelName": "AWS Discussion Forum Data Model",
            "ModelMetadata": {
              "Author": "Amazon Web Services, Inc.",
              "DateCreated": "Sep 05, 2019, 11:50 AM",
              "DateLastModified": "Dec 01, 2019, 8:42 PM",
              "Description": "This data model represents Amazon DynamoDB schema for AWS discussion forums, an example of an application for discussion forums or message boards. Using AWS discussion forums, customers can engage with the developer community, ask questions, and reply to other customers' posts. Each AWS service has a dedicated forum. Anyone can start a new discussion thread by posting a message in a forum, and each thread receives any number of replies.\n\nThe important access patterns facilitated by this data model are:\n* Retrieval of a forum record using the forum’s name, facilitated by a table called Forum\n* Retrieval of a specific thread or all threads for a forum, facilitated by a table called Thread\n* Search for replies using the posting user’s email address, facilitated by the Reply table’s global secondary index called PostedBy-Message-Index\n\nFor more information, see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SampleData.CreateTables.html"
            },
            "DataModel": [...]
          }
     */
    model: Model;

    /**
     * A prefix to add to all Table names.
     *
     * e.g. "dev-"
     */
    prefix?: string;
}

/**
 * Represents the data model exported by the AWS NoSQL Workbench for Amazon DynamoDB
 */
export interface Model {
    "ModelName": string
    "ModelMetadata": {
        "Author": string;
        "DateCreated": string;
        "DateLastModified": string;
        "Description": string
    },
    "DataModel": DataModel[];
}

export interface DataModel {
    "TableName": string
    "KeyAttributes": {
        "PartitionKey": {
            "AttributeName": string,
            "AttributeType": string
        },
        "SortKey"?: {
            "AttributeName": string,
            "AttributeType": string
        }
    },
    "GlobalSecondaryIndexes"?: [
        {
            "IndexName": string,
            "KeyAttributes": {
                "PartitionKey": {
                    "AttributeName": string,
                    "AttributeType": string
                },
                "SortKey"?: {
                    "AttributeName": string,
                    "AttributeType": string
                }
            },
            "Projection": {
                "ProjectionType": string
            }
        }
    ],
    "NonKeyAttributes"?: [
        {
            "AttributeName": string,
            "AttributeType": string // should be enum?
        },
        {
            "AttributeName": string,
            "AttributeType": string
        },
        {
            "AttributeName": string,
            "AttributeType": string
        },
        {
            "AttributeName": string,
            "AttributeType": string
        }
    ]
}