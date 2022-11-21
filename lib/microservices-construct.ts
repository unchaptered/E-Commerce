// CloudFormation Dependency
import { Construct } from 'constructs';

// CDK Dependencies
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';

// Util Dependencies
import { join } from 'path';

interface DynamoDBConstructProps {
    productTable: ITable;
}

export class MicroservicesConstruct extends Construct {

    public readonly productFunction: NodejsFunction;

    constructor(scope: Construct, id: string, props: DynamoDBConstructProps) {
        super(scope, id);

        // Lambda Function
        const productProps: NodejsFunctionProps = {
            bundling: {
                externalModules: [
                    'aws-sdk'
                ]
            },
            environment: {
                PRIMARY_KEY: 'id',
                DYNAMODB_TABLE_NAME: props.productTable.tableName
            },
            runtime: Runtime.NODEJS_16_X,
        };

        const productFunction = new NodejsFunction(this, 'productFunction', {
            entry: join(__dirname, '/../src/product/index.js'),
            ...productProps
        });

        // Grant a Role to read and write in DynamoDB Table
        props.productTable.grantReadWriteData(productFunction);
    }

}