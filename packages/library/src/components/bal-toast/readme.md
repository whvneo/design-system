# bal-toast

Toast are used to inform the user with a simple text message.

## Usage

Toast can be created with the `balToastController`. The default duration is 5000 milliseconds.

```typescript
import { balToastController } from '@baloise/ui-library'

balToastController.create({ message: 'Hi I am a default Toast!', duration: 1000 })
balToastController.create({ message: 'Warning!', type: 'is-warning' })
balToastController.create({ message: 'Danger zone!', type: 'is-danger' })
```

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                    | Type                                                              | Default |
| ---------- | ---------- | -------------------------------------------------------------- | ----------------------------------------------------------------- | ------- |
| `duration` | `duration` | The duration of the toast                                      | `number`                                                          | `0`     |
| `type`     | `type`     | The theme type of the toast. Given by bulma our css framework. | `"" \| "danger" \| "info" \| "primary" \| "success" \| "warning"` | `''`    |


## Events

| Event      | Description                  | Type                  |
| ---------- | ---------------------------- | --------------------- |
| `balClose` | Emitted when toast is closed | `CustomEvent<string>` |


## Methods

### `close() => Promise<void>`

Closes this toast

#### Returns

Type: `Promise<void>`



### `closeIn(duration: number) => Promise<void>`

Closes the toast after the given duration in ms

#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [bal-icon](../bal-icon)

### Graph
```mermaid
graph TD;
  bal-toast --> bal-icon
  style bal-toast fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*