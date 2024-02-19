import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import {
  PublicHostedZone,
  ARecord,
  RecordTarget, IPublicHostedZone,
} from "aws-cdk-lib/aws-route53";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import {
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
  LambdaEdgeEventType,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import {Certificate, CertificateValidation} from "aws-cdk-lib/aws-certificatemanager";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const websiteBucket = new Bucket(this, "DevBgScraperFrontendBucket", {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      accessControl: BucketAccessControl.PRIVATE,
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "DevBgScraperFrontendOriginAccessIdentity",
    );

    websiteBucket.grantRead(originAccessIdentity);

    const lambdaEdgeFunction = new NodejsFunction(
      this,
      "DevbgScraper-FrontendLambda",
      {
        entry: path.resolve(__dirname, "./lambda.handler.ts"),
      },
    );

    const domainName = process.env.DOMAIN_NAME;
    const hostedZoneId = process.env.HOSTED_ZONE_ID ?? "";
    const hasDomainName = domainName !== undefined;
    let hostedZone: IPublicHostedZone | null = null;
    let certificate: Certificate | null = null;

    if (hasDomainName) {
      hostedZone = PublicHostedZone.fromPublicHostedZoneAttributes(
          this,
          "HostedZone",
          { hostedZoneId: hostedZoneId, zoneName: domainName },
      );

      certificate = new Certificate(this, "DevBgScraperFrontendCertificate", {
        domainName: domainName,
        validation: CertificateValidation.fromDns(hostedZone),
      })
    }

    const distribution = new Distribution(
      this,
      "DevBgScraperFrontendDistribution",
      {
        defaultRootObject: "index.html",

        ...(hasDomainName && certificate && {
          domainNames: [domainName],
          certificate: certificate,
        }),

        defaultBehavior: {
          origin: new S3Origin(websiteBucket, { originAccessIdentity }),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          edgeLambdas: [
            {
              eventType: LambdaEdgeEventType.VIEWER_REQUEST,
              functionVersion: lambdaEdgeFunction.currentVersion,
            },
          ],
        },
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
      },
    );

    if (hasDomainName && hostedZone) {
      new ARecord(this, "DevBgScraperFrontendARecord", {
        zone: hostedZone,
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
        recordName: domainName,
      });
    }

    new BucketDeployment(this, "DevBgScraperFrontendDeployment", {
      destinationBucket: websiteBucket,
      sources: [Source.asset("../frontend/out")],
    });
  }
}
