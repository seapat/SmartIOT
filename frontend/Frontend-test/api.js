const baseUrl = ""
import axios from "axios";

class Backend {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }
    registerUser(username, password) {
        return new Promise(async (resolve, reject) => {
            var response = await axios.post(this.baseUrl + '/sensor_api_user/register_user', {
                username: username,
                password: password
            })
            if ((typeof response.data.error) != "undefined") {
                reject(response.data.msg)
            }
            resolve(response.data)
        })
    }
    getSensorData(session_id, count, sensor_id) { //maybe implement count & sensor_id later
        return new Promise(async (resolve, reject) => {
            var response = await axios.post(this.baseUrl + '/sensor_api_user/get_data', {
                session_id: session_id, // we need to get that from login later
            })
            console.log(response.data);
            if ((typeof response.data.error) != "undefined") {
                reject(response.data.msg)
            }
            resolve(response.data)
        })
    }
    registerDevice(deviceHash, session_id) {
        return new Promise(async (resolve, reject) => {
            var response = await axios.post(this.baseUrl + '/sensor_api_user/register_device', {
                device_hash: deviceHash, // we get the device hash from the arduino board (fingerprint)
                session_id: session_id  //we get that id after calling /register_user
            })
            if ((typeof response.data.error) != "undefined") {
                reject(response.data.msg)
            }
            resolve(response.data)
        })
    }
    login(username, password) {
        return new Promise(async (resolve, reject) => {
            var response = await axios.post(this.baseUrl + '/sensor_api_user/login', {
                username: username,
                password: password
            })
            if ((typeof response.data.error) != "undefined") {
                reject(response.data.msg)
            }
            resolve(response.data.msg)
        })
    }
    getStats(session_id, device_hash, time_range) {
        return new Promise(async (resolve, reject) => {
            var response = await axios.post(this.baseUrl + '/sensor_api_user/get_stats', {
                session_id: session_id,
                device_hash: device_hash,
                time_range: time_range // in seconds
            })
            if ((typeof response.data.error) != "undefined") {
                reject(response.data.msg)
            }
            resolve(response.data)
        })
    }
    getDevices(session_id) {
        return new Promise(async (resolve, reject) => {
            var response = await axios.post(this.baseUrl + '/sensor_api_user/get_devices', {
                session_id: session_id,
            })
            if ((typeof response.data.error) != "undefined") {
                reject(response.data.msg)
            }
            resolve(response.data)
        })
    }
    getAmpelScore(session_id,device_hash) {
        return new Promise(async (resolve, reject) => {
            var response = await axios.post(this.baseUrl + '/sensor_api_user/get_ampel_values', {
                session_id: session_id,
                device_hash: device_hash
            })
            if ((typeof response.data.error) != "undefined") {
                reject(response.data.msg)
            }
            resolve(response.data)
        })
    }
}

export default Backend
