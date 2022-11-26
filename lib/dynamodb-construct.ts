// CloudFormation Dependency
import { Construct } from 'constructs';

// CDK Dependencies
import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';

export class DynamoDBConstruct extends Construct {

    public readonly productTable: ITable;
    public readonly basketTable: ITable;
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.productTable = this.createProductTable();
        this.basketTable = this.createBasketTable();
    }

    /**
     * product : PK: id -- name - description - imageFile - price - category
     */
    private createProductTable(): ITable {
        return new Table(this, 'product', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: 'product',
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        });
    }

    /**
     * basket : PK: id - username - basektItemList[]
     * basketItem : { quantity - color - price - productId - productName }
     */
    private createBasketTable(): ITable {
        return new Table(this, 'basket', {
            partitionKey: {
                name: 'userName',
                type: AttributeType.STRING
            },
            tableName: 'basket',
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        });
    }

}