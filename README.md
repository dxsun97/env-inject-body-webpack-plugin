# env-inject-body-webpack-plugin
A [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin) for injecting a custom string into the end of body of html-webpack-plugin output according to the environment. (inspired by [inject-body-webpack-plugin](https://github.com/Jaid/inject-body-webpack-plugin))

## Installation

```bash
npm i -D env-inject-body-webpack-plugin
```

## Example

### Input

**webpack.config.js**

```js
import HtmlWebpackPlugin from "html-webpack-plugin"
import InjectBodyPlugin from "env-inject-body-webpack-plugin"

export default {
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin(),
    new InjectBodyPlugin({
      content: '<script src="index.js"></script>',
      env: ["development"]
    }),
  ],
}
```


### Output

**index.html**

```html
<html><body><script src="index.js"></script></body></html>
```

## Options



<table>
<tr>
<th></th>
<th>Type</th>
<th>Default</th>
<th>Info</th>
</tr>
<tr>
<td>content</td>
<td>string</td>
<td>""</td>
<td>The text that will be injected into the final HTML output.</td>
</tr>
<tr>
<td>env</td>
<td>string[]</td>
<td>["development", "test"]</td>
<td>When the value of process.env.NODE_ENV is in the list, the plugin will take effect</td>
</tr>
</table>

