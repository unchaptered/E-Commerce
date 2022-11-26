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
    basketTable: ITable;
}

export class MicroservicesConstruct extends Construct {

    public readonly productMicroservice: NodejsFunction;
    public readonly basketMicroservice: NodejsFunction;

    constructor(scope: Construct, id: string, props: DynamoDBConstructProps) {
        super(scope, id);

        this.productMicroservice = this.createProductMicroservices(props.productTable);
        this.basketMicroservice = this.createBasketMicroservices(props.basketTable);
    }

    private createProductMicroservices(productTable: ITable): NodejsFunction {
        const productProps: NodejsFunctionProps = {
            bundling: {
                externalModules: [
                    'aws-sdk'
                ]
            },
            environment: {
                PRIMARY_KEY: 'id',
                DYNAMODB_TABLE_NAME: productTable.tableName
            },
            runtime: Runtime.NODEJS_16_X,
        };
        const productFunction = new NodejsFunction(this, 'productFunction', {
            entry: join(__dirname, '/../src/product/index.js'),
            ...productProps
        });

        // Grant a Role to read and write in DynamoDB Table
        productTable.grantReadWriteData(productFunction);

        return productFunction;
    }

    private createBasketMicroservices(basketTable: ITable): NodejsFunction {
        const basketProps: NodejsFunctionProps = {
            bundling: {
                externalModules: [
                    'aws-sdk'
                ]
            },
            environment: {
                PRIMARY_KEY: 'userName',
                DYNAMODB_TABLE_NAME: basketTable.tableName
            },
            runtime: Runtime.NODEJS_16_X,
        };
        const basketFunction = new NodejsFunction(this, 'basketFunction', {
            entry: join(__dirname, '/../src/basket/index.js'),
            ...basketProps
        });

        // Grant a Role to read and write in DynamoDB Table
        basketTable.grantReadWriteData(basketFunction);

        return basketFunction;
    }

}