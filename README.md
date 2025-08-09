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
Order
	P:tenantid
	S:cartid
	status
	orderplacedon
	userid
	deliveryaddress
	
Payment
	P:tenantid
	S:orderid
	paymentprovider
	status
	paymentiniatedon

S3 Bucket:
	tenantid/uiresource/productimages/productid/1.jpg
	tenantid/uiresource/companyimages/logo/32x32.jpg

API contract:
User:
POST user
POST user/signin
PUT user/userid

