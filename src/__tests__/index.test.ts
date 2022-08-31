import { nanoid } from 'nanoid';
import slidingLogs, { resetRequests } from '../util/slidingLogs';

describe('slidingLogs test suite', () => {
  it('slidingLogs return functions', () => {
    const slinding = slidingLogs();
    expect(Object.keys(slinding).length).toBe(4);
  });
  it('check add new request with one existing sub', () => {
    const { newReqPerUser, currentRequests } = slidingLogs();
    const rndSub = nanoid();
    newReqPerUser(rndSub, { id: nanoid(), timestamp: new Date() });
    const reqs = currentRequests();
    expect(reqs[rndSub]).not.toBeUndefined();
  });
  it('check add new request with one not existing sub', () => {
    const { newReqPerUser, currentRequests } = slidingLogs();
    const rndSub = nanoid();
    newReqPerUser(rndSub, { id: nanoid(), timestamp: new Date() });
    const reqs = currentRequests();
    expect(reqs[nanoid()]).toBeUndefined();
  });
  it('check add new request with one existing sub and check length', () => {
    const { newReqPerUser, currentRequests } = slidingLogs();
    const rndSub = nanoid();
    newReqPerUser(rndSub, { id: nanoid(), timestamp: new Date() });
    const reqs = currentRequests();
    expect(reqs[rndSub].length).toBeGreaterThan(0);
  });
  it('check add new request with one existing sub and check req', () => {
    const { newReqPerUser, currentRequests } = slidingLogs();
    const rndSub = nanoid();
    const reqId = nanoid();
    const mapReq = { id: reqId, timestamp: new Date() };
    newReqPerUser(rndSub, mapReq);
    const reqs = currentRequests();
    expect(reqs[rndSub].find(r => r.id === reqId)).toStrictEqual(mapReq);
  });
  it('check reset req', () => {
    const { newReqPerUser, currentRequests, resetRequests } = slidingLogs();
    const rndSub = nanoid();
    newReqPerUser(rndSub, { id: nanoid(), timestamp: new Date() });
    const reqs = currentRequests();
    expect(Object.keys(reqs).length).toBeGreaterThan(0);
    resetRequests();
    const reqsEmpty = currentRequests();
    expect(Object.keys(reqsEmpty).length).toBe(0);
  });
  it('check user window ok', () => {
    const { checkUserWindow, newReqPerUser } = slidingLogs();
    const rndSub = nanoid();
    newReqPerUser(rndSub, { id: nanoid(), timestamp: new Date() });
    expect(checkUserWindow(rndSub)).toBeFalsy();
  });
  it('check user window ko', () => {
    const { checkUserWindow, newReqPerUser, currentRequests } = slidingLogs();
    const rndSub = nanoid();
    for (const el of new Array(30)) {
      newReqPerUser(rndSub, { id: nanoid(), timestamp: new Date() });
    }
    const reqs = currentRequests();
    expect(reqs[rndSub].length).toBe(30);
    expect(checkUserWindow(rndSub)).toBeTruthy();
  });
});

afterAll(() => resetRequests());
