# Kerberos

## Ticket Management

By default, kinit assumes you want tickets for your own username in your default realm.

Normally, your tickets are good for your system’s default ticket lifetime, which is ten hours on many systems. You can specify a different ticket lifetime with the -l option. Add the letter s to the value for seconds, m for minutes, h for hours, or d for days. For example, to obtain forwardable tickets for david@EXAMPLE.COM that would be good for three hours, you would type:

Suppose your Kerberos tickets allow you to log into a host in another domain, such as `trillium.example.com`, which is also in another Kerberos realm, `EXAMPLE.COM`. 
If you ssh to this host, you will receive a ticket-granting ticket for the realm `EXAMPLE.COM`, plus the new host ticket for `trillium.example.com`.


## Developing with GSSAPI

The GSSAPI (Generic Security Services API) allows applications to communicate securely using Kerberos 5 or 
other security mechanisms. We recommend using the GSSAPI (or a higher-level framework which encompasses GSSAPI, such as SASL) 
for secure network communication over using the libkrb5 API directly.


## Kerbeors V5 concepts

A keytab (short for “key table”) stores long-term keys for one or more principals. Keytabs are normally represented by files in a standard format, although in rare cases they can be represented in other ways. Keytabs are used most often to allow server applications to accept authentications from clients, but can also be used to obtain initial credentials for client applications.

Keytabs are named using the format **_type_:_value_**. Usually _type_ is FILE and _value_ is the absolute pathname of the file.

A keytab contains one or more entries, where each entry consists of a timestamp (indicating when the entry was written to the keytab), a principal name, a key version number, an encryption type, and the encryption key itself.

