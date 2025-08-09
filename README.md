# Entity:
## User
	userid
	name
	email
	passwordhash
	address: []
## Tenant
	tenantid
	name
	hostname?
	email
	passwordhash
## Inventory
	tenantid
	catagory
	productid
	name
	description
	price
	stockcount
	images:[url,..]
## Cart
	P:tenantid
	S:cartid
	productid
	userid
## Order
	P:tenantid
	S:cartid
	status
	orderplacedon
	userid
	deliveryaddress
	
## Payment
	P:tenantid
	S:orderid
	paymentprovider
	status
	paymentiniatedon

# S3 Bucket:
	tenantid/uiresource/productimages/productid/1.jpg
	tenantid/uiresource/companyimages/logo/32x32.jpg

# API contract:
## User:
POST user
POST user/signin
POST /product
GET '/product/:productId'
PUT '/product/:productId'
DELETE '/product/:productId'
GET '/products'

POST '/order'
GET '/order/:orderId'
PUT '/order/:orderId'
DELETE '/order/:orderId'
GET '/orders'

# High level design
Micro services architecture
Distributed system
Sateless design to seamlessly scale

# Security
We follow JWT based authentication to authenticate users, which will be added in every request header as authorisation header.



