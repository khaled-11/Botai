//////////////////////////////////////////////////////////////
////              Create Facebook pages Table             ////
//////////////////////////////////////////////////////////////
const AWS = require("aws-sdk");
// Update the AWS Region.
AWS.config.update({region: 'us-east-1'});

module.exports = async () => {
  try {
    var ddb = new AWS.DynamoDB();
    var params = {
      AttributeDefinitions: [
        {
          AttributeName: 'pageID',
          AttributeType: 'S'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'pageID',
          KeyType: 'HASH'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      TableName: 'wit_pages',
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