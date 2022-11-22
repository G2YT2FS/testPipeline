import * as cdk from 'aws-cdk-lib';
import {
  aws_codepipeline as ppl,
  aws_codepipeline_actions as cpa, SecretValue
} from 'aws-cdk-lib';

import {Construct} from 'constructs';
import {BuildSpec, LinuxBuildImage, PipelineProject} from "aws-cdk-lib/aws-codebuild";

export class SrdPipelineTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new ppl.Pipeline(this,'pipeline-test-mo', {
      pipelineName:'Pipeline-test-mo',
      crossAccountKeys:false
    });

    const sourceCode = new ppl.Artifact('sourceCode')

    pipeline.addStage({
      stageName:'source',
      actions:[
          new cpa.GitHubSourceAction({
            owner:'SmPaknejad',
            repo:'testPipeline',
            branch:'main',
            actionName:'PipelineSource',
            oauthToken:SecretValue.secretsManager('test-mo-pipeline'),
            output:sourceCode
          })
      ]
    });

    const cdkBuildOutput = new ppl.Artifact('CDKBuildOutput')

    pipeline.addStage({
      stageName:'Build',
      actions:[
          new cpa.CodeBuildAction({
            actionName:'Build',
            input:sourceCode,
            outputs:[cdkBuildOutput],
            project: new PipelineProject(this,'CodeBuildProject',{
                environment: {
                  buildImage: LinuxBuildImage.STANDARD_5_0
                },
              buildSpec:BuildSpec.fromSourceFilename('build-spec/cdk-build-spec.yml')

            })
          })
      ]
    })

  }
}
