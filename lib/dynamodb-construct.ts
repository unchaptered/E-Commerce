// CloudFormation Dependency
import { Construct } from 'constructs';

// CDK Dependencies
import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';

export class DynamoDBConstruct extends Construct {

    public readonly productTable: Table;
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.productTable = new Table(this, 'product', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: 'product',
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        });
    }

}