import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core'
import { debounceEvent, findItemLabel, inheritAttributes } from '../../../helpers/helpers'
import {
  FormInput,
  getInputTarget,
  inputHandleBlur,
  inputHandleChange,
  inputHandleClick,
  inputHandleFocus,
  inputHandleHostClick,
  inputListenOnClick,
  inputSetBlur,
  inputSetFocus,
} from '../../../helpers/form-input.helpers'
import { Props } from '../../../props'

@Component({
  tag: 'bal-input',
})
export class Input implements ComponentInterface, FormInput<string | undefined> {
  private inputId = `bal-input-${InputIds++}`
  private inheritedAttributes: { [k: string]: any } = {}

  nativeInput?: HTMLInputElement
  inputValue = this.value

  @Element() el!: HTMLElement

  @State() hasFocus = false

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId

  /**
   * If `true` the component gets a invalid style.
   */
  @Prop() invalid = false

  /**
   * Defines the type of the input (text, number, email ...).
   */
  @Prop() type: Props.BalInputInputType = 'text'

  /**
   * If the value of the type attribute is `"file"`, then this attribute will indicate the types of files that the server accepts, otherwise it will be ignored. The value must be a comma-separated list of unique content type specifiers.
   */
  @Prop() accept?: string

  /**
   * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.
   * Available options: `"off"`, `"none"`, `"on"`, `"sentences"`, `"words"`, `"characters"`.
   */
  @Prop() autocapitalize = 'off'

  /**
   * Indicates whether the value of the control can be automatically completed by the browser.
   */
  @Prop() autocomplete: Props.BalInputAutocomplete = 'off'

  /**
   * Whether auto correction should be enabled when the user is entering/editing the text value.
   */
  @Prop() autocorrect: Props.BalInputAutocorrect = 'off'

  /**
   * This Boolean attribute lets you specify that a form control should have input focus when the page loads.
   */
  @Prop() autofocus = false

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `balChange` event after each keystroke. This also impacts form bindings such as `ngModel` or `v-model`.
   */
  @Prop() debounce = 0

  @Watch('debounce')
  protected debounceChanged() {
    this.balChange = debounceEvent(this.balChange, this.debounce)
  }

  /**
   * Instructional text that shows before the input has a value.
   */
  @Prop() placeholder?: string

  /**
   * The maximum value, which must not be less than its minimum (min attribute) value.
   */
  @Prop() max?: string

  /**
   * Defines the max length of the value.
   */
  @Prop() maxLength?: number

  /**
   * The minimum value, which must not be greater than its maximum (max attribute) value.
   */
  @Prop() min?: string

  /**
   * Defines the min length of the value.
   */
  @Prop() minLength?: number

  /**
   * If `true`, the user can enter more than one value. This attribute applies when the type attribute is set to `"email"` or `"file"`, otherwise it is ignored.
   */
  @Prop() multiple?: boolean

  /**
   * A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, `"date"`, or `"password"`, otherwise it is ignored. When the type attribute is `"date"`, `pattern` will only be used in browsers that do not support the `"date"` input type natively. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date for more information.
   */
  @Prop() pattern?: string

  /**
   * If `true`, the user must fill in a value before submitting a form.
   */
  @Prop() required = false

  /**
   * If `true`, the element will have its spelling and grammar checked.
   */
  @Prop() spellcheck = false

  /**
   * If `true` this component can be placed on dark background
   */
  @Prop() inverted = false

  /**
   * If `true`, the user cannot modify the value.
   */
  @Prop() readonly = false

  /**
   * If `true` the input is disabled
   */
  @Prop() disabled = false

  /**
   * If `true` the input gets a clickable cursor style
   */
  @Prop() clickable = false

  /**
   * @deprecated
   * If `true` on mobile device the number keypad is active. Use the <bal-number-input> component instead.
   */
  @Prop() numberInput = false

  @Watch('numberInput')
  numberInputHandler() {
    if (this.numberInput) {
      console.warn('[DEPRECATED] - Please use the component <bal-number-input> instead')
    }
  }

  /**
   * @deprecated
   * Defines the allowed decimal points for the `number-input`. Use the <bal-number-input> component instead.
   */
  @Prop() decimal?: number

  @Watch('decimal')
  decimalHandler() {
    if (this.decimal) {
      console.warn('[DEPRECATED] - Please use the component <bal-number-input> instead')
    }
  }

  /**
   * Adds a suffix the the input-value after blur.
   */
  @Prop() suffix?: string

  /**
   * @internal
   * If `true` the input will get some right padding.
   */
  @Prop() hasIconRight = false

  /**
   * A hint to the browser for which keyboard to display.
   * Possible values: `"none"`, `"text"`, `"tel"`, `"url"`,
   * `"email"`, `"numeric"`, `"decimal"`, and `"search"`.
   */
  @Prop() inputmode?: Props.BalInputInputMode

