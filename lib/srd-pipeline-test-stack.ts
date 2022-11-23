import * as cdk from 'aws-cdk-lib';
import {
    aws_codepipeline as ppl,
    aws_codepipeline_actions as cpa,
    SecretValue,
    //aws_iam as iam
} from 'aws-cdk-lib';

import {Construct} from 'constructs';
import {BuildSpec, LinuxBuildImage, PipelineProject} from "aws-cdk-lib/aws-codebuild";

export class SrdPipelineTestStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipeline = new ppl.Pipeline(this, 'pipeline-test-mo', {
            pipelineName: 'Pipeline-test-mo'
        });

        const sourceCode = new ppl.Artifact('sourceCode')

        pipeline.addStage({
            stageName: 'source',
            actions: [
                new cpa.GitHubSourceAction({
                    owner: 'SmPaknejad',
                    repo: 'testPipeline',
                    branch: 'main',
                    actionName: 'PipelineSource',
                    oauthToken: SecretValue.secretsManager('test-mo-pipeline'),
                    output: sourceCode
                })
            ]
        });

        const cdkBuildOutput = new ppl.Artifact('CDKBuildOutput');

        pipeline.addStage({
            stageName: 'Build',
            actions: [
                new cpa.CodeBuildAction({
                    actionName: 'Build',
                    //role: iam.Role.fromRoleArn(this,'test-mo-cross-account-pipeline-role','arn:aws:iam::107711577954:role/test-mo-cross-account-pipeline-role'),
                    input: sourceCode,
                    outputs: [cdkBuildOutput],
                    project: new PipelineProject(this, 'CodeBuildProject', {
                        environment: {
                            buildImage: LinuxBuildImage.STANDARD_5_0
                        },
                        buildSpec: BuildSpec.fromSourceFilename('build-specs/cdk-build-spec.yml')

                    })
                })
            ]
        });
    }
}


