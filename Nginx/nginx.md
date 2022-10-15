## Reverse Proxy

Syntax : 

- `proxy_pass <destination>`
- Request  : https://www.example.com/

```
location / {
	proxy_pass http://10.1.1.4:9000/app1;
}
```

Nginx default behaviour : close connection & inititate new connection ( headers are lost ) -> we need to capture the information and forward it to our application

```
server {
	listen 80;
	proxy_set_header HOST $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

	location / {
		proxy_pass http://10.1.1.4:9000/app1
	}
}
```
