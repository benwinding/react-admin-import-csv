// in src/App.js
import React from "react";
import { Admin, Resource, resolveBrowserLocale } from "react-admin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import fakeDataProvider from "ra-data-fakerest";
import { PostList, PostShow, PostEdit, PostCreate } from "./posts";
import englishMessages from "ra-language-english";
import spanishMessages from "ra-language-spanish";
import chineseMessages from "ra-language-chinese";
import * as domainMessages from "./build-watch/i18n";

const App = () => {
  const dataProvider = fakeDataProvider({
    posts: [
      { id: 1, title: "FooBar" },
      { id: 2, title: "Another" },
      { id: 3, title: "Thing" },
      { id: 4, title: "Hello, world!" },
    ],
  });

  // Setup i18n
  const messages = {
    en: { ...englishMessages, ...domainMessages.en },
    zh: { ...chineseMessages, ...domainMessages.zh },
    es: { ...spanishMessages, ...domainMessages.es },
  };
  const i18nProvider = polyglotI18nProvider(
    (locale) => (messages[locale] ? messages[locale] : messages.en),
    resolveBrowserLocale()  
  );

  return (
    <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
      <Resource
        name="posts"
        list={PostList}
        show={PostShow}
        edit={PostEdit}
        create={PostCreate}
      />
    </Admin>
  );
};

export default App;