  /**
   * The value of the input.
   */
  @Prop({ mutable: true }) value?: string = undefined

  /**
   * Mask of the input field. It defines what the user can enter and how the format looks like. Currently, only for Switzerland formatted.
   * Formatting for 'contract-number': '00/0.000.000'
   * Formatting for 'claim-number': ('73/001217/16.9')
   * Formatting for 'offer-number': ('98/7.654.321')
   // */
  @Prop() mask?: 'contract-number' | 'claim-number' | 'offer-number' = undefined

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event() balInput!: EventEmitter<string | undefined>

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event() balBlur!: EventEmitter<FocusEvent>

  /**
   * Emitted when the input has clicked.
   */
  @Event() balClick!: EventEmitter<MouseEvent>

  /**
   * Emitted when a keyboard key has pressed.
   */
  @Event() balKeyPress!: EventEmitter<KeyboardEvent>

  /**
   * Emitted when the input has focus.
   */
  @Event() balFocus!: EventEmitter<FocusEvent>

  /**
   * Emitted when the input value has changed.
   */
  @Event() balChange!: EventEmitter<string | undefined>

  @Listen('click', { capture: true, target: 'document' })
  listenOnClick(event: UIEvent) {
    inputListenOnClick(this, event)
  }

  connectedCallback() {
    this.debounceChanged()
  }

  componentDidLoad() {
    this.inputValue = this.value
  }

  componentWillLoad() {
    this.inheritedAttributes = inheritAttributes(this.el, ['aria-label', 'tabindex', 'title'])
  }

  /**
   * Sets focus on the native `input` in `bal-input`. Use this method instead of the global
   * `input.focus()`.
   */
  @Method()
  async setFocus() {
    inputSetFocus(this)
  }

  /**
   * Sets blur on the native `input` in `bal-input`. Use this method instead of the global
   * `input.blur()`.
   * @internal
   */
  @Method()
  async setBlur() {
    inputSetBlur(this)
  }

  /**
   * Returns the native `<input>` element used under the hood.
   */
  @Method()
  getInputElement(): Promise<HTMLInputElement> {
    return Promise.resolve(this.nativeInput!)
  }

  private getRawValue(): string {
    const value = (this.value || '').toString()
    return value
  }

  private getFormattedValue(): string {
    const value = this.getRawValue()
    const suffix = this.suffix !== undefined && value !== undefined && value !== '' ? ' ' + this.suffix : ''
    return `${value}${suffix}`
  }

  private onInput = (ev: InputEvent) => {
    const input = getInputTarget(ev)
    // TODO dispatch action only if changed, edit in cursor position
    if (input) {
      switch (this.mask) {
        case 'contract-number': {
          this.inputValue = input.value.replace(/\D/g, '')
          if (this.inputValue.length > MAX_LENGTH_CONTRACT_NUMBER) {
            this.inputValue = this.inputValue.substring(0, MAX_LENGTH_CONTRACT_NUMBER)
          }
          input.value = this.formatPolicy(this.inputValue)
          break
        }
        case 'offer-number': {
          this.inputValue = input.value.replace(/\D/g, '')
          if (this.inputValue.length > MAX_LENGTH_OFFER_NUMBER) {
            this.inputValue = this.inputValue.substring(0, MAX_LENGTH_OFFER_NUMBER)
          }
          input.value = this.formatOffer(this.inputValue)
          break
        }
        case 'claim-number': {
          this.inputValue = input.value.replace(/\D/g, '')
          if (this.inputValue.length > MAX_LENGTH_CLAIM_NUMBER) {
            this.inputValue = this.inputValue.substring(0, MAX_LENGTH_CLAIM_NUMBER)
          }
          input.value = this.formatClaim(this.inputValue)
          break
        }
        default:
          this.inputValue = input.value
      }
    }

    this.balInput.emit(this.inputValue)
  }

  /**
   *
   * @param value - input number
   * @output 73/001217/16.9
   * @private
   */
  private formatClaim(value: string): string {
    if (!value) {
      return ''
    }
    const newValue = `${value}`.trim()
    const parts = [
      newValue.substring(0, 2),
      newValue.substring(2, 8),
      newValue.substring(8, 10),
      newValue.substring(10, 11),
    ].filter(val => val.length > 0)
    switch (parts.length) {
      case 1:
        return `${value}`
      case 2:
        return `${parts[0]}/${parts[1]}`
      case 3:
        return `${parts[0]}/${parts[1]}/${parts[2]}`
      default:
        return `${parts[0]}/${parts[1]}/${parts[2]}.${parts[3]}`
    }
  }

  /**
   *
   * @param value: input number
   * @output 00/0.000.000
   * @private
   */
  private formatPolicy(value: string): string {
    if (!value) {
      return ''
    }
    let newValue = `${value}`.trim()
    if (newValue[0] !== '0') {
      newValue = `0${value}`
    }
    return this.formatOffer(newValue)
  }

