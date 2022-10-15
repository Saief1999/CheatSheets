# Devops

## Virtualization


a Hypervisor vrtualizes the resources of the Host OS so they can be used by Guest OS's ( virtual machines ) later on. Two types exist : 

- Native or Bare Metal : Runs Directly On the host's hardware ( no OS needed ) : Used generally by cloud providers. Example : Hyper-V
- Hosted : Runs within a traditional OS ( as a distinct software layer ) : Used by personal computers. Example : Oracle VM virtualBox

## Networking

Any device needs 3 pieces of data for communication

- IP Address
- Subnet
- Gateway

### Switch

- Sits within the LAN  
- Faciliates the connection between all the devices within the LAN

### Router

- Sits between LAN and outside networks ( WAN )
- Connects devices on LAN and WAN
- **Allows networked devices to access the internet**

### Gateway

- Gateway : IP address or router

### Subnet

- Subnet is a **logical subdivision of an IP network**
- **Subnetting** is the process of divideing network into 2 or more networks
- Devies in the LAN belong to same IP address range
  - Example : Gateway 192.168.0.0, Subnet Mask 255.255.255.0 , IP's **192.168.0**.x
- Mask : 255 -> fixates the Octet, 0 -> means free range

### CIDR Block : Classless Inter-Domain Routing

- CIDR blocks are groups of addresses that share the  same prefix and contain the same number of bits.
- Subnet mask dictates how many bits are fixed.
- CIDR notation looks like this :
	- 192.168.0.0/16 ( **/16** bits are fixed )
	- 192.168.0.0/24 ( **/24** bits are fixed )

### NAT : Network Address Translation

- NAT is a way to **map multiple local private addresses to a public one** before transferring the information
- So if you make a request to the internet, the router  replaces your private IP address with the router's IP

**Why?**

- IP address within LAN are not visible to the outside network or internet, meaning they are private IPs
- This was necessary because there is only a limited number of IPv4 addresses available

**Benefits of NAT**

- **Security** and protection of devices within LAN
- **Reuse** IP addresses


### Firewall

- A Firewall prevents unauthorized access from  entering a private network
- So by default, the server is not accessible from outside the LAN
- Using **Firewall Rules** you can define, which requests are allowed:
	- Which IP address in your network is accessible
	- Which IP address can access your server
	- For example: You can allow any device access your server

### Port

- Every device has a set of ports
- **Each port is unique** on a device
- You can allow **specific ports** (doors) AND **specific IP addresses** (guests)
- For every application you need a port
- Different applications **listen** on specific ports
- There are many standard ports for many applications : 
	- Web servers: Port **80**
	- Mysql DB: Port **3306**
	- PostgreSQL DB: Port **5432**

### DNS : Domain Name System

- DNS translates human readable domain names (for example: www.amazon.com) to machine readable IP addresse
- Domain Names : 
	- Formed by the rules and procedures of the DNS
	- Organized in subordinate levels (subdomains) of the DNS root domain, which is nameless
- The first level set of domain names are the **top-level domains (TLDs)**. Example: `.com` , `.edu` ...
- Below are the second-level and third-level domain names that are open for end-users

#### ICANN

- Manages the TLD development and architecture of the internet domain space
- Authorizes Domain Name Registrars, which register and assign domain names

#### How DNS resultion works

- When you enter a website in a browser, a DNS client on your computer needs to look  up the corresponding IP address
- It queries DNS servers to resolve the name DNS queries can resolve in different ways
- **DNS Cache**: A client can sometimes answer a query locally using cached (stored) information obtained from a previous query. Or the DNS server can use its own cache of resource record information to answer a query.
- Request Flow : 
	- Name Server: Usually your Internet Service Provider
	- Root Server: Requests for top level domains
	- TLD Server: Stores the address information for top level domains
	- Authoritative Name Server: Responsible for knowing everything about the domain, including IP address


### Networking Commands
- `ifconfig` : Getting network configuration
- `netstat` : Network connections, routing tables, interface statistics
- `ps aux` : Monitor processes running on your Linux system
- `nslookup` : Query DNS lookup name
- `ping` : Test network connection

## Artifact repository manager with Nexus

### Artifact repository
- Artifact = Apps built into a single file ( Jar, War, ZIP, TAR...)
- Artifact repository = storage of those artifacts

### Artifact repository manager

- different applications need different repositories for them
- An artifact repository manager maanges different types of artifact

### Nexus 

- Nexus is one of the most popular
- upload and store different built artifacts
- retrieve (download) artifacts later
- central storage
- **private**

- examples of **public** repository managers : 
	- maven central repository
	- npm


#### Features of Repository Manager 

- Integrates with LDAP
- flexible and prowerful REST API for integration with other tools
	- For build automation / CICD ( push to Nexus after building the jar on Jenkins , then send it from nexus to your server  )
- backup and restore
- multiple repository type support ( different file types - zip, tar, docker ect. )
- metadata tagging ( labeling and tagging artifacts )
- cleanup policies ( cleanup unnecessary artifacts ) -> automatically delete files that match condition for example
- Search functionality
- user token support for system user authentication

