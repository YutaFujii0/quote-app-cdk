import * as core from "@aws-cdk/core";
import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2";
import * as integrations from "@aws-cdk/aws-apigatewayv2-integrations";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
// import * as s3 from "@aws-cdk/aws-s3";
// import { HttpMethod } from "@aws-cdk/aws-apigatewayv2";

export class QuoteService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    const tableName = 'quote-service-dev1';

    const lambdaRole = new iam.Role(this, 'ServiceLambda', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
        'dynamodb:Query',
        'dynamodb:Scan',
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:BatchWriteItem',
      ],
    }));

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'], // TO BE MODIFIED
      actions: [
        'logs:CreateLogStream',
        'logs:CreateLogGroup',
      ],
    }));

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'], // TO BE MODIFIED
      actions: [
        'logs:PutLogEvents',
      ],
    }));

    const pickHandler = new lambda.Function(this, "Pick Handler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/lib"),
      handler: "quotes.pick",
      role: lambdaRole,
      environment: {
        QUOTE_TABLE: tableName,
      }
    });

    const seedHandler = new lambda.Function(this, "Seed Handler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "quotes.seed",
      role: lambdaRole,
      environment: {
        QUOTE_TABLE: tableName,
      }
    });

    const api = new apigatewayv2.HttpApi(this, "cdk-quote-service", {
      corsPreflight: {
        allowOrigins: ['https://quote2you.yutafujii.net'],
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [apigatewayv2.HttpMethod.GET],
        allowCredentials: true,
        exposeHeaders: ['Special-Response-Header'],
      }
    });

    const pickIntegration = new integrations.LambdaProxyIntegration({
      handler: pickHandler
    })

    const seedIntegration = new integrations.LambdaProxyIntegration({
      handler: seedHandler
    })

    api.addRoutes({
      path: '/quotes/pick',
      methods: [ apigatewayv2.HttpMethod.GET ],
      integration: pickIntegration,
    })

    api.addRoutes({
      path: '/quotes/seed',
      methods: [ apigatewayv2.HttpMethod.GET ],
      integration: seedIntegration,
    })
  }
}
