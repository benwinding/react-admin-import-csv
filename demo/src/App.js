// in src/App.js
import React from "react";
import { Admin, Resource } from "react-admin";
import fakeDataProvider from "ra-data-fakerest";
import { PostList, PostShow, PostEdit, PostCreate } from "./posts";

const dataProvider = fakeDataProvider({
  posts: [
    { id: 0, title: "Hello, world!" },
    { id: 1, title: "FooBar" },
    { id: 2, title: "Another" },
    { id: 3, title: "Thing" },
  ],
});

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="posts"
      list={PostList}
      show={PostShow}
      edit={PostEdit}
      create={PostCreate}
    />
  </Admin>
);

export default App;
