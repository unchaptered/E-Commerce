// Lib Dependency
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { GetItemCommand, ScanCommand, PutItemCommand, DeleteItemCommand, UpdateItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");

const { v4: uuidv4 } = require('uuid');

// Custom Dependency
const { ddbClient } = require("./ddbClient");

/**
 * If you open the index.js, we can see that our number lambda handle method stored in these index.js file. <br>
 * And we can start our actual businessl ogic into the index.js as know that index.js includes a lambda function hnalde method. <br>
 * And we have verified that this handle method invoked by the API Gateway.
 * 
 * So if you remember our architecture, we are going to implement synchronous, Serverless cloud performance.
 */
exports.handler = async function (event) {
	console.log('request:', JSON.stringify(event, undefined, 2));

	try {

		let resultBody;

		/**
		 * TODO - switch case event.httpMethod to perform CRUD operations with using ddbClient object
		 */
		switch (event.httpMethod) {
			case 'GET':
                
            if (event.pathParameters != null) {

					/** GET /basket/{id} */
					resultBody = await getBasket(event.pathParameters.userName);

				} else {

					/** GET /basket */
					resultBody = await getAllBaskets();

				}
				break;

			case 'POST':

                if (event.pathParameters == "/basket/checkout") {

                    /** POST /basket/checkout */
                    resultBody = await checkoutBasket(event);

                } else {

                    /** POST /basket */
                    resultBody = await createBasket(event);

                }
				break;

			case 'DELETE':

				/** DELETE /basket/{userName} */
				resultBody = await deleteBasket(event.pathParameters.userName);
				break;

			default:
				throw new Error(`Unsupported route: "${event.httpMethod}"`);
		}

		console.log('resultBody:', JSON.stringify(resultBody));

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: `Successfully finishied operation : "${event.httpMethod}"`,
				body: resultBody
			})
		};

	} catch (e) {
		console.error(e);

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: JSON.stringify({
					message: "Failed to perform operation",
					errorMsg: e.message,
					errorStack: e.stack
				})
			})
		};

	}
};

const getBasket = async (userName) => {
	console.log('getBasket');
	// implement function
}

const getAllBaskets = async () => {
	console.log('getAllBaskets');
	// implement function
}

const checkoutBasket = async (event) => {
	console.log('checkoutBasket');
	// implement function
}

const createBasket = async (event) => {
	console.log('createBasket');
	// implement function
}

const deleteBasket = async (userName) => {
	console.log('deleteBasket');
	// implement function
}