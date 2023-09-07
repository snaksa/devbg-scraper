import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

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

    new Distribution(this, "DevBgScraperFrontendDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(websiteBucket, { originAccessIdentity }),
      },
    });

    new BucketDeployment(this, "DevBgScraperFrontendDeployment", {
      destinationBucket: websiteBucket,
      sources: [Source.asset("../frontend/out")],
    });
  }
}
