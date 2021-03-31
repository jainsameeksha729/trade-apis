# Insturction to run the apis

## start the server
### npm i & npm run dev

## Endpoints path and body:

#### Adding Trade
localhost:3800/api/v1/trades/add

method - post
body - 
{
	"ticker": "TCS",
	"price": 200,
	"shares": 20,
	"userId": "605dcbcb5f206138ad95c6b9",
	"type": "BUY"
}

#### Updating Trade
localhost:3800/api/v1/trades/update

method - put
body - 
{
	"tradeId": "605dced662fbd13f931146da",
	"ticker": "WIPRO",
	"price": 100,
	"shares": 20,
	"userId": "605dcbcb5f206138ad95c6b9",
	"type": "BUY"
}

#### Delete Trade
localhost:3800/api/v1/trades/delete?tradeId=605dced662fbd13f931146da

method - delete

#### Fetch Trade
localhost:3800/api/v1/trades/fetch?tradeId=605dced662fbd13f931146da

method - get

#### Fetch Portfolio
localhost:3800/api/v1/portfolio/fetch?userId=605dcbc05f206138ad95c6b8

method - get

#### Add User
localhost:3800/api/v1/user/add

method - post
body - 
{
	"name": "Sam"
}

#### Fetch user
localhost:3800/api/v1/user/getDetails?userId=605dcbcb5f206138ad95c6b9

method - get

#### Fetch Return
localhost:3800/api/v1/portfolio/return?userId=605dcbc05f206138ad95c6b8

method - get
