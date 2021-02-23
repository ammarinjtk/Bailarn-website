## Bailarn Website

The project aims to develop Thai NLP Library based on Deep Learning techniques. With this library, users can train the model on their own dataset using the provided deep learning model structure and utilities. Moreover, Thai NLP Library also provides pre-trained models to process Thai text instantly. All pre-trained models was evaluated and compared across various deep learning techniques proposed in the previous researches in the experiments.

- `/tokenizer`: Identify the boundaries between texts in natural languages to divide these texts into the meaningful unit as word.
- `/word-embedder`: Map a word from the vocabulary to vectors of real numbers involving a mathematical embedding.
- `/ner`: Predict Named entity of each words in a sentence.
- `/pos`: Predict Part-of-Speech of each words in a sentence.
- `/keyword-expansion`: Find the related words from the vocabulary to the query word.
- `/text-categorization`: Predict the pre-defined classes of sentences on the specific domain.
- `/sentiment-analyzer`: Predict the Sentiment of a document including Positive, Neutral and Negative sentiment.

## Development
---
You need to install all dependencies:

    npm install

Then run the development server. The application will be running at default port 3000:

    npm start

## Files Structure
---


```
di-portal
├── README.md
├── public
    ├── css/
    ├── media/
    └── index.html
├── src
│   ├── _metronic
│   |   ├── _assets
│   |   │   ├── js/
│   |   │   ├── plugin/
|   |   |   └── sass/
|   |   ├── _helper/
|   |   ├── _partial
│   |   │   ├── control/
│   |   │   ├── dropdowns/
|   |   |   └── index.js
|   |   ├── i18n/
|   |   ├── layout
│   |   │   ├── _core/
│   |   │   ├── components/
|   |   |   └── index.js
│   ├── app
│   |   ├── modules
│   |   │   ├── Auth
|   |   |   |   ├── index.js
|   |   |   |   ├── _redux/authRedux.js
|   |   |   |   └── pages
|   |   |   |       ├── AuthPage.js
|   |   |   |       ├── Login.js
|   |   |   |       └── Logout.js
│   |   ├── pages
|   |   |   ├── AdhocQueryPage.js
|   |   |   ├── DacsCheckerPage.js
|   |   |   ├── DataDeckTestPage.js
|   |   |   ├── ErrorPage.js
|   |   |   ├── HomePage.js
|   |   |   ├── MaMonitoringPage.js
|   |   |   ├── MaSubmissionPage.js
|   |   |   └── TableCreatorPage.js
│   |   ├── BasePage.js
│   |   ├── Routes.js
│   |   └── App.js
│   ├── redux
│   |   ├── rootReducer.js
│   |   └── store.js
├── nginx/nginx.conf
├── index.js
├── package.json
├── serve.json
├── webpack.config.js
├── Dockerfile
├── .env
├── build/
└── node_modules/

```
The web application is based on Create React App. For more detailed information of the CRA, visit the official Create React App [documentation website](https://create-react-app.dev/docs/getting-started/).

| Path | Description |
| ----------- | ----------- |
| **/build** | The built output. Run command `npm run build` to build it. |
| **/node_modules** | The `package.json` file in the app root defines what libraries will be installed into `node_modules/` when you run `npm install`. |
| **/public** | Folder contains the `index.html` file so you can tweak it, Change `<title>`, insert additional `<link>` and `<script>` tags. Also in '/public/media' folder you able to find all images/icons/SVGs and `Splash Screen` styles. |
| **/src** | The main app lives in the src folder. All React components, styles and anything else the app needs go here. |
| /src/_metronic/**_assets** | Contains shared common parts: js (Layout js helpers), plugins (icons plugins), sass (common style structure). |
| /src/_metronic/**_helpers** | Contains shared utils which are used by all application modules. |
| /src/_metronic/**_partials** | Contains shared components which are used by all application modules. |
| /src/_metronic/**i18n** | Contains internationalization, [react-intl](https://github.com/formatjs/formatjs),  for react implementations. |
| /src/_metronic/layout/**_core** | Contains Layout core logic which is based on React.Context. Also includes [Material-UI](https://material-ui.com/customization/theming/) overriding and layout configuration file(LayoutConfig.js). |
| /src/_metronic/layout/**layout** | Contains Layout components(Layout, Header, Aside, Footer, ...). |
| /src/app/**modules** | Contains application [lazy](https://en.reactjs.org/docs/code-splitting.html) modules, which lets you render a dynamic import as a regular component to show some fallback content (such as a loading indicator) (Authorization, ...) |
| /src/app/**pages** | Contains application pages (Home page, DACS Checker page, ...) |
| /src/app/**App.js** | Main application entry point. |
| /src/app/**BasePage.js** | Private routes entry point. |
| /src/app/**Routes.js** | Application routing is based on [React Routing](https://reactrouter.com/web). |
| /src/app/**redux** | Contains the main redux setup(rootReducer, store). |
| /src/**index.js** | JavaScript entry point. |
| /src/**index.scss** | Styles entry point. |
| **serve.json** | `serve.json` is used by `serve-handler` running by command `npm run serve`. |
| **package.json** | A package.json file contains meta data about app or module. Most importantly, it includes the list of dependencies to install from npm when running npm install. |


## Authentication
---
We use Firebase as a authentication service. Users can sign in using their internal emails (@sertiscorp.com) supported by Google. Firebase authentication provides backend services, easy-to-use SDKs, and ready-made UI libraries to authenticate users in web applications. It also supports popular identity providers such as Google, Facebook, Twitter, and more. For more reference, you can see the [official documentation](https://firebase.google.com/docs/auth).

## Authors
- **Amarin Jettakul** &mdash; _Initial work_ &mdash; Data Analyst (contact: ammarinjtk@gmail.com)
