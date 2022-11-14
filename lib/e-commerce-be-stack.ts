import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export class ECommerceBeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const productTable = new Table(this, 'product', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'product',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    // Case A - Base Lambda Function

    // const productFunctionA = new Function(this, 'MyFunction', {
    //   runtime: Runtime.NODEJS_16_X,
    //   handler: 'index.handler',
    //   code: Code.fromAsset(join(__dirname, 'lambda-handler'))
    // });

    // Case B - Advaced Lambda Function with NodejsFunction module

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

    const productFunctionB = new NodejsFunction(this, 'productFunction', {
      entry: join(__dirname, '/../src/product/index.js'),
      ...productProps
    });

    // Grant a Role to read and write in DynamoDB Table

    productTable.grantReadWriteData(productFunctionB);

  }
}
