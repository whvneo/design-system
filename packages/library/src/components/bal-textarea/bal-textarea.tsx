import { Component, h, Host, Prop, Element, EventEmitter, Event, Method, Watch } from '@stencil/core'
import { debounceEvent, findItemLabel } from '../../utils/helpers'

@Component({
  tag: 'bal-textarea',
  styleUrl: 'bal-textarea.scss',
  shadow: false,
  scoped: true,
})
export class Textarea {
  private inputId = `bal-textarea-${TextareaIds++}`
  private nativeInput?: HTMLTextAreaElement

  @Element() el!: HTMLElement

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId

  /**
   * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.
   */
  @Prop() autocapitalize = 'none'

  /**
   * This Boolean attribute lets you specify that a form control should have input focus when the page loads.
   */
  @Prop() autofocus = false

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. This also impacts form bindings such as `ngModel` or `v-model`.
   */
  @Prop() debounce = 0

  @Watch('debounce')
  protected debounceChanged() {
    this.balChange = debounceEvent(this.balChange, this.debounce)
  }

  /**
   * If `true`, the user cannot interact with the textarea.
   */
  @Prop() disabled = false

  /**
   * Instructional text that shows before the input has a value.
   */
  @Prop() placeholder?: string | null

  /**
   * The tabindex of the control.
   */
  @Prop() balTabindex: number = 0

  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.
   */
  @Prop() maxLength?: number

  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.
   */
  @Prop() minLength?: number

  /**
   * If `true` this component can be placed on dark background
   */
  @Prop() inverted = false

  /**
   * If `true`, the user cannot modify the value.
   */
  @Prop() readonly = false

  /**
   * The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.
   */
  @Prop() cols?: number

  /**
   * The number of visible text lines for the control.
   */
  @Prop() rows?: number

  /**
   * Indicates how the control wraps text.
   */
  @Prop() wrap?: 'hard' | 'soft' | 'off'

  /**
   * If `true`, the user must fill in a value before submitting a form.
   */
  @Prop() required = false

  /**
   * If `true` the input gets a clickable cursor style
   */
  @Prop() clickable = false

  /**
   * A hint to the browser for which keyboard to display.
   * Possible values: `"none"`, `"text"`, `"tel"`, `"url"`,
   * `"email"`, `"numeric"`, `"decimal"`, and `"search"`.
   */
  @Prop() inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'

  /**
   * The value of the textarea.
   */
  @Prop({ mutable: true }) value?: string | null = ''

  /**
   * Update the native input element when the value changes
   */
  @Watch('value')
  protected valueChanged() {
    const nativeInput = this.nativeInput
    const value = this.getValue()
    if (nativeInput && nativeInput.value !== value) {
      nativeInput.value = value
    }

    this.balChange.emit(value)
  }

  /**
   * Emitted when the input value has changed..
   */
  @Event({ eventName: 'balChange' }) balChange!: EventEmitter<string>

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event({ eventName: 'balInput' }) balInput!: EventEmitter<string>

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event({ eventName: 'balBlur' }) balBlur!: EventEmitter<FocusEvent>

  /**
   * Emitted when the input has clicked.
   */
  @Event({ eventName: 'balClick' }) balClick!: EventEmitter<MouseEvent>

  /**
   * Emitted when a keyboard key has pressed.
   */
  @Event({ eventName: 'balKeyPress' }) balKeyPress!: EventEmitter<KeyboardEvent>

  /**
   * Emitted when the input has focus.
   */
  @Event({ eventName: 'balFocus' }) balFocus!: EventEmitter<FocusEvent>

  connectedCallback() {
    this.debounceChanged()
  }

  /**
   * Sets focus on the native `textarea` in `ion-textarea`. Use this method instead of the global
   * `textarea.focus()`.
   */
  @Method()
  async setFocus() {
    if (this.nativeInput) {
      this.nativeInput.focus()
    }
  }

  /**
   * Returns the native `<textarea>` element used under the hood.
   */
  @Method()
  getInputElement(): Promise<HTMLTextAreaElement> {
    return Promise.resolve(this.nativeInput!)
  }

  private getValue(): string {
    return this.value || ''
  }

  private onInput = () => {
    if (this.nativeInput) {
      this.value = this.nativeInput.value
    }
    this.balInput.emit(this.value)
  }

  render() {
    const value = this.getValue()
    const labelId = this.inputId + '-lbl'
    const label = findItemLabel(this.el)
    if (label) {
      label.id = labelId
      label.htmlFor = this.inputId
    }

    return (
      <Host aria-disabled={this.disabled ? 'true' : null}>
        <textarea
          class={{
            'textarea': true,
            'is-inverted': this.inverted,
            'clickable': this.clickable,
          }}
          ref={inputEl => (this.nativeInput = inputEl)}
          id={this.inputId}
          aria-labelledby={labelId}
          disabled={this.disabled}
          autoCapitalize={this.autocapitalize}
          autoFocus={this.autofocus}
          minLength={this.minLength}
          maxLength={this.maxLength}
          placeholder={this.placeholder}
          inputMode={this.inputmode}
          name={this.name}
          value={this.value}
          tabindex={this.balTabindex}
          readonly={this.readonly}
          cols={this.cols}
          rows={this.rows}
          wrap={this.wrap}
          onInput={this.onInput}
          onChange={() => this.balChange.emit(this.value)}
          onBlur={e => this.balBlur.emit(e)}
          onClick={e => this.balClick.emit(e)}
          onKeyPress={e => this.balKeyPress.emit(e)}
          onFocus={e => this.balFocus.emit(e)}>
          {value}
        </textarea>
      </Host>
    )
  }
}

let TextareaIds = 0
