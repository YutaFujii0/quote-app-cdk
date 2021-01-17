import * as cdk from '@aws-cdk/core';
// import * as widget_service from '../lib/widget_service'; // TO BE REMOVED
import * as quote_service from '../lib/quote_service';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // new widget_service.WidgetService(this, 'Widgets'); // TO BE REMOVED
    new quote_service.QuoteService(this, 'Quote');
  }
}
