import { DataProvider } from "ra-core";
import { createInDataProvider } from './uploader';

function makeMockProvider() {
  return {
    getList: jest.fn(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getManyReference: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  }
} 

describe("uploader", () => {
  test("createMany throws 'Unkown dataprovider'", () => {
    const provider = makeMockProvider();
    provider.createMany = jest.fn(() => { throw new Error('Unknown dataProvider') });
    createInDataProvider(false, provider, '', [undefined]);
    expect(provider.createMany).toThrowError();
    expect(provider.create).toBeCalled();
  });
  test("createMany throws 'Unsupported fetch action type createMany'", () => {
    const provider = makeMockProvider();
    provider.createMany = jest.fn(() => { throw new Error('Unsupported fetch action type createMany') });
    createInDataProvider(false, provider, '', [undefined]);
    expect(provider.createMany).toThrowError();
    expect(provider.create).toBeCalled();
  });
});
