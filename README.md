
# Reactor

Reactor is a state-data-driven navigation variability system.

## Concept and Principles

Reactor is a Redux-inspired and state-driven navigation variability system. The developer composes inheritable navigation specifications in JavaScript at compile time, and calculates the runtime navigation specifications based on variability metadata.

This allows the developer to enable multiple navigations for the application, without having to write different versions of the app, or having a lot of if-else blocks during navigation.

By adopting the reactive data-driven paradigm, Reactor also serves as a powerful general-purpose modern router.

### Data-Drive UI

The first principle is that UI is completely state driven. At any point in time, statically defined view state combines with run-time values to create the entire view.

This makes the app very easy to debug. To reconstruct a user's journey, simply log the state transitions and run-time values.

### Composable Flowcharts

The second principle is that, the developer defines the navigation flowchart as an array of aforementioned states statically, then Reactor traverses this flowchart at runtime. This flowchart dictates the app's navigation.

To enable variability, the flowchart syntax is designed to allow inheritance and composition. Inheritance enable variations of flowchart structure; while composition enables different sub-navigation workflows to stitch together.

## Getting Started

Installation:

```
yarn add reactor-navigation
// or
npm install --save reactor-navigation
```

Initialization:

```
// see docs below
const spec = ...

// an object that maps component name to component class
// i.e. { 'login/forgot-password': ForgotPasswordComponent }
const components = ...

// options
// { usePushState: true } to use HTML5 push state
// { customGetPath: () => {} } custom way to calculate navigation path from browser URL
// { customRouting: (path) => {} } custom way to update url based on navigation path
const options = ...

const { reactorReducer, ReactorRoot } = Reactor.initialize({
  spec,
  getComponents,
  options
});
```

Writing navigation specs:

```
// regular navigation node
const homeDashboard = {
  name: 'home-dashboard',
  customMetadata: {
    displayMobileNativeMenu: true
  },
  path: {
    segment: '',
    urlAccess: true
  },
  views: [
    {
      type: 'main',
      component: 'dashboard'
    }
  ],
  transitions: [
    {
      name: 'view-report",
      to: 'detailed-report'
    },
    {
      name: 'logout',
      to: 'login-page'
    }
  ]
};

// decision node
const decision = {
  name: 'decision-can-schedule-alert',
  type: 'decision',
  outcomes: [
    {
      attribute: 'role',
      value: 'admin',
      name: 'yes'
    },
    {
      attribute: 'role',
      value: 'guest',
      name: 'no'
    }
  ]
};

// overall export
const spec = {
  name: 'US control',
  metadata: {
    region: 'us',
    path: 'app',
    initialPath: 'app',
    fallbackPath: '404'
  },
  navSpecs: [
    homeDashboard,
    decision
  ]
};
```

Hooking up ReactorRoot:

To finally hook up navigation, simple wrap the app in ReactorRoot.

```
const renderApp = () => {
  ReactDOM.render(
    <ReactorRoot state={Store.getStore().getState()} />,
    document.getElementById('container')
  );
};

Store.getStore().subscribe(renderApp);
renderApp();
```

## Contribution

We welcome contributions. Feel free to contact one of the committers if you have questions.

### Build

Global dependencies:

```
Node.js 8.10.0
NPM 5.6.0
Yarn 1.7.0
```

To install local dependencies:

```
yarn
```

To run tests:

```
yarn test
```

### Pull Request Process

To contribute, please fork the repo, and submit PRs against the master branch here.

Each PR must have the following:

1. A brief explanation of the changes
2. A brief explanation of the code design
3. 100% unit test coverage

One of the committers will provide an initial review within 72 hours.

### Release Process

We currently follow a very light weight process. Since only production-ready code can be merged into "master" branch, we are happy to make a release any time.

Versioning is done in separate commits pushed by committers. We follow semver.

### Committers

Max You <max_you@intuit.com>
