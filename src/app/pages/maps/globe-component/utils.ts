import {UserViewModel} from '../../../shared/state/users/users.store';

export const userMapper = (users: UserViewModel[]) => {
  return {
    type: 'FeatureCollection',
    features: users.map(u => (
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [Number.parseFloat(u.longitude), Number.parseFloat(u.latitude)]
        },
        properties: {
          name: u.name,
        }
      })
    )
  };
};

