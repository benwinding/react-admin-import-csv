import { DataProvider } from "ra-core";
import { createInDataProvider } from './uploader';

function makeMockProvider(): DataProvider & { createMany: any } {
  return {
    getList: jest.fn(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getManyReference: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    create: jest.fn(async () => Promise.resolve<any>(undefined)),
    createMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  }
} 

describe("uploader", () => {
  describe('createMany not found, should use fallback', () => {
    test("createMany throws 'Unkown dataprovider'", () => {
      const provider = makeMockProvider();
      provider.createMany = jest.fn(() => { throw new Error('Unknown dataProvider') });
      createInDataProvider(false, false, provider, '', [undefined]);
      expect(provider.createMany).toThrowError();
      expect(provider.create).toBeCalled();
    });
    test("createMany throws 'Unsupported fetch action type createMany'", () => {
      const provider = makeMockProvider();
      provider.createMany = jest.fn(() => { throw new Error('Unsupported fetch action type createMany') });
      createInDataProvider(false, false, provider, '', [undefined]);
      expect(provider.createMany).toThrowError();
      expect(provider.create).toBeCalled();
    });
  });
  describe('disableCreateMany set to true', () => {
    test('createMany should not be called', () => {
      const provider = makeMockProvider();
      createInDataProvider(false, true, provider, '', [undefined]);
      expect(provider.createMany).not.toBeCalled();
      expect(provider.create).toBeCalled();  
    })
  });
});