A keytab can be displayed using the [_klist_](https://web.mit.edu/kerberos/krb5-1.12/doc/user/user_commands/klist.html#klist-1) command with the -k option. Keytabs can be created or appended to by extracting keys from the KDC database using the [_kadmin_](https://web.mit.edu/kerberos/krb5-1.12/doc/admin/admin_commands/kadmin_local.html#kadmin-1) [_ktadd_](https://web.mit.edu/kerberos/krb5-1.12/doc/admin/admin_commands/kadmin_local.html#ktadd) command. Keytabs can be manipulated using the [_ktutil_](https://web.mit.edu/kerberos/krb5-1.12/doc/admin/admin_commands/ktutil.html#ktutil-1) and [_k5srvutil_](https://web.mit.edu/kerberos/krb5-1.12/doc/admin/admin_commands/k5srvutil.html#k5srvutil-1) commands.


### Default keytab

The default keytab is used by server applications if the application does not request a specific keytab. The name of the default keytab is determined by the following, in decreasing order of preference:

1.  The **KRB5_KTNAME** environment variable.
2.  The **default_keytab_name** profile variable in [_[libdefaults]_](https://web.mit.edu/kerberos/krb5-1.12/doc/admin/conf_files/krb5_conf.html#libdefaults).
3.  The hardcoded default, [_DEFKTNAME_](https://web.mit.edu/kerberos/krb5-1.12/doc/mitK5defaults.html#paths).

---

We added **EXAMPLE.COM** to test it out 

---
## krb5.conf
### realms
Each tag in the [realms] section of the file is the name of a Kerberos realm. The value of the tag is a subsection with relations that define the properties of that particular realm. For each realm, the following tags may be specified in the realm’s subsection

**admin_server**
Identifies the host where the administration server is running. Typically, this is the master Kerberos server. This tag must be given a value in order to communicate with the [_kadmind_](https://web.mit.edu/kerberos/krb5-1.12/doc/admin/admin_commands/kadmind.html#kadmind-8) server for the realm.

**kdc**
For your computer to be able to communicate with the KDC for each realm, this tag must be given a value in each realm subsection in the configuration file, or there must be DNS SRV records specifying the KDCs.



---
## Archi wiki
### Domain creation

Edit `/etc/krb5.conf` to configure your domain:

```
/etc/krb5.conf

[libdefaults]
    default_realm = EXAMPLE.COM

[realms]
    EXAMPLE.COM = {
        admin_server = kerberos.example.com
        # use "kdc = ..." if the kerberos SRV records aren't in DNS (see Advanced section)
        kdc = kerberos.example.com
        # This breaks krb4 compatibility but increases security
        default_principal_flags = +preauth
    }

[domain_realm]
    example.com  = EXAMPLE.COM
    .example.com = EXAMPLE.COM

[logging]
    kdc          = SYSLOG:NOTICE
    admin_server = SYSLOG:NOTICE
    default      = SYSLOG:NOTICE
```

Create the database:

```bash
kdb5_util -r EXAMPLE.COM create -s
```

password is : `kdcpasswd`



Finally, [start/enable](https://wiki.archlinux.org/title/Start/enable "Start/enable") `krb5-kdc.service` and `krb5-kadmind.service`.

### Add principals

Start the Kerberos administration tool, using local authentication and add a user principal
```bash
kadmin.local
kadmin.local: addprinc myuser@EXAMPLE.COM
```

myuser password is : `myuserpasswd`


add the KDC principal to the kerberos database 
```bash
kadmin.local: addprinc -randkey host/kerberos.example.com
```

Finally, Add the KDC principal to the server's keytab:
```bashh
kadmin.local: ktadd host/kerberos.example.com
```

First, ensure you have configured krb5.conf on all involved machines.

A kerberos principal has three components, formatted as `primary/instance@REALM`. For user principals, the primary is your username and the instance is omitted or is a role (eg. "admin"): `myuser@EXAMPLE.COM` or `myuser/admin@EXAMPLE.COM`. For hosts, the primary is "host" and the instance is the server FQDN: `host/myserver.example.com@EXAMPLE.COM`. For services, the primary is the service abbreviation and the instance is the FQDN: `nfs/myserver.example.com@EXAMPLE.COM`. The realm can often be omitted, the local computer's default realm is usually assumed.



we also added an admin principal : `addprinc root/admon` with pass : `rootpasswd` and we gave to him all privileges in `/etc/krb5kdc/kadm5.acl`



## Final notes
- In order to access kadmin from all machines(to add/remove principals and to add them to keytables)  you need to set it up , and that's by creating a root/admin principal , search archwiki for more info 
- in order to add host machines and to connect them. you need to add the principal associated in each machine (with kadmin and with principal having this format for ssh : `host/service1.example.com` for example ) and then do `ktadd` to add it to the keytable of that machine . See the ssh example for more info 
	- Make sure 
- And finally after setting hosts , we need to add the appropriate user as a principal (for the case of ssh ) . this operation can be done in either machine , doesn't matter. and that's by doing `kadmin` and then `addprinc sshuser`

```bash
saief1999@kerberos security-toolbox]$ sudo ktutil 
ktutil:  rkt /etc/krb5.
krb5.conf    krb5.keytab  
ktutil:  rkt /etc/krb5.
krb5.conf    krb5.keytab  
ktutil:  rkt /etc/krb5.keytab 
ktutil:  list
slot KVNO Principal
---- ---- ---------------------------------------------------------------------
   1    2    host/kerberos.example.com@EXAMPLE.COM
   2    2    host/kerberos.example.com@EXAMPLE.COM
   3    2        host/client1.insat.tn@EXAMPLE.COM
   4    2        host/client1.insat.tn@EXAMPLE.COM
   5    2        host/client2.insat.tn@EXAMPLE.COM
   6    2        host/client2.insat.tn@EXAMPLE.COM
   7    2                         rami@EXAMPLE.COM
   8    2                         rami@EXAMPLE.COM
ktutil:  add_entry -password -p securitytools/saiefzneti.example.com -k 1 -e aes256-sha1
Password for securitytools/saiefzneti.example.com@EXAMPLE.COM: 
ktutil:  add_entry -password -p securitytools/ramizouari.example.com -k 1 -e aes256-sha1
Password for securitytools/ramizouari.example.com@EXAMPLE.COM: 
ktutil:  wkt /etc/krb5.keytab

```



## To configure Peer Connection

### Change Hosts

add both `kerberos clients`  and `kdc` to `/etc/hosts`, for example :

```
192.168.1.178 ramizouari.tn kdc.server.tn
192.168.1.152 saiefzneti.tn
```

### Add Services
add the service ip to `/etc/services` for example:

```
securitytools	8085/tcp

```


> Make Sure that the **port for the service** is open on both clients (in this case **8085/tcp**)
> Alsmo make sure that the port for kerberos is open in both clients : **88/tcp** **749/tcp**

### Add configuation to the kdc in both client (in addition to kdc)

in `/etc/krb5.conf`

```
[libdefaults]
	default_realm = RAMIZOUARI.TN
[realms]
# use "kdc = ..." if realm admins haven't put SRV records into DNS
	RAMIZOUARI.TN = {
		kdc=kdc.server.tn
		admin_server=kdc.server.tn
	}

[domain_realm]
	mit.edu = ATHENA.MIT.EDU
	csail.mit.edu = CSAIL.MIT.EDU
	.ucsc.edu = CATS.UCSC.EDU
	example.com = EXAMPLE.COM
	.example.com = EXAMPLE.COM

[logging]
#	kdc = CONSOLE

```

this is needed to access kadmin from both clients if we want to , and to `kinit` our tickets

### Configure keytab
```bash
saief1999@kerberos security-toolbox]$ sudo ktutil 
ktutil:  rkt /etc/krb5.keytab 
ktutil:  list
slot KVNO Principal
---- ---- ---------------------------------------------------------------------
   1    2    host/kerberos.example.com@EXAMPLE.COM
   2    2    host/kerberos.example.com@EXAMPLE.COM
   3    2        host/client1.insat.tn@EXAMPLE.COM
   4    2        host/client1.insat.tn@EXAMPLE.COM
   5    2        host/client2.insat.tn@EXAMPLE.COM
   6    2        host/client2.insat.tn@EXAMPLE.COM
   7    2                         rami@EXAMPLE.COM
   8    2                         rami@EXAMPLE.COM
ktutil:  add_entry -password -p securitytools/saiefzneti.example.com -k 1 -e aes256-sha1
Password for securitytools/saiefzneti.example.com@EXAMPLE.COM: 
ktutil:  add_entry -password -p securitytools/ramizouari.example.com -k 1 -e aes256-sha1
Password for securitytools/ramizouari.example.com@EXAMPLE.COM: 
ktutil:  wkt /etc/krb5.keytab

```

**Notes: make sure that the keyversion of the added entry matches that of the principal**
Copy the keytab from one client to the other

### Init the Ticket

- In each client init his ticket , for example, for `saiefzneti.tn`  do this:

```bash
kinit securitytools/saiefzneti.tn
```


### Initiate the connection

From first client  `ramizouari.tn`

```bash
[ramizouari@fedora security-toolbox]$ python client.py ramizouari.tn 10000
Choose connection type [send/receive]: send
Host: saiefzneti.tn
Port: 9000
Connecting to saiefzneti.tn:9000
Connection established to saiefzneti.tn
[Him]: hello
Hi
[You]: Hi
```

from second client  `saiefzneti.tn`

```bash
[saief1999@kerberos security-toolbox]$ python client.py saiefzneti.tn 9000
Choose connection type [send/receive]: receive
Received connection from: ('192.168.1.178', 38304)
hello
[You]: hello
[Him]: Hi
```
