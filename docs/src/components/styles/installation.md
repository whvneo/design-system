# Style Installation

For the baloise style you need to provide the fonts and stylesheets.

## Usage

This project is build on top of the [Bulma CSS framework](https://bulma.io/).

Add the `bal-app` to your root element. Within this css-class we are able to use the defined bulma helpers.

```html
...
<body class="bal-app">
  <!-- Use helpers & elements here -->
</body>
...
```

## Fonts

Download the 2 used fonts of our Baloise style guide.

- MetaStd-Normal
  - [woff2](https://github.com/baloise/ui-library/raw/master/resources/fonts/MetaStd-Normal.woff2)
  - [woff](https://github.com/baloise/ui-library/raw/master/resources/fonts/MetaStd-Normal.woff)
  - [truetype](https://github.com/baloise/ui-library/raw/master/resources/fonts/MetaStd-Normal.ttf)
- MetaStd-Medium
  - [woff2](https://github.com/baloise/ui-library/raw/master/resources/fonts/MetaStd-Medium.woff2)
  - [woff](https://github.com/baloise/ui-library/raw/master/resources/fonts/MetaStd-Medium.woff)
  - [truetype](https://github.com/baloise/ui-library/raw/master/resources/fonts/MetaStd-Medium.ttf)

Create a folders in the public space like `assets/fonts` and place the donwloaded fonts in there.
To use the fonts in the css styles import it with the following snippet.

## Sass (recommended)

### Install

Place the download fonts into a folder in the public area. Configure the path with the Sass variable `$font-path` or use the default `assets/fonts`.

Import `design-system-components.scss` Sass file into the main `.scss` file of your application.

```scss
@import 'node_modules/@baloise/design-system-components/src/styles/design-system-components.scss';
```

### Variables

To access the scss variables like [colors](/guide/styles/colors.html) or [responsiveness helpers](/guide/styles/responsiveness.html) import the `design-system-components.utilities.scss`.

::: tip
Use the variables and helpers of the Design System where ever you can in your application.
:::

#### Usage

```scss
// Only imports variables and mixins
@import 'node_modules/@baloise/design-system-components/src/styles/design-system-components.utilities.scss';

// mobile first
p {
  color: $blue;
}

@include desktop() {
  p {
    color: $danger;
  }
}
```

## CSS

Configure the fonts in a css file.

```css
@font-face {
  font-family: 'MetaPro';
  font-style: normal;
  font-weight: 400;
  font-display: fallback;
  src: local('MetaPro'), local('MetaStd-Normal'), url('/assets/fonts/MetaStd-Normal.woff2') format('woff2'), url('/assets/fonts/MetaStd-Normal.woff')
      format('woff'), url('/assets/fonts/MetaStd-Normal.ttf') format('truetype');
}

@font-face {
  font-family: 'MetaPro';
  font-style: normal;
  font-weight: 700;
  font-display: fallback;
  src: local('MetaStd-Medium'), url('/assets/fonts/MetaStd-Medium.woff2') format('woff2'), url('/assets/fonts/MetaStd-Medium.woff')
      format('woff'), url('/assets/fonts/MetaStd-Medium.ttf') format('truetype');
}
```

### Add global styles

#### CDN

Put the link tag into your main html file.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@baloise/design-system-components/dist/design-system-components/design-system-components.css"
/>
```

#### Webpack

Import the css directly into your main TypeScript or JavaScript file.

```typescript
import '@baloise/design-system-components/dist/design-system-components/design-system-components.css'
```