### Installation

after untaring the tar
- Nexus : contains binaries to run nexus
- sonartype-work/nexus : contains own config for Nexus and data ( so when we uninstall the binary we won't uninstall the config)
	- subdirectories depending on your Nexus configuration
	- IP address that accessed Nexus
	- Logs of Nexus App
	- Your uploaded files and metadata
	- You can use this folder for backup

Starting Nexus : 
  - Services should not run with Root user permissions
  - **Best practice** : Create own User for Service ( e.g Nexus) having only the privileges it needs

---

We create a new user `nexus`

then we change the ownership( user:group) of our directories to the nexus user

```bash
sudo chown -R nexus:nexus nexus-3.40.1-01
sudo chown -R nexus:nexus sonatype-work/
```

we need to give read/write privileges to sonartype-work folder and execute privilege to nexus executable


```bash
vim nexus-3.40.1-01/bin/nexus.rc

# change run_as_user="nexus"

su - nexus

/opt/nexus-*/bin/nexus start


netstat -lnpt # see currently listening ports
```


**Note: Nexus Web server is listening on port 8081**

default admin password can be found under `/opt/sonartype-work/nexus3/admin.password` , username is admin

after logging in for the first time we need to change the password , ours is `********` (numeric) , same password for the linux user `nexus`

Disable anonymous access

### Repository types in Nexus

You can have repositories of different formats

repositories can be : 
- **proxy** : linked to a remote repository (e.g mvn central repo)
	- When an archive is needed ( a jar for example ) we check whether it's available locally on the proxy. Otherwise the request will be forwarded to the remote repository and then it will be stored locallly on nexus(cached), which saves bandwidth and centralizes different dependency/archive requests that the different teamsin the organization might have.
	- This can be applied  on mvn packages , docker images ( on dockerhub for example ) or even npm packages 
	- we generally need to configure the **Remote storage** to connect it to t
- **hosted** : Eveything that is developed is being stored on nexus
	- maven releases/snapshots are used by default to store maven based java artifact
	- when we develop in java , development version is SNAPSHOT which needs to be tested. then we have the release that's ready for production
	- maven-releases is the repository where the orgnaization publishes its releases. it can be also used to store third party artifacts that are not available in public ( commercial for example ) and cannot be retrieved by a proxy
	- maven-snapshots : where the organization pblishes development snapshots 
- **group** : 
	- allows you to combine multiple repositories of different types into one single repository. one url instead of many, single endpoint to maintain.


### Uploading a jar to Nexus

- Upload Jar File to existing hosted repository on Nexus
- Maven/Gradle commabd for pushing to remote repository
- Configure both tools to connect to Nexus ( Nexus Repo URL + Credentials )
- Nexus User with permission to upload 


#### Creating a local user

under Settings > User -> `saief1999:********` -> nx-anonymous role

![[../resources/create-user-nexus.png]]

then we will create a role for this user having the Id and name `nx-java`

admin-privilege > for nexus admins

nexus user ( developers ) generally get the privilege view ( to upload new artifacts to nexus )

we then assign that role to our created user



## AWS

### Overview

There are 3 scopes for services within AWS

- Global Scope : Attached to your account ( IAM, billing, Route53 )
	- Region scope ( S3, VPC, DynamoDB ) 
		- Availability zone scope ( EC2, EBS, RDS )

### Identity and Access Management ( IAM )

- Manage access to AWS services & resources
- Create and manage aws users and groups & assign policies ( set of permissions )
- **By Default** we have a ROOT user
	- ROOT user has **unlimited privileges**
	- it's advisable to create an **admin user** with less privileges when we first create the account.

After creating an admin user, we should use it to create different other users ( human users & other teams ) and assign to them different permissions. We can also create groups and manage our users in groups.

we can also have **System users**. for example a user for **jenkins** to deploy docker containers on AWS. Or can use a jenkins user to push docker images to AWS docker repo.


#### IAM Roles vs IAM Users

- Users : Human / System users can use services like EC2 only if the right **policy** is assigned to this IAM user.

- However, if we want ECS / EKS for example to have access to EC2 and to be able to spin up EC2 instances & configure them. We can't have **policies** assigned to it directly. We need to attach the **Policy** to an **IAM Role** and then assign the **IAM Role** to the ECS / EKS service.


---

#### Practical

Go to IAM -> create user and name it admin. give it the administrator policy and confirm

---

### Regions & Availability zones

- Regions : Physical location, where data centers are clustered. ( N.virginia, Ohio, Frankfurt... )

- Availability zone : 1 or more discrete data centers within a region that are used for replication.


### Virtual Private Cloud : VPC

- VPC is your **own isolated network** in the cloud for each region.

- VPC spans across all the availability zones in each region.

- it's a virtual representation of network infrastructure.

  - Setup of servers, network configuration moved to cloud.


#### Subnets : 

- There are sub networks of the VPC. 

- We have a Subnet for each availability zone.

##### Private & Public subnet

- when we block external traffic to EC2 instances for examples. that's a **private subnet**. These EC2 instances won't be acced externally. However other services inside the VPC will **still have access**
	- For example for a DB. Which we want to make private.

- a public subnet however is generally accessible externally ( e.g. for a web application )


##### IP Addresses

- Within each VPC we have an **internal** IP address **range**
- not for outside web traffic. For communication inside VPC
- Each subnet also gets a sub-range from the VPC range.


- when we create an EC2 instance, it gets a private IP address ( from the IP address range of the VPC ). In addition to a public IP address ( in order to be accessed externally ).

##### Controlling Access

- We have an **Internet Gateway** to connect the VPC to the outside internet.

- We need to make sure our components are **well secured** by controlling access to the **VPC** and to the **individual service instances**

- To configure access on **subnet level** we use **Network Access Control List** (NACL)

- To configure access on **instance level** we use **Security Groups**



### CIDR Block

- It is a range of IP Addresses. Example `172.31.0.0/16`
- for example `/32` will give us only 1 ip address , `/16` will give us 65k addresses.

### Elastic Compute Cloud (EC2)

- Virtual server in AWS cloud
- provides computing capacity

---

#### Practical

1. create EC2 instance
	1. Choose OS image
	2. Choose Capacity
	3. Network configuration
	4. Add Storage 
	5. Add Tags
	6. Configure Secutiry group
2. Connect EC2 instance with ssh
3. Install Docker on remote EC2 instance
	1. `yum update` if we're using amazon linux
	2. `sudo yum install docker` 
	3. `systemctl start docker`
	4. `sudo usermod -aG docker $USER`
5. Run docker container (docker login, pull, run) from private repo
6. Configure EC2 firewall to access App externally from browser
	1. Inboud rules ( Traffic coming to server ) -> add port 3080 from 0.0.0.0/0
	2. Outbound rules ( Traffic leaving the server ) -> leave it the same

---


### AWS CLI

- commands for every AWS service and resource.

To start configure AWS CLI we do `aws configue`

We put our Access and secret key for the user. We select our default region ( for the resources ). And the default output format ( what we get after executing a command -> `json` is good ).

#### Command Structure

```bash
aws <command> <subcommand> [ options & params ]
```

- `command` : The AWS service ( ec2, s3, ... )
- `subcommand` : specifies the operation to perform

#### AWS EC2 CLI

to create an instance, we do : 

```bash
aws ec2 run-instances
--image-id ami-xxxxxx \
--count 1 \
--instance-type t2.micro \
--key-name my-kp-cli \
--security-group-ids sg-xxxxxxx \
--subnet-id subnet-xxxxxxx

# Real example, with amazon linux and a custom key pair
aws ec2 run-instances --image-id ami-0e2031728ef69a466 \
--count 1 \
--instance-type t2.micro \
--key-name my-kp-cli \
--security-group-ids sg-03ee06bb99ca111db \
--subnet-id subnet-032e88e997ed10099
```

to check our instances we do 

```bash
aws ec2 describe-instances
```


to check our available security groups we do 

```bash
aws ec2 describe-security-groups [ --group-ids sg-xxxx sg-yyyy ]
```

to check our vpcs we do 

```bash
aws ec2 describe-vpcs
```

to create a security group we do this ( a sg is associated to a certain vpc ): 

```bash
aws ec2 create-security-group --group-name my-sg --descrtiption "My SH" --vpc-id OurvpcId
```

to add a rule to our newly created security group, we do this ( we can change cidr to our ip address with a certain range, to give access to only our machine via ssh ) : 

```bash
aws ec2 authorize-security-group-ingress  --group-id sg-xxxx --protocol tcp  --port 22 --cidr 0.0.0.0/0
```


##### Key Pair 

```bash
aws ec2 create-key-pair --key-name my-kp-cli --query 'KeyMaterial' --output text > my-kp-cli.pem
```


##### Filtering and Querying  in the describe command ( similar to jq )

- Filter : Pick components 

- Query : pick specific attributes of components

```bash
aws <command> describe-xxx --filters "Name=fieldName,Values=fieldValue1,fieldValue2" --query ".field1" 
```

examples : 

```bash
aws ec2 describe-instances --filters "Name=instance-type,Values=t2.micro" --query "Reservations[].Instances[].InstanceId"

```




## Amazon ECS

Components Of amazon ECS : 
- Cluster
- Task
- Service

### ECS Cluster

A cluster is where our containers are going to be run

a cluster is a group of EC2 instances that are spread among availibility zones. Each EC2 instance containing the logic( our docker container) + an **agent** (which is a container itself) that talks to ECS backend logic which allows resource management, lifecycle coordination, ...

### ECS Task

we groups containers in a **task** then we ask ecs to run them on the cluster.

#### Task definition

file that describes one or more containers that should be run together

a task : is an instanciation of a task definition that runs one or more containers on the same EC2 instance.

### ECS Service

an ECS service is used to manage a certain number of tasks.