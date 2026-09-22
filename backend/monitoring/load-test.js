import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '20s', target: 50 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'https://autonow-production-6155.up.railway.app';

export function setup() {
  const res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'load-tester@gmail.com',
    password: 'Password123',
  }), { headers: { 'Content-Type': 'application/json' } });

  return { token: res.json('token') };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.token}`,
  };

  const res = http.get(`${BASE_URL}/api/orders/user/16`, { headers });
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
