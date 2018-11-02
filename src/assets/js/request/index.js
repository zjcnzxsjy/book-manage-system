import axios from "axios";
import config from "./config";
import { Message } from "element-ui";

const Axios = axios.create(config);

// Axios.interceptors.request.use(
//     error => {
//         Message({
//             //饿了么的消息弹窗组件,类似toast
//             showClose: true,
//             message: error && error.data.error.message,
//             type: 'error'
//         });
//         return Promise.reject(error.data.error.message);
//     }
// );

Axios.interceptors.response.use(
    response => {
        return response;
    },
    error  => {
        //对响应数据做些事
        Message({
            //消息弹窗组件,类似toast
            showClose: true,
            message: '请求失败',
            type: 'error'
        });
        return Promise.reject(error);
    }
)
export default Axios;