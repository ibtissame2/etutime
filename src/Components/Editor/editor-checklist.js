/**
 * Skipped minification because the original files appears to be already minified.
 * Original file: /npm/@editorjs/checklist@1.6.0/dist/checklist.umd.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var e = document.createElement('style');
e.appendChild(
	document.createTextNode(
		'.cdx-checklist{gap:6px;display:flex;flex-direction:column}.cdx-checklist__item{display:flex;box-sizing:content-box;align-items:flex-start}.cdx-checklist__item-text{outline:none;flex-grow:1;line-height:1.57em}.cdx-checklist__item-checkbox{width:22px;height:22px;display:flex;align-items:center;margin-right:8px;margin-top:calc(.785em - 11px);cursor:pointer}.cdx-checklist__item-checkbox svg{opacity:0;height:20px;width:20px;position:absolute;left:-1px;top:-1px;max-height:20px}@media (hover: hover){.cdx-checklist__item-checkbox:not(.cdx-checklist__item-checkbox--no-hover):hover .cdx-checklist__item-checkbox-check svg{opacity:1}}.cdx-checklist__item-checkbox-check{cursor:pointer;display:inline-block;flex-shrink:0;position:relative;width:20px;height:20px;box-sizing:border-box;margin-left:0;border-radius:5px;border:1px solid #C9C9C9;background:#fff}.cdx-checklist__item-checkbox-check:before{content:"";position:absolute;top:0;right:0;bottom:0;left:0;border-radius:100%;background-color:#369fff;visibility:hidden;pointer-events:none;transform:scale(1);transition:transform .4s ease-out,opacity .4s}@media (hover: hover){.cdx-checklist__item--checked .cdx-checklist__item-checkbox:not(.cdx-checklist__item--checked .cdx-checklist__item-checkbox--no-hover):hover .cdx-checklist__item-checkbox-check{background:#0059AB;border-color:#0059ab}}.cdx-checklist__item--checked .cdx-checklist__item-checkbox-check{background:#369FFF;border-color:#369fff}.cdx-checklist__item--checked .cdx-checklist__item-checkbox-check svg{opacity:1}.cdx-checklist__item--checked .cdx-checklist__item-checkbox-check svg path{stroke:#fff}.cdx-checklist__item--checked .cdx-checklist__item-checkbox-check:before{opacity:0;visibility:visible;transform:scale(2.5)}'
	)
);
document.head.appendChild(e);

export default (function () {
	const l = '',
		c =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 12L10.4884 15.8372C10.5677 15.9245 10.705 15.9245 10.7844 15.8372L17 9"/></svg>',
		g =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9.2 12L11.0586 13.8586C11.1367 13.9367 11.2633 13.9367 11.3414 13.8586L14.7 10.5"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>';
	function d() {
		const s = document.activeElement,
			t = window.getSelection().getRangeAt(0),
			n = t.cloneRange();
		return n.selectNodeContents(s), n.setStart(t.endContainer, t.endOffset), n.extractContents();
	}
	function f(s) {
		const e = document.createElement('div');
		return e.appendChild(s), e.innerHTML;
	}
	function o(s, e = null, t = {}) {
		const n = document.createElement(s);
		Array.isArray(e) ? n.classList.add(...e) : e && n.classList.add(e);
		for (const i in t) n[i] = t[i];
		return n;
	}
	function m(s) {
		return s.innerHTML.replace('<br>', ' ').trim();
	}
	function p(s, e = !1, t = void 0) {
		const n = document.createRange(),
			i = window.getSelection();
		n.selectNodeContents(s),
			t !== void 0 && (n.setStart(s, t), n.setEnd(s, t)),
			n.collapse(e),
			i.removeAllRanges(),
			i.addRange(n);
	}
	Element.prototype.matches ||
		(Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector),
		Element.prototype.closest ||
			(Element.prototype.closest = function (s) {
				let e = this;
				if (!document.documentElement.contains(e)) return null;
				do {
					if (e.matches(s)) return e;
					e = e.parentElement || e.parentNode;
				} while (e !== null && e.nodeType === 1);
				return null;
			});
	class C {
		static get isReadOnlySupported() {
			return !0;
		}
		static get enableLineBreaks() {
			return !0;
		}
		static get toolbox() {
			return { icon: g, title: 'Checklist' };
		}
		static get conversionConfig() {
			return {
				export: (e) => e.items.map(({ text: t }) => t).join('. '),
				import: (e) => ({ items: [{ text: e, checked: !1 }] }),
			};
		}
		constructor({ data: e, config: t, api: n, readOnly: i }) {
			(this._elements = { wrapper: null, items: [] }), (this.readOnly = i), (this.api = n), (this.data = e || {});
		}
		render() {
			return (
				(this._elements.wrapper = o('div', [this.CSS.baseBlock, this.CSS.wrapper])),
				this.data.items || (this.data.items = [{ text: '', checked: !1 }]),
				this.data.items.forEach((e) => {
					const t = this.createChecklistItem(e);
					this._elements.wrapper.appendChild(t);
				}),
				this.readOnly
					? this._elements.wrapper
					: (this._elements.wrapper.addEventListener(
							'keydown',
							(e) => {
								const [t, n] = [13, 8];
								switch (e.keyCode) {
									case t:
										this.enterPressed(e);
										break;
									case n:
										this.backspace(e);
										break;
								}
							},
							!1
					  ),
					  this._elements.wrapper.addEventListener('click', (e) => {
							this.toggleCheckbox(e);
					  }),
					  this._elements.wrapper)
			);
		}
		save() {
			let e = this.items.map((t) => {
				const n = this.getItemInput(t);
				return { text: m(n), checked: t.classList.contains(this.CSS.itemChecked) };
			});
			return (e = e.filter((t) => t.text.trim().length !== 0)), { items: e };
		}
		validate(e) {
			return !!e.items.length;
		}
		toggleCheckbox(e) {
			const t = e.target.closest(`.${this.CSS.item}`),
				n = t.querySelector(`.${this.CSS.checkboxContainer}`);
			n.contains(e.target) &&
				(t.classList.toggle(this.CSS.itemChecked),
				n.classList.add(this.CSS.noHover),
				n.addEventListener('mouseleave', () => this.removeSpecialHoverBehavior(n), { once: !0 }));
		}
		createChecklistItem(e = {}) {
			const t = o('div', this.CSS.item),
				n = o('span', this.CSS.checkbox),
				i = o('div', this.CSS.checkboxContainer),
				a = o('div', this.CSS.textField, {
					innerHTML: e.text ? e.text : '',
					contentEditable: !this.readOnly,
				});
			return (
				e.checked && t.classList.add(this.CSS.itemChecked),
				(n.innerHTML = c),
				i.appendChild(n),
				t.appendChild(i),
				t.appendChild(a),
				t
			);
		}
		enterPressed(e) {
			e.preventDefault();
			const t = this.items,
				n = document.activeElement.closest(`.${this.CSS.item}`);
			if (t.indexOf(n) === t.length - 1 && m(this.getItemInput(n)).length === 0) {
				const x = this.api.blocks.getCurrentBlockIndex();
				n.remove(), this.api.blocks.insert(), this.api.caret.setToBlock(x + 1);
				return;
			}
			const u = d(),
				h = f(u),
				r = this.createChecklistItem({ text: h, checked: !1 });
			this._elements.wrapper.insertBefore(r, n.nextSibling), p(this.getItemInput(r), !0);
		}
		backspace(e) {
			const t = e.target.closest(`.${this.CSS.item}`),
				n = this.items.indexOf(t),
				i = this.items[n - 1];
			if (!i || !(window.getSelection().focusOffset === 0)) return;
			e.preventDefault();
			const h = d(),
				r = this.getItemInput(i),
				k = r.childNodes.length;
			r.appendChild(h), p(r, void 0, k), t.remove();
		}
		get CSS() {
			return {
				baseBlock: this.api.styles.block,
				wrapper: 'cdx-checklist',
				item: 'cdx-checklist__item',
				itemChecked: 'cdx-checklist__item--checked',
				noHover: 'cdx-checklist__item-checkbox--no-hover',
				checkbox: 'cdx-checklist__item-checkbox-check',
				textField: 'cdx-checklist__item-text',
				checkboxContainer: 'cdx-checklist__item-checkbox',
			};
		}
		get items() {
			return Array.from(this._elements.wrapper.querySelectorAll(`.${this.CSS.item}`));
		}
		removeSpecialHoverBehavior(e) {
			e.classList.remove(this.CSS.noHover);
		}
		getItemInput(e) {
			return e.querySelector(`.${this.CSS.textField}`);
		}
	}
	return C;
})();
