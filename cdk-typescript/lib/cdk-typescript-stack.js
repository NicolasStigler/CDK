"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EC2InstanceStack = void 0;
const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
class EC2InstanceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const instanceName = new cdk.CfnParameter(this, 'InstanceName', {
            type: 'String',
            default: 'MV Reemplazar',
            description: 'Nombre de la instancia a crear',
        });
        const amiId = new cdk.CfnParameter(this, 'AMI', {
            type: 'String',
            default: 'ami-0aa28dab1f2852040',
            description: 'ID de AMI',
        });
        const securityGroup = new ec2.SecurityGroup(this, 'InstanceSecurityGroup', {
            vpc: ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true }),
            description: 'Permitir trafico SSH y HTTP desde cualquier lugar',
            allowAllOutbound: true,
        });
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH');
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP');
        const existingRoleARN = 'arn:aws:iam::439497970624:role/LabRole';
        const ec2Instance = new ec2.Instance(this, 'EC2Instance', {
            vpc: ec2.Vpc.fromLookup(this, 'VPC2', { isDefault: true }),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            machineImage: ec2.MachineImage.genericLinux({
                'us-east-1': amiId.valueAsString,
            }),
            securityGroup: securityGroup,
            keyName: 'vockey',
            blockDevices: [
                {
                    deviceName: '/dev/sda1',
                    volume: ec2.BlockDeviceVolume.ebs(20),
                },
            ],
            role: iam.Role.fromRoleArn(this, 'ExistingRole', existingRoleARN),
        });
        ec2Instance.addUserData(`#!/bin/bash
      cd /var/www/html/
      git clone https://github.com/utec-cc-2024-2-test/websimple.git
      git clone https://github.com/utec-cc-2024-2-test/webplantilla.git
      ls -l`);
        new aws_cdk_lib_1.CfnOutput(this, 'InstanceId', {
            description: 'ID de la instancia EC2',
            value: ec2Instance.instanceId,
        });
        new aws_cdk_lib_1.CfnOutput(this, 'InstancePublicIP', {
            description: 'IP publica de la instancia',
            value: ec2Instance.instancePublicIp,
        });
        new aws_cdk_lib_1.CfnOutput(this, 'websimpleURL', {
            description: 'URL de websimple',
            value: `http://${ec2Instance.instancePublicIp}/websimple`,
        });
        new aws_cdk_lib_1.CfnOutput(this, 'webplantillaURL', {
            description: 'URL de webplantilla',
            value: `http://${ec2Instance.instancePublicIp}/webplantilla`,
        });
    }
}
exports.EC2InstanceStack = EC2InstanceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXR5cGVzY3JpcHQtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstdHlwZXNjcmlwdC1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFFbkMsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw2Q0FBd0M7QUFFeEMsTUFBYSxnQkFBaUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUM3QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzlELElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLGVBQWU7WUFDeEIsV0FBVyxFQUFFLGdDQUFnQztTQUM5QyxDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUM5QyxJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsV0FBVyxFQUFFLFdBQVc7U0FDekIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRTtZQUN6RSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUN6RCxXQUFXLEVBQUUsbURBQW1EO1lBQ2hFLGdCQUFnQixFQUFFLElBQUk7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2hGLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUVqRixNQUFNLGVBQWUsR0FBRyx3Q0FBd0MsQ0FBQztRQUVqRSxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUN4RCxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUMxRCxZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDL0UsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDO2dCQUMxQyxXQUFXLEVBQUUsS0FBSyxDQUFDLGFBQWE7YUFDakMsQ0FBQztZQUNGLGFBQWEsRUFBRSxhQUFhO1lBQzVCLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFlBQVksRUFBRTtnQkFDWjtvQkFDRSxVQUFVLEVBQUUsV0FBVztvQkFDdkIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO2lCQUN0QzthQUNGO1lBQ0QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDO1NBQ2xFLENBQUMsQ0FBQztRQUVILFdBQVcsQ0FBQyxXQUFXLENBQ3JCOzs7O1lBSU0sQ0FDUCxDQUFDO1FBRUYsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDaEMsV0FBVyxFQUFFLHdCQUF3QjtZQUNyQyxLQUFLLEVBQUUsV0FBVyxDQUFDLFVBQVU7U0FDOUIsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUN0QyxXQUFXLEVBQUUsNEJBQTRCO1lBQ3pDLEtBQUssRUFBRSxXQUFXLENBQUMsZ0JBQWdCO1NBQ3BDLENBQUMsQ0FBQztRQUVILElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2xDLFdBQVcsRUFBRSxrQkFBa0I7WUFDL0IsS0FBSyxFQUFFLFVBQVUsV0FBVyxDQUFDLGdCQUFnQixZQUFZO1NBQzFELENBQUMsQ0FBQztRQUVILElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDckMsV0FBVyxFQUFFLHFCQUFxQjtZQUNsQyxLQUFLLEVBQUUsVUFBVSxXQUFXLENBQUMsZ0JBQWdCLGVBQWU7U0FDN0QsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBeEVELDRDQXdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IENmbk91dHB1dCB9IGZyb20gJ2F3cy1jZGstbGliJztcblxuZXhwb3J0IGNsYXNzIEVDMkluc3RhbmNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBpbnN0YW5jZU5hbWUgPSBuZXcgY2RrLkNmblBhcmFtZXRlcih0aGlzLCAnSW5zdGFuY2VOYW1lJywge1xuICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnTVYgUmVlbXBsYXphcicsXG4gICAgICBkZXNjcmlwdGlvbjogJ05vbWJyZSBkZSBsYSBpbnN0YW5jaWEgYSBjcmVhcicsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbWlJZCA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHRoaXMsICdBTUknLCB7XG4gICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdhbWktMGFhMjhkYWIxZjI4NTIwNDAnLFxuICAgICAgZGVzY3JpcHRpb246ICdJRCBkZSBBTUknLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnSW5zdGFuY2VTZWN1cml0eUdyb3VwJywge1xuICAgICAgdnBjOiBlYzIuVnBjLmZyb21Mb29rdXAodGhpcywgJ1ZQQycsIHsgaXNEZWZhdWx0OiB0cnVlIH0pLFxuICAgICAgZGVzY3JpcHRpb246ICdQZXJtaXRpciB0cmFmaWNvIFNTSCB5IEhUVFAgZGVzZGUgY3VhbHF1aWVyIGx1Z2FyJyxcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICBzZWN1cml0eUdyb3VwLmFkZEluZ3Jlc3NSdWxlKGVjMi5QZWVyLmFueUlwdjQoKSwgZWMyLlBvcnQudGNwKDIyKSwgJ0FsbG93IFNTSCcpO1xuICAgIHNlY3VyaXR5R3JvdXAuYWRkSW5ncmVzc1J1bGUoZWMyLlBlZXIuYW55SXB2NCgpLCBlYzIuUG9ydC50Y3AoODApLCAnQWxsb3cgSFRUUCcpO1xuXG4gICAgY29uc3QgZXhpc3RpbmdSb2xlQVJOID0gJ2Fybjphd3M6aWFtOjo0Mzk0OTc5NzA2MjQ6cm9sZS9MYWJSb2xlJztcblxuICAgIGNvbnN0IGVjMkluc3RhbmNlID0gbmV3IGVjMi5JbnN0YW5jZSh0aGlzLCAnRUMySW5zdGFuY2UnLCB7XG4gICAgICB2cGM6IGVjMi5WcGMuZnJvbUxvb2t1cCh0aGlzLCAnVlBDMicsIHsgaXNEZWZhdWx0OiB0cnVlIH0pLFxuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlQyLCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogZWMyLk1hY2hpbmVJbWFnZS5nZW5lcmljTGludXgoe1xuICAgICAgICAndXMtZWFzdC0xJzogYW1pSWQudmFsdWVBc1N0cmluZyxcbiAgICAgIH0pLFxuICAgICAgc2VjdXJpdHlHcm91cDogc2VjdXJpdHlHcm91cCxcbiAgICAgIGtleU5hbWU6ICd2b2NrZXknLFxuICAgICAgYmxvY2tEZXZpY2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBkZXZpY2VOYW1lOiAnL2Rldi9zZGExJyxcbiAgICAgICAgICB2b2x1bWU6IGVjMi5CbG9ja0RldmljZVZvbHVtZS5lYnMoMjApLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHJvbGU6IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHRoaXMsICdFeGlzdGluZ1JvbGUnLCBleGlzdGluZ1JvbGVBUk4pLFxuICAgIH0pO1xuXG4gICAgZWMySW5zdGFuY2UuYWRkVXNlckRhdGEoXG4gICAgICBgIyEvYmluL2Jhc2hcbiAgICAgIGNkIC92YXIvd3d3L2h0bWwvXG4gICAgICBnaXQgY2xvbmUgaHR0cHM6Ly9naXRodWIuY29tL3V0ZWMtY2MtMjAyNC0yLXRlc3Qvd2Vic2ltcGxlLmdpdFxuICAgICAgZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS91dGVjLWNjLTIwMjQtMi10ZXN0L3dlYnBsYW50aWxsYS5naXRcbiAgICAgIGxzIC1sYFxuICAgICk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdJbnN0YW5jZUlkJywge1xuICAgICAgZGVzY3JpcHRpb246ICdJRCBkZSBsYSBpbnN0YW5jaWEgRUMyJyxcbiAgICAgIHZhbHVlOiBlYzJJbnN0YW5jZS5pbnN0YW5jZUlkLFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnSW5zdGFuY2VQdWJsaWNJUCcsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnSVAgcHVibGljYSBkZSBsYSBpbnN0YW5jaWEnLFxuICAgICAgdmFsdWU6IGVjMkluc3RhbmNlLmluc3RhbmNlUHVibGljSXAsXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICd3ZWJzaW1wbGVVUkwnLCB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1VSTCBkZSB3ZWJzaW1wbGUnLFxuICAgICAgdmFsdWU6IGBodHRwOi8vJHtlYzJJbnN0YW5jZS5pbnN0YW5jZVB1YmxpY0lwfS93ZWJzaW1wbGVgLFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnd2VicGxhbnRpbGxhVVJMJywge1xuICAgICAgZGVzY3JpcHRpb246ICdVUkwgZGUgd2VicGxhbnRpbGxhJyxcbiAgICAgIHZhbHVlOiBgaHR0cDovLyR7ZWMySW5zdGFuY2UuaW5zdGFuY2VQdWJsaWNJcH0vd2VicGxhbnRpbGxhYCxcbiAgICB9KTtcbiAgfVxufVxuIl19