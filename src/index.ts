import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { handler } from './lambdas/activities-get';

const domain = 'testapi.playportal.pp-dev.apps.legogroup.io';
const awsUsEast1 = new aws.Provider('aws-provider-us-east-1', { region: 'us-east-1' });

const sslCertificate = new aws.acm.Certificate(
  'testapi-ssl-cert',
  {
    domainName: domain,
    validationMethod: 'DNS',
  },
  { provider: awsUsEast1 }
);

// Create DNS record to prove to ACM that we own the domain
const sslCertificateValidationDnsRecord = new aws.route53.Record('ssl-cert-validation-dns-record', {
  zoneId: 'Z08201573ODBLNRIX8V6U',
  name: sslCertificate.domainValidationOptions[0].resourceRecordName,
  type: sslCertificate.domainValidationOptions[0].resourceRecordType,
  records: [sslCertificate.domainValidationOptions[0].resourceRecordValue],
  ttl: 10 * 60, // 10 minutes
});

const validatedSslCertificate = new aws.acm.CertificateValidation(
  'ssl-cert-validation',
  {
    certificateArn: sslCertificate.arn,
    validationRecordFqdns: [sslCertificateValidationDnsRecord.fqdn],
  },
  { provider: awsUsEast1 }
);

const apiDomainName = new aws.apigateway.DomainName('api-domain-name', {
  certificateArn: validatedSslCertificate.certificateArn,
  domainName: domain,
});

const dnsRecord = new aws.route53.Record('api-dns', {
  zoneId: 'Z08201573ODBLNRIX8V6U',
  type: 'A',
  name: domain,
  aliases: [
    {
      name: apiDomainName.cloudfrontDomainName,
      evaluateTargetHealth: false,
      zoneId: apiDomainName.cloudfrontZoneId,
    },
  ],
});

// create the api gateway
const gw = new awsx.apigateway.API('test-api', {
  routes: [
    {
      path: '/activities',
      method: 'GET',
      eventHandler: handler,
    },
  ],
});

const basePathMapping = new aws.apigateway.BasePathMapping('api-domain-mapping', {
  restApi: gw.restAPI,
  stageName: gw.stage.stageName,
  domainName: apiDomainName.domainName,
});

export const endpointUrl = gw.url;