  /**
   *
   * @param value: input number
   * @output 98/7.654.321
   * @private
   */
  private formatOffer(value: string): string {
    if (!value) {
      return ''
    }
    const newValue = `${value}`.trim()
    const parts = [
      newValue.substring(0, 2),
      newValue.substring(2, 3),
      newValue.substring(3, 6),
      newValue.substring(6, 9),
    ].filter(val => val.length > 0)
    switch (parts.length) {
      case 1:
        return `${newValue}`
      case 2:
        return `${parts[0]}/${parts[1]}`
      case 3:
        return `${parts[0]}/${parts[1]}.${parts[2]}`
      default:
        return `${parts[0]}/${parts[1]}.${parts[2]}.${parts[3]}`
    }
  }

  private onFocus = (event: FocusEvent) => inputHandleFocus(this, event)

  private onBlur = (ev: FocusEvent) => {
    inputHandleBlur(this, ev)

    const input = ev.target as HTMLInputElement | null
    if (input) {
      if (this.mask === undefined) {
        input.value = this.getFormattedValue()
        inputHandleChange(this)
      } else {
        this.balChange.emit(this.inputValue)
      }
    }
  }

  private getAllowedKeys() {
    return [...NUMBER_KEYS, ...ACTION_KEYS]
  }

  private onKeydown = (event: KeyboardEvent) => {
    if (this.mask !== undefined && !isNil(event) && !isCtrlOrCommandKey(event)) {
      if (!this.getAllowedKeys().includes(event.key)) {
        // do not trigger next event -> on input
        return stopEventBubbling(event)
      }
    }
  }

  private onClick = (event: MouseEvent) => inputHandleClick(this, event)

  private handleClick = (event: MouseEvent) => inputHandleHostClick(this, event)

  render() {
    /**
     * @deprecated should be removed in the next breaking change release.
     */
    if (this.numberInput) {
      const numberValue: number | undefined = !this.value ? undefined : parseFloat(this.value)
      return (
        <bal-number-input
          value={numberValue}
          name={this.name}
          disabled={this.disabled}
          invalid={this.invalid}
          decimal={this.decimal}
          suffix={this.suffix}
          placeholder={this.placeholder}
          required={this.required}
          readonly={this.readonly}
          debounce={this.debounce}
          onBalFocus={e => this.balFocus.emit(e.detail)}
          onBalBlur={e => this.balBlur.emit(e.detail)}
          onBalInput={e => this.balInput.emit(e.detail?.toString())}
          onBalChange={e => this.balChange.emit(e.detail?.toString())}
          onBalKeyPress={e => this.balKeyPress.emit(e.detail)}
          onBalClick={e => this.balClick.emit(e.detail)}
        ></bal-number-input>
      )
    }

    const value = this.hasFocus ? this.getRawValue() : this.getFormattedValue()
    const labelId = this.inputId + '-lbl'
    const label = findItemLabel(this.el)
    if (label) {
      label.id = labelId
      label.htmlFor = this.inputId
    }
    let inputProps = {}
    if (this.pattern) {
      inputProps = { pattern: this.pattern }
    }

    return (
      <Host
        onClick={this.handleClick}
        aria-disabled={this.disabled ? 'true' : null}
        class={{
          'is-disabled': this.disabled,
        }}
      >
        <input
          class={{
            'input': true,
            'is-disabled': this.disabled,
            'is-danger': this.invalid,
            'is-inverted': this.inverted,
            'clickable': this.clickable,
            'has-icon-right': this.hasIconRight,
          }}
          ref={inputEl => (this.nativeInput = inputEl)}
          id={this.inputId}
          aria-labelledby={labelId}
          disabled={this.disabled}
          accept={this.accept}
          inputMode={this.inputmode}
          autoCapitalize={this.autocapitalize}
          autoComplete={this.autocomplete}
          autoCorrect={this.autocorrect}
          autofocus={this.autofocus}
          min={this.min}
          max={this.max}
          minLength={this.minLength}
          maxLength={this.maxLength}
          multiple={this.multiple}
          name={this.name}
          placeholder={this.placeholder || ''}
          readOnly={this.readonly}
          required={this.required}
          spellcheck={this.spellcheck}
          type={this.type}
          value={value}
          onFocus={this.onFocus}
          onInput={ev => this.onInput(ev as InputEvent)}
          onKeyDown={e => this.onKeydown(e)}
          onBlur={this.onBlur}
          onClick={this.onClick}
          onKeyPress={e => this.balKeyPress.emit(e)}
          {...inputProps}
          {...this.inheritedAttributes}
        />
      </Host>
    )
  }
}

let InputIds = 0
const MAX_LENGTH_CONTRACT_NUMBER = 9
const MAX_LENGTH_OFFER_NUMBER = 9
const MAX_LENGTH_CLAIM_NUMBER = 11
