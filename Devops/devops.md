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