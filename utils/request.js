/**
 * 基于axios封装请求模块
 * */
import axios from 'axios'
const request = axios.create({
    baseURL:"",
})
//请求拦截器
//相应拦截器


export default request
