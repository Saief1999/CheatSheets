# Terraform

## Overview

- automate and manage your infrastructure 
	- pltaform
	- services that run on plateform

- open source

- declarative : define WHAT end result you want ( and not imperative -> HOW )

- Used for **provisioning** infrastructure ( in the correct order)
  - Create VPC
  - Create AWS users & permissions
  - spin up servers
  - install Docker

> Terraform is **Idempotent** : If we apply the same configuration multiple times we get the same result.

### Terraform vs Ansible 

Both :
- Infra as code.
- Automate provisioning, configuring and managing the infrastructure.

Terraform:
- Mainly infrastucture provisioning tool
  - CAN deploy apps
- relatively newer, and more advanced in orchestration than Ansible
- **Better** : For infrastructure provisioning

Ansible:
- Mainly a configuration tool
  - configure that infrastructure ( that's already provisioned)
  - deploy apps
  - install / update software 
- **Better** : For configuring that infrastucture

### Terraform advantages

- Managing existing infrastructure ( adding more containers, ect...)

- Replicating infrastructure :
  - Replicate DEV to PROD  to have same infra

- We don't need to rememeber the current state. We just need to know the desired state.

### Terraform Architecture

- It has 2 main components : 
	- **Core** : 
		- which has 2 input sources : 
			- TF-config
			- State : current state of infra
		- Takes input and figures out the **plan** : What needs to be created / updated / destroyed to get the desired state
	- **Providers** : 
		- AWS / Azure : IAAS 
		- Kuberenetes : PAAS
		- Fastly : SAAS
		- Through these **providers** you get access to these **resources**.

### Example Configuration File

#### AWS

```
# Configure the AWS Provider
provider "aws" {
	version = "~> 2.0"
	region = "us-east-1"
}

# Create a VPC
resource "aws_vpc" "example" {
	cidr_block = "10.0.0.0/16"
}
```

#### K8s

```
# Configure the Kubernetes Provider 
provider "kubernetes" {
	config_context_auth_info = "ops"
	config_context_cluster = "mycluster"
}

resource "kubernetes_namespace" "example" {
	metadata {
		name = "my-first-namespace"
	}
}
```


### Declarative vs Imperative

- Terraform is declarative
	- You define the **end state** in your config file ( instead of HOW to achieve that end state ). 
	- e.g. 5 servers with following network config & AWS user with following permissions.

- We see the difference mainly when we want to update our infrastructure ( removing / adding )
	- **Imperative approach** : Remove 2 servers , add firewall config, add permission to AWS user. ( We give **instructions** )
	- **Declarative approach ( Terraform )** : My new desired state is : 7 servers , this firewal config and the user with following permissions. ( **figure out yourself what needs to be done** )
		- We adjust old config 
		- clean and small config files
		- awlays know the current setup

### Terraform Commands for different stages

`refresh` : query infra provider to get current state -> state

`plan` : create an execute plan -> determines what actions are necessary to achieve the desired state 

`apply` : execute the plan ( `refresh` & `plan` )

`destroy` : destroy the resources / infrastructure


### Providers

- expose resources for specific infra plateform
- responsible for understanding API of that plateform and expose them via terraform.
- Just code that knows how to talk to that specific technology


We should first of all start by specifiying the provider. for example :

```groovy
provider "aws" {
	region = "eu-central-1"
	access_key = "xxxxxxx"
	secret_key = "xxxxxxx"
}
```
to install a provider to use with terraform we do this : We select the directory where `main.tf` is and we run

```bash
terraform init  
```

this will download any unavailable providers that are used in our files. and will generate a couple of new files.

## Resources & Data sources

#### Resources

Resources are used to create new resources in our provider.

```groovy
resource "provider_name" "variable_name" {

}
```

- `provider_name` : the name of the resource used for that provider.
- `variable_name` : a name we use for that resource in our code.

##### Creating a resource depending on another resource that doesn't exist yet

```groovy
resource "aws_vpc" "development-vpc" {
	cidr_block = "10.0.0.0/16"
}

  

resource "aws_subnet" "dev-subnet-1" {
	vpc_id = aws_vpc.development-vpc.id
	cidr_block = "10.0.10.0/24"
	availability_zone = "eu-central-1a"
}
```

##### `Apply`
in the terraform project folder we do 

```bash
terraform apply
```

this will give us a summary on the changes ( addition / deletion ). we type `yes` to confirm.


#### Data Sources

Data sources allow data to be fetched for use in TF configuration ( for example, To create a subnet for an existing VPC ).

> Each Subnet need to have different ip range than the other subnets in the VPC ( no overlapping )


```groovy
data "aws_vpc" "existing_vpc" {
	default = true
}

resource "aws_subnet" "dev-subnet-2" {
	vpc_id = data.aws_vpc.existing_vpc.id
	cidr_block = "172.31.48.0/20"
	availability_zone = "eu-central-1a"
}
```


### Change / Destroy a resource

#### Changing a Resource

we can add new **tags** to our vpc. for example `Name` 

```groovy
resource "aws_vpc" "development-vpc" {

	cidr_block = "10.0.0.0/16"

	tags = {
		Name = "development-vpc"
		vpc_env = "dev"
	}

}
```

then we do `terraform apply` and the changes will take place

we can now remove `vpc_env = "dev"` and terraform will make the change and remove the tag.

To track the current state. Terraform uses a file `terraform.tfstate`

#### Removing destroying a resource

Method 1 : Remove the resource from the tf file. and then run `terraform apply`

Method 2 ( should not generally be used ) : Do `terraform destory -target resourceType.resourceName`. To create the resource again we do `terraform apply`

### More Terraform Commands

- `terraform plan` : like `apply` but without actually executing the plan. Just gives a preview of it.

- `terraform apply -auto-approve` : to Auto approve

- `terraform destory` : Go through all the resources in the tf configuration and remove them one by one
	- `-target` : Select a specific target


## State

- `terraform.tfstate` : 
	- This file is first created when we do the first apply. By going to AWS and getting the details ( in case we're using AWS provider ).
	- It saves the current state of our resources.
	- It gets updated with each new `apply` in order to add / remove / update our resources ( we can see that in action in the step `refreshing state...` when we do an `apply`)


- `terraform.tfstate.backup` : 
	- This file contains a backup of the previous state ( before the last `apply` )


to list the resources in our current state, we do this : 

```bash
terraform state list
```

to show a resource in particular from the state 

```bash
terraform state show resourceType.resourceName
```

## Outputs

Output values are like **functions** that can be used to show certain properties of our resources when we run an `apply`.

example : 

```groovy

output "dev-vpc-id" {
	value = aws_vpc.development-vpc.id
}


output "dev-subnet-id" {
	value = aws_subnet.dev-subnet-1.id
}
```

## Variables

They can be very useful, especially when some parts are redundant ( example for dev/prod ). we define a variable like this ( assaging is done later ).

```groovy
variable "subnet_cidr_block" {
	description = "subnet cidr block"
}
```

### Assigning variable value : 

#### Method 1

we can simply do `terraform apply`, any variables that don't have a value will get a prompt before applying the infra.

#### Method 2

we can also do `terraform apply -var "name=value"`

#### Method 3 : Variables file ( best approach)

we put our variables in a file, in a format `name = value`. This file should be name `terraform.tfvars`. We can create multiple `.tfvars` and then reference them in the `apply` command based on our needs ( by adding `-var-file filename.tfvars` )


example 
```groovy
subnet_cidr_block = "10.0.40.0/24"

vpc_cidr_block = "10.0.0.0/16"

  
environment = "development"
```

### Assigning Default value : 

Inside the `variable` block in `main.tf` we can add a default value that will be used if terraform can't find an assigned value for that variable

example. In `main.tf`

```groovy
variable "vpc_cidr_block" {
	description = "vpc cidr block"
	default = "10.0.10.0/24"
}
```

### Type Constraints 

You can specify a certain type for your variable

```groovy
variable "vpc_cidr_block" {
	description = "vpc cidr block"
	default = "10.0.10.0/24"
	type = string
}
```

If we want we can also pass a `list`

```groovy
# In main.tf
variable "vpc_cidr_blocks" {
	description = "vpc cidr blocks"
	type = list(string)
}

# In terraform.tfvars

vpc_cidr_blocks = [ "10.0.0.1", "10.0.0.1"]

# We access it like this. In main.tf
resource "..." "..." {
	... = var.cidr_blocks[0]
}

```

and then we assign it, and treat it as a list.


Or we can pass objects and have string constraints.


```groovy
# In main.tf
variable "vpc_cidr_blocks" {
	description = "vpc cidr blocks"
	type = list(object({
		cidr_block = string,
		name = string
	})
}

# In terraform.tfvars

vpc_cidr_blocks = [{
	cidr_block = "10.0.0.0/16",
	name = "dev-vpc"
}]

# We access it like this. In main.tf
resource "..." "..." {
	... = var.cidr_blocks[0].name
}

```


## Environment Variables

Useful if we want to hide credentials instead of adding them to our IAC files.

### Method 1 : Terminal Env variables

we add `AWS_SECRET_ACCESS_KEY` and `AWS_ACCESS_KEY_ID` to our terminal environment. When we run `terraform apply` terraform will be able to pick them up and use them to auth to AWS.

### Method 2 : use AWS CLI config file

the config file for credentials for AWS CLI is under `~/.aws/credentials`

terraform will be able to use these credentials to authenticate to AWS directly. So we can simply run `terraform apply`

### Define custom environment variable

they should start with `TF_VAR_name`, for example : 

```bash
export TF_VAR_avail_zone="eu-west-3a"
```

then we add our variable to our file

```groovy
variable avail_zone {}
```

Then we can simply use it in any resource by calling

```groovy
var.avail_zone
```


## Create Remote Git Repo

- safekeeping
- history of changes
- team collaboration
- review infra changes using merge requests

a few files should not be added to git and should inside the `.gitignore`, such as : 

- `.terraform` : stores the providers that are installed locally
- `terraform.tfstate` : this is a local state, created when we do `terraform apply` and should be ignored
- `terraform.tfstate.backup` : previous state that should be ignored too
- `terraform.tfvars` : In addition to any other variable files, because they might contain sensitive data.


however `.terraform.lock.hcl` should be added to the git repo so that the different team members have the same version for the diffferent providers.

## Practical : Automate AWS Infrastructure

Best Practice in Terraform : Create inftrastructure from scratch without touching the default one ( default VPC, subnet... )
1. Create custom VPC
2. Create one subnet in one Availability zone of the VPC
3. Connect these VPC to internet using an internet gateway
4. Inside the subnet we will create an EC2 instance
5. Deploy nginx Docker container
6. Create Security Group ( Firewall )

### VPC and Subnet

```groovy
provider "aws" {
	region = "eu-central-1"
}

# eu-central-1a

variable vpc_cidr_block {}
variable subnet_cidr_block {}
variable avail_zone {}
variable env_prefix {}

resource "aws_vpc" "myapp-vpc" {

	cidr_block = var.vpc_cidr_block
	
	tags = {
		Name = "${var.env_prefix}-vpc"
	}

}
  
resource "aws_subnet" "myapp-subnet-1" {

	vpc_id = aws_vpc.myapp-vpc.id
	cidr_block = var.subnet_cidr_block
	availability_zone = var.avail_zone
	
	tags = {
		Name = "${var.env_prefix}-subnet-1"
	}

}
```

#### Routing for VPC & routing table

Route table : Represents the virtual router in our VPC, created by default with each VPC. generally the id is `rtb-******`. It handles all the traffic **within** our VPC.

to connect our VPC to the internet. We need to add a link an internet gateway to its route table -> **By creating a new route** ( same thing done for the Default VPC )


internal routing is configured by default for each route table so we should not configure it. We should focus on configuring the internet gateway. 

```groovy
resource "aws_internet_gateway" "myapp-igw" {

vpc_id = aws_vpc.myapp-vpc.id

tags = {
	Name = "${var.env_prefix}-igw"
}
}

resource "aws_route_table" "myapp-route-table" {

vpc_id = aws_vpc.myapp-vpc.id

route {
	cidr_block = "0.0.0.0/0"
	gateway_id = aws_internet_gateway.myapp-igw.id
}

tags = {
	Name = "${var.env_prefix}-rtb"
}

}
```

Network ACL : Created by default with each subnet for a VPC ( NACL ). Represents the firewall ( inbound / outbound rules... ) -> open by default

> Security group is the firewall on the server level -> closed by default

##### Subnet Association with Route table

after creating the route table. we need to associate subnets to it so that traffic from the subnet can also be handled by the route table.

By default subnets are associated to the **main** route table ( the one which is described as Main in the UI ).

For that, after creating a route table. we need to associate subnets **explicitly** to it ( since it won't be the main one ).

```groovy
resource "aws_route_table_association" "a-rtb-subnet" {
	subnet_id = aws_subnet.myapp-subnet-1.id
	route_table_id = aws_route_table.myapp-route-table.id
}
```

#### Routing for VPC & routing table : Using the default route table

When we create a VPC a default route table gets created ( it's also main ). But it doesn't have internet access. We can use it and add the internet gatway to it ( without creating a new route table ). So we won't have to creating a new `aws_route_table` and `aws_route_table_association` resources.

```groovy
resource "aws_default_route_table" "main-rtb" {

default_route_table_id = aws_vpc.myapp-vpc.default_route_table_id

route {
	cidr_block = "0.0.0.0/0"
	gateway_id = aws_internet_gateway.myapp-igw.id
}


tags = {
	Name = "${var.env_prefix}-main-rtb"
}

}
```

> we can use `terraform state show resourceType.resourceName` to show all the metadata for a certain resource ( and to determine which fields we might need )

### Create Security group

A security group is created by default for each region and for each newly created VPC. But we can always create a new one instead of using the default.

Incoming traffic : -> `ingress`
  - ssh into EC2
  - access from browser

outgoing traffic : -> `egress`
  - installations inside server
  - fetch Docker image

```python
resource "aws_security_group" "myapp-sg" {

	name = "myapp-sg"
	
	vpc_id = aws_vpc.myapp-vpc.id
	
	# Incoming
	ingress {
	
		from_port = 22
		# We can make this 1000 to have ports 22 -> 1000 all open
		to_port 22 
		
		protocol = "tcp"
		
		# range of ip addresses that can access through these ports. /32 means we have only one address.
		
		cidr_block = [var.my_ip]
	}
	# Incoming 2 - Allow access to anyone into web server
	
	ingress {
		from_port = 8080
		to_port = 8080
		protocol = "tcp"
		cidr_blocks = ["0.0.0.0/0"]
	}
	
	egress {
		from_port = 0 
		to_port = 0
		protocol = "-1"
		cidr_block = ["0.0.0.0/0"]
		prefix_list_ids = []
	}

	tags = {
		Name = "${var.env_prefix}-sg" 
	}
}
```

### Using the Default security group for the VPC

Since a security group is created by default with each VPC. we can just use that one.

We can use the same thing we used above but with these changes : 
- remove the `name` field since it isn't needed
- change `aws_security_group` -> `aws_default_security_group`
- The rules should stay unchanged and everything else stays the same.

### Creating an EC2 instance

#### Getting the ami id 

Note that the AMI id **for the same machine** can be different across regions. And it can be dynamic and change when it's updated. That's why we need to set it dynamically buy querying first to get the idd.

```groovy
data "aws_ami" "latest-amazon-linux-image" {
	most_recent = true
	# owner can be amazon, community, .... we get it from the AMI list on the gui AWS
	owners = ["amazon"]
	filter {
		name = "name"
		values = ["amzn2-ami-*-gp2"]
	}
	filter {
		name = "virtualization-type"
		values = ["hvm"]
	}
}
```

We now set the instance type in a variable and create our resource

```groovy
resource "aws_instance" "myapp-server" {
	ami = data.aws_ami.latest-amazon-linux-image.id
	instance_type = var.instance_type
	
	subnet_id = aws_subnet.myapp-subnet-1.id
	vpc_security_group_ids = [aws_default_security_group.default-sg.id]
	availability_zone = var.avail_zone
	
	associate_public_ip_address = true 
	key_name = saief-key

	tags = {
		Name = "${var.env_prefix}-server"
	}
}
```

>Only the ami and the instance_type are required. All the other different params are optional. By default **the Default VPC is selected for the instance**


#### Automate key pair

we just need to provide the location of our public key. aws will create a private key from it. Then we can use the key pair when provisioning our EC2 instance.


