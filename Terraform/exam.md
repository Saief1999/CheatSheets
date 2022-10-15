## Tutorials

### Why IAC With terraform ?

Advantages of using Terraform 

- Multiple cloud plateforms
- Configuration for Humans
- Track resources with state
- Collaborate with Terraform cloud

To manage infra in terraform : 

- Scope : Identify the infrastructure of your project.
- Author : Write configuration to define your infrastructure.
- Initialize : Install the required Terraform providers.
- Plan : Preview the changes Terraform will make.
- Apply : Make the changes to your infrastructure.

Terraform backends, such as terraform cloud, can be used to share the state with our teammates and prevent race conditions when many people make changes to the configuration at once.

Terraform cloud can be connected to Version Control Systems such as Github, Gitlab, ect...

### Lock at Upgrade Provider Versions

when running `terraform init` for the first time. Terraform will generate a `.terraform.lock.hcl` file representing the versions of the different providers ( while meeting the constraints inside the `terraform.tf` and its `required_providers` block)

After that, when another user does `terraform init` he will end up with the provider versions in the lock file. If the lock file isn't found we will get **the latest versions that meet the constratints**.

If we want to update the versions inside the lock file we do 

```bash
terraform init -upgrade
```


example of `terraform.tf` ( can be also inside `main.tf` as the first block )

```groovy
terraform {
  required_providers {
    random = {
      source  = "hashicorp/random"
      version = "3.0.0"
    }

    aws = {
      source  = "hashicorp/aws"
      version = "~> 2.0.0"
    }
  }

  required_version = ">= 1.1"
}
```

`~>` : means that only the **rightmost digit** is allowed to change ( for example: 2.0.10 is accepted, but 2.1.0 is not )

### Build infrastructure 

resource blocks can be physical ( such as an EC2 instance ). or logical ( such as a heroku application)

the resource type and the resource name are used to create a unique id for each resource in the config file.

to format the config file we do 

```bash
terraform fmt
```

to validate the configuration file we do 

```bash
terraform validate
```

#### Inspect the state

to inspect the current state we do 

```bash
terraform show
```

We can also see the different resources by doing 

```bash
terraform state list
```

You can show the state of a certain resource by doing

```bash
terraform state show resourceType.resourceName
```


### Destroying infrastructure

By doing 
```
terraform destroy
```

Terraform will determine the order it needs to destroy all resources in.

or we can destroy somthing in particular

```
terraform destroy -target resourceType.resourceName
```


### Store Remote state

Useful when collaborating with others. we use a remote backend such the terraform cloud backend. it can also save credentials securely.

We simply create an organization on terraform cloud, add the organization and a new workspace name to our config file, then we do a `terraform init`

```groovy
terraform {
	backend "remote" {
		organization = "insat"
		
		workspaces {
			name = "Example-workspace"
		}
	}
		
	required_providers {
		aws = {
			source = "hashicorp/aws"
			version = "~> 4.16"
		}
	}
	
	required_version = ">= 1.2.0"
}
```


we then remove `terraform.tfstate`, it will be managed by terraform cloud.

We can choose two ways of executing the commands. either local execution or remote execution. In both ways the state file will always be written to terraform cloud and not locally.



### Customize Terraform Configuration with Variables

Type constraints are created from a mixture of type keywords and type constructors. The supported type keywords are:

