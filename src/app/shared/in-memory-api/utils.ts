import * as faker from 'faker';
import {User} from './types';
const ABC = ['a', 'b', 'c', 'd'];

export const generateUser = () => {
  const id = faker.datatype.number(5000);
  const state = ABC[faker.datatype.number(3)];
  const name = faker.name.findName(); // Rowan Nikolaus
  const email = faker.internet.email(); // Kassandra.Haley@erich.biz
  const longitude = faker.address.latitude(20, -20);
  const latitude = faker.address.longitude(20, -20);
  return { id, name, email, state, longitude, latitude } as User;
};
