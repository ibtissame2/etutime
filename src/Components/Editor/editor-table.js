/**
 * Skipped minification because the original files appears to be already minified.
 * Original file: /npm/@editorjs/table@2.3.0/dist/table.umd.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var o = document.createElement('style');
o.appendChild(
	document.createTextNode(
		'.tc-wrap{--color-background:#f9f9fb;--color-text-secondary:#7b7e89;--color-border:#e8e8eb;--cell-size:34px;--toolbox-icon-size:18px;--toolbox-padding:6px;--toolbox-aiming-field-size:calc(var(--toolbox-icon-size) + var(--toolbox-padding)*2);border-left:0;position:relative;height:100%;width:100%;margin-top:var(--toolbox-icon-size);box-sizing:border-box;display:grid;grid-template-columns:calc(100% - var(--cell-size)) var(--cell-size)}.tc-wrap--readonly{grid-template-columns:100% var(--cell-size)}.tc-wrap svg{vertical-align:top}@media print{.tc-wrap{border-left-color:var(--color-border);border-left-style:solid;border-left-width:1px;grid-template-columns:100% var(--cell-size)}}@media print{.tc-wrap .tc-row:after{display:none}}.tc-table{position:relative;width:100%;height:100%;display:grid;font-size:14px;border-top:1px solid var(--color-border);line-height:1.4}.tc-table:after{width:calc(var(--cell-size));height:100%;left:calc(var(--cell-size)*-1);top:0}.tc-table:after,.tc-table:before{position:absolute;content:""}.tc-table:before{width:100%;height:var(--toolbox-aiming-field-size);top:calc(var(--toolbox-aiming-field-size)*-1);left:0}.tc-table--heading .tc-row:first-child{font-weight:600;border-bottom:2px solid var(--color-border)}.tc-table--heading .tc-row:first-child [contenteditable]:empty:before{content:attr(heading);color:var(--color-text-secondary)}.tc-table--heading .tc-row:first-child:after{bottom:-2px;border-bottom:2px solid var(--color-border)}.tc-add-column,.tc-add-row{display:flex;color:var(--color-text-secondary)}@media print{.tc-add{display:none}}.tc-add-column{padding:4px 0;justify-content:center;border-top:1px solid var(--color-border)}@media print{.tc-add-column{display:none}}.tc-add-row{height:var(--cell-size);align-items:center;padding-left:4px;position:relative}.tc-add-row:before{content:"";position:absolute;right:calc(var(--cell-size)*-1);width:var(--cell-size);height:100%}@media print{.tc-add-row{display:none}}.tc-add-column,.tc-add-row{transition:0s;cursor:pointer;will-change:background-color}.tc-add-column:hover,.tc-add-row:hover{transition:background-color .1s ease;background-color:var(--color-background)}.tc-add-row{margin-top:1px}.tc-add-row:hover:before{transition:.1s;background-color:var(--color-background)}.tc-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(10px,1fr));position:relative;border-bottom:1px solid var(--color-border)}.tc-row:after{content:"";pointer-events:none;position:absolute;width:var(--cell-size);height:100%;bottom:-1px;right:calc(var(--cell-size)*-1);border-bottom:1px solid var(--color-border)}.tc-row--selected{background:var(--color-background)}.tc-row--selected:after{background:var(--color-background)}.tc-cell{border-right:1px solid var(--color-border);padding:6px 12px;overflow:hidden;outline:none;line-break:normal}.tc-cell--selected{background:var(--color-background)}.tc-wrap--readonly .tc-row:after{display:none}.tc-toolbox{--toolbox-padding:6px;--popover-margin:30px;--toggler-click-zone-size:30px;--toggler-dots-color:#7b7e89;--toggler-dots-color-hovered:#1d202b;position:absolute;cursor:pointer;z-index:1;opacity:0;transition:opacity .1s;will-change:left,opacity}.tc-toolbox--column{top:calc(var(--toggler-click-zone-size)*-1);transform:translate(calc(var(--toggler-click-zone-size)*-1/2));will-change:left,opacity}.tc-toolbox--row{left:calc(var(--popover-margin)*-1);transform:translateY(calc(var(--toggler-click-zone-size)*-1/2));margin-top:-1px;will-change:top,opacity}.tc-toolbox--showed{opacity:1}.tc-toolbox .tc-popover{position:absolute;top:0;left:var(--popover-margin)}.tc-toolbox__toggler{display:flex;align-items:center;justify-content:center;width:var(--toggler-click-zone-size);height:var(--toggler-click-zone-size);color:var(--toggler-dots-color);opacity:0;transition:opacity .15s ease;will-change:opacity}.tc-toolbox__toggler:hover{color:var(--toggler-dots-color-hovered)}.tc-toolbox__toggler svg{fill:currentColor}.tc-wrap:hover .tc-toolbox__toggler{opacity:1}.tc-settings .cdx-settings-button{width:50%;margin:0}.tc-popover{--color-border:#eaeaea;--color-background:#fff;--color-background-hover:rgba(232,232,235,.49);--color-background-confirm:#e24a4a;--color-background-confirm-hover:#d54040;--color-text-confirm:#fff;background:var(--color-background);border:1px solid var(--color-border);box-shadow:0 3px 15px -3px #0d142121;border-radius:6px;padding:6px;display:none;will-change:opacity,transform}.tc-popover--opened{display:block;animation:menuShowing .1s cubic-bezier(.215,.61,.355,1) forwards}.tc-popover__item{display:flex;align-items:center;padding:2px 14px 2px 2px;border-radius:5px;cursor:pointer;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;user-select:none}.tc-popover__item:hover{background:var(--color-background-hover)}.tc-popover__item:not(:last-of-type){margin-bottom:2px}.tc-popover__item-icon{display:inline-flex;width:26px;height:26px;align-items:center;justify-content:center;background:var(--color-background);border-radius:5px;border:1px solid var(--color-border);margin-right:8px}.tc-popover__item-label{line-height:22px;font-size:14px;font-weight:500}.tc-popover__item--confirm{background:var(--color-background-confirm);color:var(--color-text-confirm)}.tc-popover__item--confirm:hover{background-color:var(--color-background-confirm-hover)}.tc-popover__item--confirm .tc-popover__item-icon{background:var(--color-background-confirm);border-color:#0000001a}.tc-popover__item--confirm .tc-popover__item-icon svg{transition:transform .2s ease-in;transform:rotate(90deg) scale(1.2)}.tc-popover__item--hidden{display:none}@keyframes menuShowing{0%{opacity:0;transform:translateY(-8px) scale(.9)}70%{opacity:1;transform:translateY(2px)}to{transform:translateY(0)}}'
	)
);
document.head.appendChild(o);

export default (function () {
	'use strict';
	function d(a, e, t = {}) {
		const o = document.createElement(a);
		Array.isArray(e) ? o.classList.add(...e) : e && o.classList.add(e);
		for (const i in t) Object.prototype.hasOwnProperty.call(t, i) && (o[i] = t[i]);
		return o;
	}
	function w(a) {
		const e = a.getBoundingClientRect();
		return {
			y1: Math.floor(e.top + window.pageYOffset),
			x1: Math.floor(e.left + window.pageXOffset),
			x2: Math.floor(e.right + window.pageXOffset),
			y2: Math.floor(e.bottom + window.pageYOffset),
		};
	}
	function g(a, e) {
		const t = w(a),
			o = w(e);
		return {
			fromTopBorder: o.y1 - t.y1,
			fromLeftBorder: o.x1 - t.x1,
			fromRightBorder: t.x2 - o.x2,
			fromBottomBorder: t.y2 - o.y2,
		};
	}
	function R(a, e) {
		const t = a.getBoundingClientRect(),
			{ width: o, height: i, x: r, y: n } = t,
			{ clientX: h, clientY: l } = e;
		return { width: o, height: i, x: h - r, y: l - n };
	}
	function C(a, e) {
		return e.parentNode.insertBefore(a, e);
	}
	function m(a, e = !0) {
		const t = document.createRange(),
			o = window.getSelection();
		t.selectNodeContents(a), t.collapse(e), o.removeAllRanges(), o.addRange(t);
	}
	class c {
		constructor({ items: e }) {
			(this.items = e), (this.wrapper = void 0), (this.itemEls = []);
		}
		static get CSS() {
			return {
				popover: 'tc-popover',
				popoverOpened: 'tc-popover--opened',
				item: 'tc-popover__item',
				itemHidden: 'tc-popover__item--hidden',
				itemConfirmState: 'tc-popover__item--confirm',
				itemIcon: 'tc-popover__item-icon',
				itemLabel: 'tc-popover__item-label',
			};
		}
		render() {
			return (
				(this.wrapper = d('div', c.CSS.popover)),
				this.items.forEach((e, t) => {
					const o = d('div', c.CSS.item),
						i = d('div', c.CSS.itemIcon, { innerHTML: e.icon }),
						r = d('div', c.CSS.itemLabel, { textContent: e.label });
					(o.dataset.index = t), o.appendChild(i), o.appendChild(r), this.wrapper.appendChild(o), this.itemEls.push(o);
				}),
				this.wrapper.addEventListener('click', (e) => {
					this.popoverClicked(e);
				}),
				this.wrapper
			);
		}
		popoverClicked(e) {
			const t = e.target.closest(`.${c.CSS.item}`);
			if (!t) return;
			const o = t.dataset.index,
				i = this.items[o];
			if (i.confirmationRequired && !this.hasConfirmationState(t)) {
				this.setConfirmationState(t);
				return;
			}
			i.onClick();
		}
		setConfirmationState(e) {
			e.classList.add(c.CSS.itemConfirmState);
		}
		clearConfirmationState(e) {
			e.classList.remove(c.CSS.itemConfirmState);
		}
		hasConfirmationState(e) {
			return e.classList.contains(c.CSS.itemConfirmState);
		}
		get opened() {
			return this.wrapper.classList.contains(c.CSS.popoverOpened);
		}
		open() {
			this.items.forEach((e, t) => {
				typeof e.hideIf == 'function' && this.itemEls[t].classList.toggle(c.CSS.itemHidden, e.hideIf());
			}),
				this.wrapper.classList.add(c.CSS.popoverOpened);
		}
		close() {
			this.wrapper.classList.remove(c.CSS.popoverOpened),
				this.itemEls.forEach((e) => {
					this.clearConfirmationState(e);
				});
		}
	}
	const b =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 8L12 12M12 12L16 16M12 12L16 8M12 12L8 16"/></svg>',
		k =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.8833 9.16666L18.2167 12.5M18.2167 12.5L14.8833 15.8333M18.2167 12.5H10.05C9.16594 12.5 8.31809 12.1488 7.69297 11.5237C7.06785 10.8986 6.71666 10.0507 6.71666 9.16666"/></svg>',
		S =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.9167 14.9167L11.5833 18.25M11.5833 18.25L8.25 14.9167M11.5833 18.25L11.5833 10.0833C11.5833 9.19928 11.9345 8.35143 12.5596 7.72631C13.1848 7.10119 14.0326 6.75 14.9167 6.75"/></svg>',
		x =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.13333 14.9167L12.4667 18.25M12.4667 18.25L15.8 14.9167M12.4667 18.25L12.4667 10.0833C12.4667 9.19928 12.1155 8.35143 11.4904 7.72631C10.8652 7.10119 10.0174 6.75 9.13333 6.75"/></svg>',
		y =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.8833 15.8333L18.2167 12.5M18.2167 12.5L14.8833 9.16667M18.2167 12.5L10.05 12.5C9.16595 12.5 8.31811 12.8512 7.69299 13.4763C7.06787 14.1014 6.71667 14.9493 6.71667 15.8333"/></svg>',
		T =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.41 9.66H9.4"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 9.66H14.59"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.31 14.36H9.3"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 14.36H14.59"/></svg>',
		v =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 7V12M12 17V12M17 12H12M12 12H7"/></svg>',
		L =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>',
		M =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M14 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><path stroke="currentColor" stroke-width="2" d="M5 14H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>',
		O =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>';
	class u {
		constructor({ api: e, items: t, onOpen: o, onClose: i, cssModifier: r = '' }) {
			(this.api = e),
				(this.items = t),
				(this.onOpen = o),
				(this.onClose = i),
				(this.cssModifier = r),
				(this.popover = null),
				(this.wrapper = this.createToolbox());
		}
		static get CSS() {
			return {
				toolbox: 'tc-toolbox',
				toolboxShowed: 'tc-toolbox--showed',
				toggler: 'tc-toolbox__toggler',
			};
		}
		get element() {
			return this.wrapper;
		}
		createToolbox() {
			const e = d('div', [u.CSS.toolbox, this.cssModifier ? `${u.CSS.toolbox}--${this.cssModifier}` : '']);
			e.dataset.mutationFree = 'true';
			const t = this.createPopover(),
				o = this.createToggler();
			return e.appendChild(o), e.appendChild(t), e;
		}
		createToggler() {
			const e = d('div', u.CSS.toggler, { innerHTML: T });
			return (
				e.addEventListener('click', () => {
					this.togglerClicked();
				}),
				e
			);
		}
		createPopover() {
			return (this.popover = new c({ items: this.items })), this.popover.render();
		}
		togglerClicked() {
			this.popover.opened ? (this.popover.close(), this.onClose()) : (this.popover.open(), this.onOpen());
		}
		show(e) {
			const t = e();
			Object.entries(t).forEach(([o, i]) => {
				this.wrapper.style[o] = i;
			}),
				this.wrapper.classList.add(u.CSS.toolboxShowed);
		}
		hide() {
			this.popover.close(), this.wrapper.classList.remove(u.CSS.toolboxShowed);
		}
	}
	function H(a, e) {
		let t = 0;
		return function (...o) {
			const i = new Date().getTime();
			if (!(i - t < a)) return (t = i), e(...o);
		};
	}
	const s = {
		wrapper: 'tc-wrap',
		wrapperReadOnly: 'tc-wrap--readonly',
		table: 'tc-table',
		row: 'tc-row',
		withHeadings: 'tc-table--heading',
		rowSelected: 'tc-row--selected',
		cell: 'tc-cell',
		cellSelected: 'tc-cell--selected',
		addRow: 'tc-add-row',
		addColumn: 'tc-add-column',
	};
	class A {
		constructor(e, t, o, i) {
			(this.readOnly = e),
				(this.api = t),
				(this.data = o),
				(this.config = i),
				(this.wrapper = null),
				(this.table = null),
				(this.toolboxColumn = this.createColumnToolbox()),
				(this.toolboxRow = this.createRowToolbox()),
				this.createTableWrapper(),
				(this.hoveredRow = 0),
				(this.hoveredColumn = 0),
				(this.selectedRow = 0),
				(this.selectedColumn = 0),
				(this.tunes = { withHeadings: !1 }),
				this.resize(),
				this.fill(),
				(this.focusedCell = { row: 0, column: 0 }),
				(this.documentClicked = (r) => {
					const n = r.target.closest(`.${s.table}`) !== null,
						h = r.target.closest(`.${s.wrapper}`) === null;
					(n || h) && this.hideToolboxes();
					const p = r.target.closest(`.${s.addRow}`),
						f = r.target.closest(`.${s.addColumn}`);
					p && p.parentNode === this.wrapper
						? (this.addRow(void 0, !0), this.hideToolboxes())
						: f && f.parentNode === this.wrapper && (this.addColumn(void 0, !0), this.hideToolboxes());
				}),
				this.readOnly || this.bindEvents();
		}
		getWrapper() {
			return this.wrapper;
		}
		bindEvents() {
			document.addEventListener('click', this.documentClicked),
				this.table.addEventListener(
					'mousemove',
					H(150, (e) => this.onMouseMoveInTable(e)),
					{ passive: !0 }
				),
				(this.table.onkeypress = (e) => this.onKeyPressListener(e)),
				this.table.addEventListener('keydown', (e) => this.onKeyDownListener(e)),
				this.table.addEventListener('focusin', (e) => this.focusInTableListener(e));
		}
		createColumnToolbox() {
			return new u({
				api: this.api,
				cssModifier: 'column',
				items: [
					{
						label: this.api.i18n.t('Add column to left'),
						icon: S,
						onClick: () => {
							this.addColumn(this.selectedColumn, !0), this.hideToolboxes();
						},
					},
					{
						label: this.api.i18n.t('Add column to right'),
						icon: x,
						onClick: () => {
							this.addColumn(this.selectedColumn + 1, !0), this.hideToolboxes();
						},
					},
					{
						label: this.api.i18n.t('Delete column'),
						icon: b,
						hideIf: () => this.numberOfColumns === 1,
						confirmationRequired: !0,
						onClick: () => {
							this.deleteColumn(this.selectedColumn), this.hideToolboxes();
						},
					},
				],
				onOpen: () => {
					this.selectColumn(this.hoveredColumn), this.hideRowToolbox();
				},
				onClose: () => {
					this.unselectColumn();
				},
			});
		}
		createRowToolbox() {
			return new u({
				api: this.api,
				cssModifier: 'row',
				items: [
					{
						label: this.api.i18n.t('Add row above'),
						icon: y,
						onClick: () => {
							this.addRow(this.selectedRow, !0), this.hideToolboxes();
						},
					},
					{
						label: this.api.i18n.t('Add row below'),
						icon: k,
						onClick: () => {
							this.addRow(this.selectedRow + 1, !0), this.hideToolboxes();
						},
					},
					{
						label: this.api.i18n.t('Delete row'),
						icon: b,
						hideIf: () => this.numberOfRows === 1,
						confirmationRequired: !0,
						onClick: () => {
							this.deleteRow(this.selectedRow), this.hideToolboxes();
						},
					},
				],
				onOpen: () => {
					this.selectRow(this.hoveredRow), this.hideColumnToolbox();
				},
				onClose: () => {
					this.unselectRow();
				},
			});
		}
		moveCursorToNextRow() {
			this.focusedCell.row !== this.numberOfRows
				? ((this.focusedCell.row += 1), this.focusCell(this.focusedCell))
				: (this.addRow(),
				  (this.focusedCell.row += 1),
				  this.focusCell(this.focusedCell),
				  this.updateToolboxesPosition(0, 0));
		}
		getCell(e, t) {
			return this.table.querySelectorAll(`.${s.row}:nth-child(${e}) .${s.cell}`)[t - 1];
		}
		getRow(e) {
			return this.table.querySelector(`.${s.row}:nth-child(${e})`);
		}
		getRowByCell(e) {
			return e.parentElement;
		}
		getRowFirstCell(e) {
			return e.querySelector(`.${s.cell}:first-child`);
		}
		setCellContent(e, t, o) {
			const i = this.getCell(e, t);
			i.innerHTML = o;
		}
		addColumn(e = -1, t = !1) {
			let o = this.numberOfColumns;
			for (let i = 1; i <= this.numberOfRows; i++) {
				let r;
				const n = this.createCell();
				if ((e > 0 && e <= o ? ((r = this.getCell(i, e)), C(n, r)) : (r = this.getRow(i).appendChild(n)), i === 1)) {
					const h = this.getCell(i, e > 0 ? e : o + 1);
					h && t && m(h);
				}
			}
			this.addHeadingAttrToFirstRow();
		}
		addRow(e = -1, t = !1) {
			let o,
				i = d('div', s.row);
			this.tunes.withHeadings && this.removeHeadingAttrFromFirstRow();
			let r = this.numberOfColumns;
			if (e > 0 && e <= this.numberOfRows) {
				let h = this.getRow(e);
				o = C(i, h);
			} else o = this.table.appendChild(i);
			this.fillRow(o, r), this.tunes.withHeadings && this.addHeadingAttrToFirstRow();
			const n = this.getRowFirstCell(o);
			return n && t && m(n), o;
		}
		deleteColumn(e) {
			for (let t = 1; t <= this.numberOfRows; t++) {
				const o = this.getCell(t, e);
				if (!o) return;
				o.remove();
			}
		}
		deleteRow(e) {
			this.getRow(e).remove(), this.addHeadingAttrToFirstRow();
		}
		createTableWrapper() {
			if (
				((this.wrapper = d('div', s.wrapper)),
				(this.table = d('div', s.table)),
				this.readOnly && this.wrapper.classList.add(s.wrapperReadOnly),
				this.wrapper.appendChild(this.toolboxRow.element),
				this.wrapper.appendChild(this.toolboxColumn.element),
				this.wrapper.appendChild(this.table),
				!this.readOnly)
			) {
				const e = d('div', s.addColumn, { innerHTML: v }),
					t = d('div', s.addRow, { innerHTML: v });
				this.wrapper.appendChild(e), this.wrapper.appendChild(t);
			}
		}
		computeInitialSize() {
			const e = this.data && this.data.content,
				t = Array.isArray(e),
				o = t ? e.length : !1,
				i = t ? e.length : void 0,
				r = o ? e[0].length : void 0,
				n = Number.parseInt(this.config && this.config.rows),
				h = Number.parseInt(this.config && this.config.cols),
				l = !isNaN(n) && n > 0 ? n : void 0,
				p = !isNaN(h) && h > 0 ? h : void 0;
			return { rows: i || l || 2, cols: r || p || 2 };
		}
		resize() {
			const { rows: e, cols: t } = this.computeInitialSize();
			for (let o = 0; o < e; o++) this.addRow();
			for (let o = 0; o < t; o++) this.addColumn();
		}
		fill() {
			const e = this.data;
			if (e && e.content)
				for (let t = 0; t < e.content.length; t++)
					for (let o = 0; o < e.content[t].length; o++) this.setCellContent(t + 1, o + 1, e.content[t][o]);
		}
		fillRow(e, t) {
			for (let o = 1; o <= t; o++) {
				const i = this.createCell();
				e.appendChild(i);
			}
		}
		createCell() {
			return d('div', s.cell, { contentEditable: !this.readOnly });
		}
		get numberOfRows() {
			return this.table.childElementCount;
		}
		get numberOfColumns() {
			return this.numberOfRows ? this.table.querySelectorAll(`.${s.row}:first-child .${s.cell}`).length : 0;
		}
		get isColumnMenuShowing() {
			return this.selectedColumn !== 0;
		}
		get isRowMenuShowing() {
			return this.selectedRow !== 0;
		}
		onMouseMoveInTable(e) {
			const { row: t, column: o } = this.getHoveredCell(e);
			(this.hoveredColumn = o), (this.hoveredRow = t), this.updateToolboxesPosition();
		}
		onKeyPressListener(e) {
			if (e.key === 'Enter') {
				if (e.shiftKey) return !0;
				this.moveCursorToNextRow();
			}
			return e.key !== 'Enter';
		}
		onKeyDownListener(e) {
			e.key === 'Tab' && e.stopPropagation();
		}
		focusInTableListener(e) {
			const t = e.target,
				o = this.getRowByCell(t);
			this.focusedCell = {
				row: Array.from(this.table.querySelectorAll(`.${s.row}`)).indexOf(o) + 1,
				column: Array.from(o.querySelectorAll(`.${s.cell}`)).indexOf(t) + 1,
			};
		}
		hideToolboxes() {
			this.hideRowToolbox(), this.hideColumnToolbox(), this.updateToolboxesPosition();
		}
		hideRowToolbox() {
			this.unselectRow(), this.toolboxRow.hide();
		}
		hideColumnToolbox() {
			this.unselectColumn(), this.toolboxColumn.hide();
		}
		focusCell() {
			this.focusedCellElem.focus();
		}
		get focusedCellElem() {
			const { row: e, column: t } = this.focusedCell;
			return this.getCell(e, t);
		}
		updateToolboxesPosition(e = this.hoveredRow, t = this.hoveredColumn) {
			this.isColumnMenuShowing ||
				(t > 0 &&
					t <= this.numberOfColumns &&
					this.toolboxColumn.show(() => ({
						left: `calc((100% - var(--cell-size)) / (${this.numberOfColumns} * 2) * (1 + (${t} - 1) * 2))`,
					}))),
				this.isRowMenuShowing ||
					(e > 0 &&
						e <= this.numberOfRows &&
						this.toolboxRow.show(() => {
							const o = this.getRow(e),
								{ fromTopBorder: i } = g(this.table, o),
								{ height: r } = o.getBoundingClientRect();
							return { top: `${Math.ceil(i + r / 2)}px` };
						}));
		}
		setHeadingsSetting(e) {
			(this.tunes.withHeadings = e),
				e
					? (this.table.classList.add(s.withHeadings), this.addHeadingAttrToFirstRow())
					: (this.table.classList.remove(s.withHeadings), this.removeHeadingAttrFromFirstRow());
		}
		addHeadingAttrToFirstRow() {
			for (let e = 1; e <= this.numberOfColumns; e++) {
				let t = this.getCell(1, e);
				t && t.setAttribute('heading', this.api.i18n.t('Heading'));
			}
		}
		removeHeadingAttrFromFirstRow() {
			for (let e = 1; e <= this.numberOfColumns; e++) {
				let t = this.getCell(1, e);
				t && t.removeAttribute('heading');
			}
		}
		selectRow(e) {
			const t = this.getRow(e);
			t && ((this.selectedRow = e), t.classList.add(s.rowSelected));
		}
		unselectRow() {
			if (this.selectedRow <= 0) return;
			const e = this.table.querySelector(`.${s.rowSelected}`);
			e && e.classList.remove(s.rowSelected), (this.selectedRow = 0);
		}
		selectColumn(e) {
			for (let t = 1; t <= this.numberOfRows; t++) {
				const o = this.getCell(t, e);
				o && o.classList.add(s.cellSelected);
			}
			this.selectedColumn = e;
		}
		unselectColumn() {
			if (this.selectedColumn <= 0) return;
			let e = this.table.querySelectorAll(`.${s.cellSelected}`);
			Array.from(e).forEach((t) => {
				t.classList.remove(s.cellSelected);
			}),
				(this.selectedColumn = 0);
		}
		getHoveredCell(e) {
			let t = this.hoveredRow,
				o = this.hoveredColumn;
			const { width: i, height: r, x: n, y: h } = R(this.table, e);
			return (
				n >= 0 &&
					(o = this.binSearch(
						this.numberOfColumns,
						(l) => this.getCell(1, l),
						({ fromLeftBorder: l }) => n < l,
						({ fromRightBorder: l }) => n > i - l
					)),
				h >= 0 &&
					(t = this.binSearch(
						this.numberOfRows,
						(l) => this.getCell(l, 1),
						({ fromTopBorder: l }) => h < l,
						({ fromBottomBorder: l }) => h > r - l
					)),
				{ row: t || this.hoveredRow, column: o || this.hoveredColumn }
			);
		}
		binSearch(e, t, o, i) {
			let r = 0,
				n = e + 1,
				h = 0,
				l;
			for (; r < n - 1 && h < 10; ) {
				l = Math.ceil((r + n) / 2);
				const p = t(l),
					f = g(this.table, p);
				if (o(f)) n = l;
				else if (i(f)) r = l;
				else break;
				h++;
			}
			return l;
		}
		getData() {
			const e = [];
			for (let t = 1; t <= this.numberOfRows; t++) {
				const o = this.table.querySelector(`.${s.row}:nth-child(${t})`),
					i = Array.from(o.querySelectorAll(`.${s.cell}`));
				i.every((n) => !n.textContent.trim()) || e.push(i.map((n) => n.innerHTML));
			}
			return e;
		}
		destroy() {
			document.removeEventListener('click', this.documentClicked);
		}
	}
	class E {
		static get isReadOnlySupported() {
			return !0;
		}
		static get enableLineBreaks() {
			return !0;
		}
		constructor({ data: e, config: t, api: o, readOnly: i }) {
			(this.api = o),
				(this.readOnly = i),
				(this.config = t),
				(this.data = {
					withHeadings: this.getConfig('withHeadings', !1, e),
					content: e && e.content ? e.content : [],
				}),
				(this.table = null);
		}
		static get toolbox() {
			return { icon: O, title: 'Table' };
		}
		render() {
			return (
				(this.table = new A(this.readOnly, this.api, this.data, this.config)),
				(this.container = d('div', this.api.styles.block)),
				this.container.appendChild(this.table.getWrapper()),
				this.table.setHeadingsSetting(this.data.withHeadings),
				this.container
			);
		}
		renderSettings() {
			return [
				{
					label: this.api.i18n.t('With headings'),
					icon: L,
					isActive: this.data.withHeadings,
					closeOnActivate: !0,
					toggle: !0,
					onActivate: () => {
						(this.data.withHeadings = !0), this.table.setHeadingsSetting(this.data.withHeadings);
					},
				},
				{
					label: this.api.i18n.t('Without headings'),
					icon: M,
					isActive: !this.data.withHeadings,
					closeOnActivate: !0,
					toggle: !0,
					onActivate: () => {
						(this.data.withHeadings = !1), this.table.setHeadingsSetting(this.data.withHeadings);
					},
				},
			];
		}
		save() {
			const e = this.table.getData();
			return { withHeadings: this.data.withHeadings, content: e };
		}
		destroy() {
			this.table.destroy();
		}
		getConfig(e, t = void 0, o = void 0) {
			const i = this.data || o;
			return i ? (i[e] ? i[e] : t) : this.config && this.config[e] ? this.config[e] : t;
		}
		static get pasteConfig() {
			return { tags: ['TABLE', 'TR', 'TH', 'TD'] };
		}
		onPaste(e) {
			const t = e.detail.data,
				o = t.querySelector(':scope > thead, tr:first-of-type th'),
				r = Array.from(t.querySelectorAll('tr')).map((n) =>
					Array.from(n.querySelectorAll('th, td')).map((l) => l.innerHTML)
				);
			(this.data = { withHeadings: o !== null, content: r }),
				this.table.wrapper && this.table.wrapper.replaceWith(this.render());
		}
	}
	const B = '';
	return E;
})();
