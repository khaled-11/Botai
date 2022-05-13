///////////////////////////////////////////////////////////////
////             Create Facebook Clients Table             ////
///////////////////////////////////////////////////////////////
const AWS = require("aws-sdk");
// Update the AWS Credentials.
AWS.config.update({region: 'us-east-1'});

module.exports = async () => {
  try {
    var ddb = new AWS.DynamoDB();
    var params = {
      AttributeDefinitions: [
        {
          AttributeName: 'clientID',
          AttributeType: 'S'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'clientID',
          KeyType: 'HASH'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      TableName: 'wit_clients',
      StreamSpecification: {
        StreamEnabled: false
      }
    };
    // Call DynamoDB to create the table if doesn't exist.
    const request = ddb.createTable(params);
    result = await request.promise();
  } catch (e){
    return;
  }
  return;
};