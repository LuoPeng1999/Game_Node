const fetch = require('node-fetch')

class Address {
    constructor(){
        this.BAIDUAK = '02DzECPdEjA6efknzvC2YevT2fXMzQ6i'
        this.fetch = this.fetch.bind(this)
        this.getAddress = this.getAddress.bind(this)
    }

    async fetch(url='', data={}, type='GET', resType='JSON'){
        type = type.toUpperCase()
        resType = resType.toUpperCase()
        if(type == 'GET'){
            let dataStr = '' // 数据拼接字符串
            Object.keys(data).forEach(key=>{
                dataStr += key + '=' + data[key] + '&'
            })

            if(dataStr !== ''){
                dataStr = dataStr.substr(0,dataStr.lastIndexOf('&'))
                url = url + '?' + dataStr
            }
        }

        let requestConfig = {
            method: type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }

        if(type == 'POST'){
            Object.defineProperty(requestConfig, 'body', {
                value: JSON.stringify(data)
            })
        }
        let responseJson
        try {
            const response = await fetch(url, requestConfig)
            if(resType === 'TEXT'){
                responseJson = await response.text()
            }else {
                responseJson = await response.json()
            }
        } catch (error) {
            console.log('获取http数据失败', error);
            throw new Error(error)
        }

        return responseJson
    }

    async getAddress(req, res, next) {
        try {
            let result = await this.fetch('https://api.map.baidu.com/location/ip', {
                ak: this.BAIDUAK
            })
            res.status(200).json(result)
        } catch (error) {
            res.status(210).json({
                mate: {
                    status: 210,
                    message: '地址获取失败'
                },
                data:null
            })
            console.log('地址获取失败', error);
            throw new Error(error)
        }
    }
}

module.exports = new Address()