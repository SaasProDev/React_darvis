import axios from 'axios';
import {HOMOGRAPHY_API} from '../../config'
const getHomography = async (cameraPoints, floorPlanPoints) => {
  try {
    const body = {
      points: [
        {
          x: cameraPoints.p1.x,
          y: cameraPoints.p1.y,
          lat: floorPlanPoints.p1.x,
          long: floorPlanPoints.p1.y,
        },
        {
          x: cameraPoints.p2.x,
          y: cameraPoints.p2.y,
          lat: floorPlanPoints.p2.x,
          long: floorPlanPoints.p2.y,
        },
        {
          x: cameraPoints.p3.x,
          y: cameraPoints.p3.y,
          lat: floorPlanPoints.p3.x,
          long: floorPlanPoints.p3.y,
        },
        {
          x: cameraPoints.p4.x,
          y: cameraPoints.p4.y,
          lat: floorPlanPoints.p4.x,
          long: floorPlanPoints.p4.y,
        },
      ],
    };
    const homography = await axios({
      method: 'post',
      url: HOMOGRAPHY_API,
      data: body,
    })
      .then(function fns(response) {
        return response.data;
      })
      .catch(function fne(error) {
        return error;
      });
    return homography;
  } catch (err) {
    return 'error';
  }
};

export default getHomography;
