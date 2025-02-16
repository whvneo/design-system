import { Component, h, Host, Prop, Element, EventEmitter, Event, Method, Watch, Listen, State } from '@stencil/core'
import { isDescendant } from '../../../helpers/helpers'

@Component({
  tag: 'bal-checkbox',
})
export class Checkbox {
  private inputId = `bal-cb-${checkboxIds++}`
  private nativeInput?: HTMLInputElement

  @State() hasFocus = false

  @Element() el!: HTMLElement

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId

  /**
   * Defines the layout of the checkbox button
   */
  @Prop() interface: 'checkbox' | 'switch' = 'checkbox'

  /**
   * The tabindex of the control.
   */
  @Prop() balTabindex = 0

  /**
   * If `true`, the checkbox is selected.
   */
  @Prop({ mutable: true, reflect: true }) value = false

  /**
   * Update the native input element when the value changes
   */
  @Watch('value')
  protected valueChanged(newValue: boolean, oldValue: boolean) {
    if (newValue !== oldValue) {
      this.balChange.emit(this.value)
    }
  }

  /**
   * If `true`, the user cannot interact with the checkbox.
   */
  @Prop() disabled = false

  /**
   * If `true`, the control works on dark background.
   */
  @Prop() inverted = false

  /**
   * Emitted when the value property has changed.
   */
  @Event() balChange!: EventEmitter<boolean>

  /**
   * Emitted when the toggle has focus.
   */
  @Event() balFocus!: EventEmitter<FocusEvent>

  /**
   * Emitted when the toggle loses focus.
   */
  @Event() balBlur!: EventEmitter<FocusEvent>

  @Listen('click', { capture: true, target: 'document' })
  listenOnClick(ev: UIEvent) {
    if (this.disabled && ev.target && (ev.target === this.el || isDescendant(this.el, ev.target as HTMLElement))) {
      ev.preventDefault()
      ev.stopPropagation()
    }
  }

  /**
   * Sets the focus on the checkbox input element.
   */
  @Method()
  async setFocus() {
    if (this.nativeInput) {
      this.nativeInput.focus()
    }
  }

  /**
   * Returns the native `<input>` element used under the hood.
   */
  @Method()
  getInputElement(): Promise<HTMLInputElement | undefined> {
    return Promise.resolve(this.nativeInput)
  }

  private onInputFocus = (ev: FocusEvent) => {
    this.hasFocus = true
    this.balFocus.emit(ev)
  }

  private onInputBlur = (ev: FocusEvent) => {
    this.hasFocus = false
    this.balBlur.emit(ev)
  }

  private onClick = (ev: FocusEvent) => {
    const element = ev.target as HTMLAnchorElement
    if (element.href) {
      return
    }
    ev.preventDefault()

    this.value = !this.value
  }

  render() {
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        aria-hidden={this.disabled ? 'true' : null}
        aria-checked={`${this.value}`}
        aria-focused={this.hasFocus ? 'true' : null}
        role="checkbox"
        onClick={this.onClick}
        class={{
          'is-inverted': this.inverted,
          'is-disabled': this.disabled,
          'is-focused': this.hasFocus,
          'bal-checkbox': this.interface === 'checkbox',
          'bal-switch': this.interface === 'switch',
        }}
      >
        <input
          class={{
            'is-disabled': this.disabled,
            'data-test-checkbox-input': true,
          }}
          type="checkbox"
          id={this.inputId}
          checked={this.value}
          tabindex={this.balTabindex}
          aria-checked={`${this.value}`}
          disabled={this.disabled}
          onFocus={e => this.onInputFocus(e)}
          onBlur={e => this.onInputBlur(e)}
          ref={inputEl => (this.nativeInput = inputEl)}
        />
        <label
          class={{
            'option-label': true,
            'is-disabled': this.disabled,
            'data-test-checkbox-label': true,
          }}
        >
          <bal-text>
            <slot></slot>
          </bal-text>
        </label>
      </Host>
    )
  }
}

let checkboxIds = 0
