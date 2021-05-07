// generated file by .scripts/icons.script.js

import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'bal-icon-trash',
  styleUrl: '../bal-icon-svg.scss',
  shadow: false,
  scoped: true,
})
export class IconTrash {
  /**
   * Defines the size of the icon.
   */
  @Prop() size: 'xsmall' | 'small' | 'medium' | 'large' | '' = ''

  render() {
    return (
      <Host class={{ [`is-size-${this.size}`]: !!this.size }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M11.47 11.588c-.529 0-.882.353-.882.883v10.588c0 .53.353.882.883.882.529 0 .882-.353.882-.882V12.47c0-.53-.353-.883-.882-.883zM15 11.588c-.53 0-.882.353-.882.883v10.588c0 .53.353.882.882.882.53 0 .882-.353.882-.882V12.47c0-.53-.353-.883-.882-.883zM18.53 11.588c-.53 0-.883.353-.883.883v10.588c0 .53.353.882.882.882.53 0 .883-.353.883-.882V12.47c0-.53-.353-.883-.883-.883z"/><path d="M29.118 4.53h-7.942V1.881c0-.53-.352-.882-.882-.882H9.706c-.53 0-.882.353-.882.882V4.53H.882c-.53 0-.882.353-.882.883s.353.882.882.882h4.412v22.059c0 .53.353.882.882.882h17.648c.529 0 .882-.353.882-.882V6.294h4.412c.53 0 .882-.353.882-.882 0-.53-.353-.883-.882-.883zm-18.53-1.765h8.824v1.764h-8.824V2.765zM22.941 27.47H7.06V6.294H22.94v21.177z"/></svg>
      </Host>
    );
  }
}