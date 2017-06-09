'use strict';

import Component from 'metal-component';
import dom from 'metal-dom';
import Soy from 'metal-soy';
import { Align } from 'metal-position';
import Dropdown from 'metal-dropdown';
import { Config } from 'metal-state';

import 'metal-clay-icon';

import templates from './MetalClayDropdown.soy';

/**
 * Dropdown Metal Quartz component.
 */
class MetalClayDropdown extends Dropdown {
	/**
	 * @inheritDoc
	 * @override
	 */
	created() {
		super.created();

		MetalClayDropdown.instances.push(this);

		this.maybeBindDelegatedToggler_();

		this.eventHandler_.add(dom.on(document, 'keydown', this.handleESCPress_.bind(this)));
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	close() {
		super.close();
		let alignElement = this.getTogglerElement_();
		if (alignElement) {
			alignElement.focus();
		}
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	handleDocClick_(event) {
		let { target } = event;

		if (!this.expanded) {
			return;
		}

		if (this.alignElementSelector && dom.match(target, this.alignElementSelector)) {
			return;
		}

		super.handleDocClick_(event);
	}

	/**
	 * Handles keypress in order to select the next or the previous available
	 * item.
	 * @param {!Event} event
	 * @protected
	 */
	handleESCPress_(event) {
		if (event.keyCode === 27 && this.expanded) {
			this.close();
		}
	}

	 * Listen to the click event on the givin alignELementSelector.
	 * @protected
	 */
	maybeBindDelegatedToggler_() {
		if (this.alignElementSelector) {
			dom.on(this.alignElementSelector, 'click', this.toggle.bind(this));
		}
	}

	/**
	 * Returns the element responsible for toggling the visibility of the menu 
	 * that can be that rendered by the soy file or one that matches with the 
	 * given alignElementSelector attribute.
	 * @protected
	 */
	getTogglerElement_() {
		return this.refs.toggler || document.querySelector(this.alignElementSelector);
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	syncExpanded(expanded) {
		let alignElement = this.refs.toggler || document.querySelector(this.alignElementSelector);
		if (expanded && alignElement) {
			let bodyElement = this.refs.dropdownmenu;
			this.alignedPosition = Align.align(bodyElement, alignElement, this.position);
		}
	}
}

/**
 * State definition.
 * @static
 * @type {!Object}
 */
MetalClayDropdown.STATE = {
	/**
	 * The dropdown's body content.
	 * @instance
	 * @memberof MetalClayDropdown
	 * @type {string}
	 * @default undefined
	 */
	body: {
		isHtml: true
	},

	/**
	 * The items to add to the dropdown-menu.
	 * @instance
	 * @memberof MetalClayDropdown
	 * @type {array|undefined}
	 * @default undefined
	 */
	dropdownItems: Config.array(),

	/**
	 * The CSS class to toggle when opening and closing the dropdown.
	 * @instance
	 * @memberof MetalClayDropdown
	 * @type {string}
	 * @default `show`
	 */
	dropdownOpenClass: Config.string().value('show'),

	/**
	 * The HTML element to use on .dropdown.
	 * @instance
	 * @memberof MetalClayDropdown
	 * @type {string}
	 * @default `div`
	 */
	dropdownContainerElement: Config.string().value('div'),

	/**
	 * The configuration for the dropdown-toggle
	 * @instance
	 * @memberof MetalClayDropdown
	 * @type {!Object|undefined}
	 * @default undefined
	 */
	dropdownToggle: Config.object(),

	/**
	 * The dropdown's header content.
	 * @instance
	 * @memberof MetalClayDropdown
	 * @type {string|undefined}
	 * @default undefined
	 */
	header: {
		isHtml: true
	},

	/**
	 * Says if the Dropdown Menu will be rendered or not.
	 * @instance
	 * @memberof MetalClayDropdown
	 * @type {boolean}
	 * @default false
	 */
	renderDropdownMenu: Config.bool().value(true)
};

/**
 * An array of all MetalClayDropdown's that are created on the page.
 */
MetalClayDropdown.instances = [];

Soy.register(MetalClayDropdown, templates);

export default MetalClayDropdown;