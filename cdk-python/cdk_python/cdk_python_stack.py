from aws_cdk import (
    core as cdk,
    aws_ec2 as ec2,
    aws_iam as iam,
    CfnOutput
)

class EC2InstanceStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        instance_name = cdk.CfnParameter(self, "InstanceName",
            type="String",
            default="MV Reemplazar",
            description="Nombre de la instancia a crear"
        )

        ami_id = cdk.CfnParameter(self, "AMI",
            type="String",
            default="ami-0aa28dab1f2852040",
            description="ID de AMI"
        )

        security_group = ec2.SecurityGroup(self, "InstanceSecurityGroup",
            vpc=ec2.Vpc.from_lookup(self, "VPC", is_default=True),
            description="Permitir trafico SSH y HTTP desde cualquier lugar",
            allow_all_outbound=True
        )

        security_group.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(22), "Allow SSH")
        security_group.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(80), "Allow HTTP")

        existing_role_arn = 'arn:aws:iam::439497970624:role/LabRole'
        existing_role = iam.Role.from_role_arn(self, "ExistingRole", existing_role_arn)

        ec2_instance = ec2.Instance(self, "EC2Instance",
            vpc=ec2.Vpc.from_lookup(self, "VPC2", is_default=True),
            instance_type=ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            machine_image=ec2.MachineImage.generic_linux({
                'us-east-1': ami_id.value_as_string
            }),
            security_group=security_group,
            key_name="vockey",
            block_devices=[ec2.BlockDevice(
                device_name="/dev/sda1",
                volume=ec2.BlockDeviceVolume.ebs(20)
            )],
            role=existing_role
        )

        ec2_instance.add_user_data(
            "#!/bin/bash",
            "cd /var/www/html/",
            "git clone https://github.com/utec-cc-2024-2-test/websimple.git",
            "git clone https://github.com/utec-cc-2024-2-test/webplantilla.git",
            "ls -l"
        )

        CfnOutput(self, "InstanceId",
            description="ID de la instancia EC2",
            value=ec2_instance.instance_id
        )

        CfnOutput(self, "InstancePublicIP",
            description="IP publica de la instancia",
            value=ec2_instance.instance_public_ip
        )

        CfnOutput(self, "websimpleURL",
            description="URL de websimple",
            value=f"http://{ec2_instance.instance_public_ip}/websimple"
        )

        CfnOutput(self, "webplantillaURL",
            description="URL de webplantilla",
            value=f"http://{ec2_instance.instance_public_ip}/webplantilla"
        )

