import * as faker from 'faker';

export const generateUser = () => {
  const id = faker.datatype.number(5000);
  const name = faker.name.findName(); // Rowan Nikolaus
  const email = faker.internet.email(); // Kassandra.Haley@erich.biz
  return { id, name, email };
};
