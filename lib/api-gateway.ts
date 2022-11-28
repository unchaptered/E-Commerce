// CloudFormation Dependency
import { Construct } from 'constructs';

// CDK Dependencies
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

interface ApiGatewayConstructProps {
    productMicroservice: IFunction;
    basketMicroservice: IFunction;
}

export class ApiGatewayConstruct extends Construct {

    constructor(scope: Construct, id: string, props: ApiGatewayConstructProps) {
        super(scope, id);

        this.createProductApiGateway(props.productMicroservice);
        this.createBasketApiGateway(props.basketMicroservice);
    }

    private createProductApiGateway(productMicroservice: IFunction) {
        const productApiGateway = new LambdaRestApi(this, 'productApi', {
            restApiName: 'Product Service',
            handler: productMicroservice,
            proxy: false
        })

        const product = productApiGateway.root.addResource('product');
        product.addMethod('GET');               // GET /product
        product.addMethod('POST');              // POST /product

        const singleProduct = product.addResource('{id}');
        singleProduct.addMethod('GET');         // GET /product/{id}
        singleProduct.addMethod('PUT');         // PUT /product/{id}
        singleProduct.addMethod('DELETE');      // DELETE /product/{id}
    }

    private createBasketApiGateway(basketMicroservice: IFunction) {
        const basketApiGateway = new LambdaRestApi(this, 'basketApi', {
            restApiName: 'Basket Service',
            handler: basketMicroservice,
            proxy: false
        })

        const basket = basketApiGateway.root.addResource('basket');
        basket.addMethod('GET');               // GET /basket
        basket.addMethod('POST');              // POST /basket

        const singleBasket = basket.addResource('{userName}');
        singleBasket.addMethod('GET');         // GET  /basket/{userName}
        singleBasket.addMethod('DELETE');      // DELETE /basket/{userName}

        const basketcheckout = basket.addResource('checkout');
        basketcheckout.addMethod('POST')        // POST /basket/checkout
    }
}