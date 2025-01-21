import request from '@/axios/request';
import url from '@/axios/url';
const { limsUrl } = url();

export function getHomePageEntity(params = {}) {
  return request({
    url: `${limsUrl}limsReport/getHomePageEntity`,
    method: 'get',
    params,
  });
}

export function getTaskReportEntity(params = {}) {
  return request({
    url: `${limsUrl}limsReport/getTaskReportEntity`,
    method: 'get',
    params,
  });
}

