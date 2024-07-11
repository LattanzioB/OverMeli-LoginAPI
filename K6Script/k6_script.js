import http from 'k6/http'
import {sleep, check} from 'k6'

const baseURL = 'http://localhost:8000/'


const users = [{userName: 'user1', password: '123456' },
               {userName: 'user2', password: '123456' },
               {userName: 'user3', password: '123456' }
            ]
const loadOptions = {
    stages: [
        {duration: '5m', target: 200},
        {duration: '20m', target: 200},
        {duration: '5m', target: 0},
    ],
    thresholds: {
        http_req_duration: ['p(99)<100'] //99% of request must complete in 100 miliseconds
    }
} 

const stressOptions = {
    stages: [
        {duration: '1m', target: 200},
        {duration: '5m', target: 200},
        {duration: '1m', target: 800},
        {duration: '5m', target: 800},
        {duration: '1m', target: 1000},
        {duration: '5m', target: 1000},
        {duration: '1m', target: 0},

    ],
    thresholds: {
        http_req_duration: ['p(99)<100'] //99% of request must complete in 100 miliseconds
    }
} 

const spikeOptions = {
    stages: [
        {duration: '30s', target: 2000},
        {duration: '2m', target: 2000},
        {duration: '30s', target: 0},

    ],
    thresholds: {
        http_req_duration: ['p(99)<100'] //99% of request must complete in 100 miliseconds
    }
} 

export const options = loadOptions


export default () => {
    const randomUser = users[Math.floor(Math.random() * users.lenght)]
    const res = http.post(baseURL + 'login/', JSON.stringify(randomUser))
    check(res, { '200': (r) => r.status === 200});
    sleep(1)
}