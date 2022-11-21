// Lib Dependency
import { Construct } from 'constructs';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

interface ApiGatewayConstructProps {
    productMicroservice: IFunction;
}

export class ApiGatewayConstruct extends Construct {

    constructor(scope: Construct, id: string, props: ApiGatewayConstructProps) {
        super(scope, id);

        const productApiGateway = new LambdaRestApi(this, 'productApi', {
            restApiName: 'Product Service',
            handler: props.productMicroservice,
            proxy: false
        })

        const product = productApiGateway.root.addResource('product');
        product.addMethod('GET');
        product.addMethod('POST');

        const singleProduct = product.addResource('{id}');
        singleProduct.addMethod('GET');
        singleProduct.addMethod('PUT');
        singleProduct.addMethod('DELETE');

    }

}