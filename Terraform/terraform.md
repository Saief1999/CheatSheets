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