-   [`string`](https://www.terraform.io/language/values/variables#string)
-   [`number`](https://www.terraform.io/language/values/variables#number)
-   [`bool`](https://www.terraform.io/language/values/variables#bool)

The type constructors allow you to specify complex types such as collections:

-   [`list(<TYPE>)`](https://www.terraform.io/language/values/variables#list) : A sequence of values of the same type
-   [`set(<TYPE>)`](https://www.terraform.io/language/values/variables#set) : An unordered collection of unique values, all of the same type.
-   [`map(<TYPE>)`](https://www.terraform.io/language/values/variables#map) : A lookup table, matching keys to values, all of the same type.
-   [`object({<ATTR NAME> = <TYPE>, ... })`](https://www.terraform.io/language/values/variables#object) : A lookup table, matching a fixed set of keys to values of specified types.
-   [`tuple([<TYPE>, ...])`](https://www.terraform.io/language/values/variables#tuple) : A fixed-length sequence of values of specified types.



The keyword `any` may be used to indicate that any type is acceptable. For more information on the meaning and behavior of these different types, as well as detailed information about automatic conversion of complex types, see [Type Constraints](https://www.terraform.io/language/expressions/types).

If both the `type` and `default` arguments are specified, the given default value must be convertible to the specified type.


The Terraform `console` command opens an interactive console that you can use to evaluate expressions in the context of your configuration. This can be very useful when working with and troubleshooting variable definitions.

example of using a map of strings

```groovy
variable "resource_tags" {
  description = "Tags to set for all resources"
  type        = map(string)
  default     = {
    project     = "project-alpha",
    environment = "dev"
  }
}
```

we can access it from the `console` like this

```bash
> var.resource_tags["environment"]
"dev"
```


#### Interpolate variables in strings

Terraform configuration supports string interpolation — inserting the output of an expression into a string. This allows you to use variables, local values, and the output of functions to create strings in your configuration.

for example 

```groovy
name = "lb-${random_string.lb_id.result}-project-alpha-dev"
```

#### Variable validation

Can be used if we want to add custom logic to validate our variables. For example

```groovy
variable "resource_tags" {
  description = "Tags to set for all resources"
  type        = map(string)
  default     = {
    project     = "my-project",
    environment = "dev"
  }

  validation {
    condition     = length(var.resource_tags["project"]) <= 16 && length(regexall("[^a-zA-Z0-9-]", var.resource_tags["project"])) == 0
    error_message = "The project tag must be no more than 16 characters, and only contain letters, numbers, and hyphens."
  }

  validation {
    condition     = length(var.resource_tags["environment"]) <= 8 && length(regexall("[^a-zA-Z0-9-]", var.resource_tags["environment"])) == 0
    error_message = "The environment tag must be no more than 8 characters, and only contain letters, numbers, and hyphens."
  }
}
```

The `regexall()` function takes a regular expression and a string to test it against, and returns a list of matches found in the string. In this case, the regular expression will match a string that contains anything other than a letter, number, or hyphen.



### Output Data from Terraform
Terraform output values allow you to export structured data about your resources. You can use this data to configure other parts of your infrastructure with automation tools, or as a data source for another Terraform workspace. Outputs are also necessary to share data from a child module to your root module.

Output declarations can appear anywhere in your Terraform configuration files. However, we recommend putting them into a separate file called `outputs.tf` to make it easier for users to understand your configuration and what outputs to expect from it.


```groovy
output "lb_url" {
  description = "URL of load balancer"
  value       = "http://${module.elb_http.this_elb_dns_name}/"
}

output "web_server_count" {
  description = "Number of web servers provisioned"
  value       = length(module.ec2_instances.instance_ids)
}

```


**Terraform stores output values in its state file. In order to see these outputs, you need to update the state by applying this new configuration, even though the infrastructure will not change.**

#### Query outputs

Now that Terraform has loaded the outputs into your project's state, use the `terraform output` command to query all of them.

```bash
$ terraform output
lb_url = "http://lb-5YI-project-alpha-dev-2144336064.us-east-1.elb.amazonaws.com/"
vpc_id = "vpc-004c2d1ba7394b3d6"
web_server_count = 4
```

Next, query an individual output by name. (Starting with version 0.14, Terraform wraps string outputs in quotes by default. You can use the `-raw` flag when querying a specified output for machine-readable format. )

```bash
terraform output lb_url
"http://lb-5YI-project-alpha-dev-2144336064.us-east-1.elb.amazonaws.com/"
```

#### Redact sensitive outputs

You can designate Terraform outputs as _sensitive_. Terraform will redact the values of sensitive outputs to avoid accidentally printing them out to the console. Use sensitive outputs to share sensitive data from your configuration with other Terraform modules, automation tools, or Terraform Cloud workspaces.

Terraform will redact sensitive outputs when planning, applying, or destroying your configuration, or when you query all of your outputs. Terraform will **not** redact sensitive outputs in other cases, such as when you query a specific output by name, query all of your outputs in JSON format, or when you use outputs from a child module in your root module.

```groovy
output "db_username" {
  description = "Database administrator username"
  value       = aws_db_instance.database.username
  sensitive   = true
}

output "db_password" {
  description = "Database administrator password"
  value       = aws_db_instance.database.password
  sensitive   = true
}
```

#### Generate machine-readable output

The Terraform CLI output is designed to be parsed by humans. To get machine-readable format for automation, use the `-json` flag. Note that any sensitive values will show up.

```
terraform output -json
```


### Query Data Sources

### Perform Dynamic Operations with Functions

The Terraform configuration language allows you to write declarative expressions to create infrastructure. While the configuration language is not a programming language, you can use several built-in functions to perform operations dynamically.

#### Use `templatefile` to dynamically generate a script

AWS lets you configure EC2 instances to run a user-provided script -- called a user-data script -- at boot time. You can use Terraform's [`templatefile` function](https://www.terraform.io/docs/language/functions/templatefile.html) to interpolate values into the script at resource creation time. This makes the script more adaptable and re-usable.

inside our ec2 resource config we add this : 

```hcl
user_data = templatefile("user_data.tftpl", { department = var.user_department, name = var.user_name })
```

where user_data.tftpl is a shell script with interpolations `${...}` like this

```
sudo groupadd -r ${department}
```




#### Use `lookup` function to select AMI

The [`lookup` function](https://www.terraform.io/docs/language/functions/lookup.html) retrieves the value of a single element from a map, given its key.

example 

```
variable "aws_amis" {
  type = map
  default = {
    "us-east-1" = "ami-0739f8cdb239fe9ae"
    "us-west-2" = "ami-008b09448b998a562"
    "us-east-2" = "ami-0ebc8f6f580a04647"
  }
}
```


```
ami = lookup(var.aws_amis, var.aws_region)
```



### Manage Resources in Terraform State

if we want to re create a certain resource in terraform we can use the `-replace` flag. For example : 

```bash
# We can also do "plan" with same arg to see the changes 
terraform apply -replace="aws_instance.example" 
```


#### Move a resource to a different state file

Some of the Terraform state subcommands are useful in very specific situations. HashiCorp recommends only performing these advanced operations as the last resort.

The `terraform state mv` command moves resources from one state file to another. You can also rename resources with `mv`. **The move command will update the resource in state, but not in your configuration file.** Moving resources is useful when you want to combine modules or resources from other states, but do not want to destroy and recreate the infrastructure.

example 

```bash
terraform state mv -state-out=../terraform.tfstate aws_instance.example_new aws_instance.example_new
```

#### Remove a resource from state

The `terraform state rm` subcommand removes specific resources from your state file. This does not remove the resource from your configuration or destroy the infrastructure itself.

for example : 

```bash
terraform state rm aws_security_group.sg_8080
```

#### Refresh modified infrastructure

The `terraform refresh` command updates the state file when physical resources change outside of the Terraform workflow.

> **Note:** Terraform automatically performs a `refresh` during the `plan`, `apply`, and `destroy` operations. All of these commands will reconcile state by default, and have the potential to modify your state file.


### Import Terraform Configuration

Terraform also supports bringing existing infrastructure under its management. To do so, you can use the `import` command to migrate resources into your Terraform state file. The `import` command does not currently generate the configuration for the imported resource, so you must write the corresponding configuration block to map the imported resource to it.

Bringing existing infrastructure under Terraform's control involves five steps:

1.  Identify the existing infrastructure you will import.
2.  Import infrastructure into your Terraform state.
3.  Write Terraform configuration that matches that infrastructure.
4.  Review the Terraform plan to ensure the configuration matches the expected state and infrastructure.
5.  Apply the configuration to update your Terraform state.



run `terraform import` to attach the existing Docker container to the `docker_container.web` resource you just created. Terraform import requires this Terraform resource ID and the full Docker container ID.

```bash
terraform import docker_container.web $(docker inspect --format="{{.ID}}" hashicorp-learn)
```

There are two approaches to update the configuration in `docker.tf` to match the state you imported. You can either accept the entire current state of the resource into your configuration as-is or cherry-pick the required attributes into your configuration one at a time. You may find both of these approaches useful in different circumstances.

-   Using the current state is often faster, but can result in an overly verbose configuration since every attribute is included in the state, whether it is necessary to include in your configuration or not.
-   Cherry-picking the required attributes can lead to more manageable configuration, but requires you to understand which attributes need to be set in the configuration.

#### Limitations and other considerations

There are several important things to consider when importing resources into Terraform.

-   Terraform import can only know the current state of infrastructure as reported by the Terraform provider. It does not know:
    
    -   whether the infrastructure is working correctly
    -   the intent of the infrastructure
    -   changes you've made to the infrastructure that aren't controlled by Terraform — for example, the state of a Docker container's filesystem.
-   Importing involves manual steps which can be error prone, especially if the person importing resources lacks the context of how and why those resources were created in the first place.
    
-   Importing manipulates the Terraform state file, you may want to create a backup before importing new infrastructure.
    
-   Terraform import doesn't detect or generate relationships between infrastructure.
    
-   Terraform doesn't detect default attributes that don't need to be set in your configuration.
    
-   Not all providers and resources support Terraform import.
    
-   Just because infrastructure has been imported into Terraform does not mean that it can be destroyed and recreated by Terraform. For example, the imported infrastructure could rely on other unmanaged infrastructure or configuration.
    
-   You may need to set local variables equivalent to the remote workspace variables to import to a [remote backend](https://www.terraform.io/docs/language/settings/backends/remote.html). The `import` command always runs locally—unlike commands like `apply`, which run inside your Terraform Cloud environment. Because of this,`import` will not have access to information from the remote backend, such as workspace variables, unless you set them locally.
    

Following Infrastructure as Code (IaC) best practices such as [immutable infrastructure](https://www.hashicorp.com/resources/what-is-mutable-vs-immutable-infrastructure/) can help prevent many of these problems, but infrastructure created by hand is unlikely to follow IaC best practices.

Tools such as [Terraformer](https://github.com/GoogleCloudPlatform/terraformer) to automate some manual steps associated with importing infrastructure. However, these tools are not part of Terraform itself, and not endorsed or supported by HashiCorp.

### Manage Resource Drift

The Terraform state file is a record of all resources Terraform manages. You should not make manual changes to resources controlled by Terraform, because the state file will be out of sync, or "drift," from the real infrastructure. If your state and configuration do not match your infrastructure, Terraform will attempt to reconcile your infrastructure, which may unintentionally destroy or recreate resources.

#### Run a refresh-only plan

by doing :
```
terraform plan -refresh-only
```

We can see the changes that were made outside of terraform scope on the described resources **without changing the  state file**. This is safer than `terraform refresh` 

##### Review Terraform's refresh functionality
In previous versions of Terraform, the only way to refresh your state file was by using the `terraform refresh` subcommand. However, this was less safe than the `-refresh-only` plan and apply mode since it would automatically overwrite your state file without giving you the option to review the modifications first. In this case, that would mean automatically dropping all of your resources from your state file.

The `-refresh-only` mode for `terraform plan` and `terraform apply` operations makes it safer to check Terraform state against real infrastructure by letting you review proposed changes to the state file. It lets you avoid mistakenly removing an existing resource from state and gives you a chance to correct your configuration.

A refresh-only `apply` operation also updates outputs, if necessary. If you have any other workspaces that use the `terraform_remote_state` data source to access the outputs of the current workspace, the `-refresh-only` mode allows you to anticipate the downstream effects.


### Terraform troubleshooting

`terraform fmt` only parses your HCL for interpolation errors or malformed resource definitions, which is why you should use `terraform validate` after formatting your configuration to check your configuration in the context of the providers' expectations.

### Modules overview

#### What are modules for?
- Organize configuration
- Encapsulate configuration
- Re-use configuration
- Provide consistency and ensure best practices

#### What is a terraform module

A Terraform module is a set of Terraform configuration files in a single directory. Even a simple configuration consisting of a single directory with one or more `.tf` files is a module. When you run Terraform commands directly from such a directory, it is considered the **root module**. So in this sense, every Terraform configuration is part of a module. You may have a simple set of Terraform configuration files such as:

```
.
├── LICENSE
├── README.md
├── main.tf
├── variables.tf
├── outputs.tf
```

#### Calling modules
Terraform commands will only directly use the configuration files in one directory, which is usually the current working directory. However, your configuration can use module blocks to call modules in other directories. When Terraform encounters a module block, it loads and processes that module's configuration files.

A module that is called by another configuration is sometimes referred to as a "child module" of that configuration.


#### Local and remote modules

The `terraform get` command is used to download and update [modules](https://www.terraform.io/language/modules/develop) mentioned in the root module.


Modules can either be loaded from the local filesystem, or a remote source. Terraform supports a variety of remote sources, including the Terraform Registry, most version control systems, HTTP URLs, and Terraform Cloud or Terraform Enterprise private module registries.

#### Module best practices

In many ways, Terraform modules are similar to the concepts of libraries, packages, or modules found in most programming languages, and provide many of the same benefits. Just like almost any non-trivial computer program, real-world Terraform configurations should almost always use modules to provide the benefits mentioned above.

We recommend that every Terraform practitioner use modules by following these best practices:

1.  Name your provider `terraform-<PROVIDER>-<NAME>`. You must follow this convention in order to [publish to the Terraform Cloud or Terraform Enterprise module registries](https://www.terraform.io/docs/cloud/registry/publish.html).
    
2.  Start writing your configuration with modules in mind. Even for modestly complex Terraform configurations managed by a single person, you'll find the benefits of using modules outweigh the time it takes to use them properly.
    
3.  Use local modules to organize and encapsulate your code. Even if you aren't using or publishing remote modules, organizing your configuration in terms of modules from the beginning will significantly reduce the burden of maintaining and updating your configuration as your infrastructure grows in complexity.
    
4.  Use the public Terraform Registry to find useful modules. This way you can more quickly and confidently implement your configuration by relying on the work of others to implement common infrastructure scenarios.
    
5.  Publish and share modules with your team. Most infrastructure is managed by a team of people, and modules are important way that teams can work together to create and maintain infrastructure. As mentioned earlier, you can publish modules either publicly or privately. We will see how to do this in a future tutorial in this series.

Example : 

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.14.0"

  name = var.vpc_name
  cidr = var.vpc_cidr

  azs             = var.vpc_azs
  private_subnets = var.vpc_private_subnets
  public_subnets  = var.vpc_public_subnets

  enable_nat_gateway = var.vpc_enable_nat_gateway

  tags = var.vpc_tags
}
```

#### Set values for module input variables

Modules can contain both required and optional arguments. You must specify all required arguments to use the module. Most module arguments correspond to the module's input variables. Optional inputs will use the module's default values if not explicitly defined.

#### Meta-arguments
Along with `source` and `version`, Terraform defines a few more optional meta-arguments that have special meaning across all modules, described in more detail in the following pages:

-   [`count`](https://www.terraform.io/language/modules/syntax#count) - Creates multiple instances of a module from a single `module` block. See [the `count` page](https://www.terraform.io/language/meta-arguments/count) for details.
    
-   [`for_each`](https://www.terraform.io/language/modules/syntax#for_each) - Creates multiple instances of a module from a single `module` block. See [the `for_each` page](https://www.terraform.io/language/meta-arguments/for_each) for details.
    
-   [`providers`](https://www.terraform.io/language/modules/syntax#providers) - Passes provider configurations to a child module. See [the `providers` page](https://www.terraform.io/language/meta-arguments/module-providers) for details. If not specified, the child module inherits all of the default (un-aliased) provider configurations from the calling module.
    
-   [`depends_on`](https://www.terraform.io/language/modules/syntax#depends_on) - Creates explicit dependencies between the entire module and the listed targets. See [the `depends_on` page](https://www.terraform.io/language/meta-arguments/depends_on) for details.


#### Review root input variables
Using input variables with modules is similar to using variables in any Terraform configuration. A common pattern is to identify which module arguments you may want to change in the future, and create matching variables in your configuration's `variables.tf` file with sensible default values. You can pass the variables to the module block as arguments.

You do not need to set all module input variables with variables. For example, if your organization requires NAT gateway enabled for all VPCs, you should not use a variable to set the `enable_nat_gateway` argument.

```hcl
variable "vpc_name" {
  description = "Name of VPC"
  type        = string
  default     = "example-vpc"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "vpc_azs" {
  description = "Availability zones for VPC"
  type        = list(string)
  default     = ["us-west-2a", "us-west-2b", "us-west-2c"]
}
```

#### Review root output variables

Modules also have output values. You can reference them with the `module.MODULE_NAME.OUTPUT_NAME` naming convention. In the Terraform Registry for the module, click on the **Outputs** tab to find [all outputs](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/3.14.0?tab=outputs) for the module.

You can reference module outputs in other parts of your configuration. Terraform will not display module outputs by default. You must create a corresponding output in your root module and set it to the module's output. This tutorial shows both cases.

Open `outputs.tf` to find the module outputs.

```hcl
output "vpc_public_subnets" {
  description = "IDs of the VPC's public subnets"
  value       = module.vpc.public_subnets
}

output "ec2_instance_public_ips" {
  description = "Public IP addresses of EC2 instances"
  value       = module.ec2_instances[*].public_ip
}
```


#### Understanding how modules work

In this example, the `vpc_public_subnets` output references the `vpc` module's `public_subnets` output, and `ec2_instance_public_ips` references the public IP addresses for both EC2 instances created by the module.

When using a new module for the first time, you must run either `terraform init` or `terraform get` to install the module. When you run these commands, Terraform will install any new modules in the `.terraform/modules` directory within your configuration's working directory. For local modules, Terraform will create a symlink to the module's directory. Because of this, any changes to local modules will be effective immediately, without having to reinitialize or re-run `terraform get`.

After following this tutorial, your `.terraform/modules` directory will look like the following.

```plaintext
.terraform/modules/
├── ec2_instances
├── modules.json
└── vpc
```

#### Provision Infrastructure with Cloud-Init

When you create a generic compute resource in Terraform, your virtual machine (VM) may not have much capability because it is a "fresh" install and needs to be provisioned with the software you want to use. Manually installing the necessary software and its respective dependencies on each VM is time consuming and difficult to maintain at scale.

[`cloud-init`](https://cloudinit.readthedocs.io/en/latest/) is a standard configuration support tool available on most Linux distributions and all major cloud providers. `cloud-init` allows you to pass a shell script to your instance that installs or configures the machine to your specifications.


### The Sentinel CLI

Terraform Cloud uses Sentinel as part of [Teams & Governance](https://www.hashicorp.com/products/terraform/offerings) to enable granular policy control for your infrastructure. Sentinel is a language and policy framework, which restricts Terraform actions to defined, allowed behaviors. Policy authors manage Sentinel policies in Terraform Cloud with policy sets, which are groups of policies. Organization owners control the scope of policy sets by applying certain policy sets to the entire organization or to select workspaces.

The Policy-as-Code framework enables you to treat your governance requirements as you would your applications: written by operators, controlled in VCS, reviewed, and automated during your deployment process.


### Inject secrets into terraform using the vault provider

### Create resource dependencies

Most of the time, Terraform infers dependencies between resources based on the configuration given, so that resources are created and destroyed in the correct order. Occasionally, however, Terraform cannot infer dependencies between different parts of your infrastructure, and you will need to create an explicit dependency with the `depends_on` argument.

#### Manage explicit dependencies
Implicit dependencies are the primary way that Terraform understands the relationships between your resources. Sometimes there are dependencies between resources that are _not_ visible to Terraform, however. The `depends_on` argument is accepted by any resource or module block and accepts a list of resources to create _explicit dependencies_ for.

```groovy
resource "aws_s3_bucket" "example" { }

resource "aws_instance" "example_c" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"

  depends_on = [aws_s3_bucket.example]
}

module "example_sqs_queue" {
  source  = "terraform-aws-modules/sqs/aws"
  version = "3.3.0"

  depends_on = [aws_s3_bucket.example, aws_instance.example_c]
}
```


