const mysql=require('mysql')

let connection=mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'12345678',
    database:'11.12_banner'
})
connection.connect((error)=>{
    if(error){
        console.log('连接失败',error)
    }else{
        console.log('连接成功')
    }
})
module.exports=connection