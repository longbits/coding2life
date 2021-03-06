//数据库相关基础配置
const mysql = require('mysql')
const dbConfig =  {
    connectionLimit: 10,
    host: 'localhost',
    user: 'redqueen',
    password: '112233',
    database: 'test-api'
}
let pool = mysql.createPool(dbConfig)

let db = {}

db.query = function (sql, params) {
    //需要用promise做一个包裹
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, conn) {
            if (err) {
                reject(err+'连接出错')
                return;
            }

            conn.query(sql, params, function (error, res, fields) {
                console.log(`${sql}=>${params}`);
                conn.release()
                if (error) {
                    reject(error+'查询出错')
                }
                resolve(res)
            })
        })
    })
}

module.exports = db