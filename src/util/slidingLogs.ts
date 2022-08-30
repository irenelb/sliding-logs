import options from '../config/options';
type MapRequest = { id: string; timestamp: Date };
type MapUserRequest = Record<string, MapRequest[]>;
const { maxRequest, size } = options.snapshot().slidingLogsInfo;

function slidingLogs() {
  let mapRequest: MapUserRequest = {};

  function newReqPerUser(sub: string, newReq: MapRequest) {
    mapRequest[sub] = [...(mapRequest[sub] ?? []), newReq];
  }

  function checkUserWindow(sub: string) {
    const reqMap = mapRequest[sub];
    const latestReq = reqMap.filter(req => {
      const diff = new Date().getTime() - req.timestamp.getTime();
      return diff <= size;
    });
    return latestReq.length > maxRequest;
  }

  function resetRequests() {
    mapRequest = {};
  }

  function currentRequests() {
    return mapRequest;
  }

  return { newReqPerUser, checkUserWindow, resetRequests, currentRequests };
}

export const {
  newReqPerUser,
  checkUserWindow,
  resetRequests,
  currentRequests,
} = slidingLogs();

export default slidingLogs;
