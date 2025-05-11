import editor from '@/editor/editor.mjs';
import Heading from '@/editor/editor-heading.js';
import List from '@/editor/editor-list.js';
import Checklist from '@/editor/editor-checklist.js';
import Table from '@/editor/editor-table.js';
import Delimiter from '@/editor/editor-delimiter.js';

class heading extends Heading {
	static get toolbox() {
		return {
			title: 'Titre',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 7L9 12M9 17V12M9 12L15 12M15 7V12M15 17L15 12"/></svg>',
		};
	}
	renderSettings() {
		return this.levels.map((e) => ({
			icon: e.svg,
			label: `Titre ${e.number}`,
			onActivate: () => this.setLevel(e.number),
			closeOnActivate: !0,
			isActive: this.currentLevel.number === e.number,
			render: () => document.createElement('div'),
		}));
	}
}

class list extends List {
	static get toolbox() {
		return {
			title: 'Liste',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="9" x2="19" y1="7" y2="7" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="9" x2="19" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="9" x2="19" y1="17" y2="17" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 17H4.99002"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 12H4.99002"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 7H4.99002"/></svg>',
		};
	}
	renderSettings() {
		return this.settings.map((e) => ({
			...e,
			label: e.name === 'ordered' ? 'Ordonnée' : 'Non ordonnée',
			isActive: this._data.style === e.name,
			closeOnActivate: !0,
			onActivate: () => this.toggleTune(e.name),
		}));
	}
}

class checklist extends Checklist {
	static get toolbox() {
		return {
			title: 'Liste à cocher',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="9" x2="19" y1="7" y2="7" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="9" x2="19" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="9" x2="19" y1="17" y2="17" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 17H4.99002"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 12H4.99002"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 7H4.99002"/></svg>',
		};
	}
}

class table extends Table {
	static get toolbox() {
		return {
			title: 'Tableau',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>',
		};
	}
	renderSettings() {
		return [
			{
				label: 'Avec titres',
				icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>',
				isActive: this.data.withHeadings,
				closeOnActivate: !0,
				toggle: !0,
				onActivate: () => {
					(this.data.withHeadings = !0), this.table.setHeadingsSetting(this.data.withHeadings);
				},
			},
			{
				label: 'Sans titres',
				icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M14 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><path stroke="currentColor" stroke-width="2" d="M5 14H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>',
				isActive: !this.data.withHeadings,
				closeOnActivate: !0,
				toggle: !0,
				onActivate: () => {
					(this.data.withHeadings = !1), this.table.setHeadingsSetting(this.data.withHeadings);
				},
			},
		];
	}
}

class delimiter extends Delimiter {
	static get toolbox() {
		return {
			title: 'Séparateur',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="6" x2="18" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>',
		};
	}
	drawView() {
		let t = document.createElement('DIV');
		t.classList.add(`ce-${this.data.style}`, this._CSS.block);
		return t;
	}
	renderSettings() {
		return [
			{ style: 'divider', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="6" x2="18" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>' }, // prettier-ignore
			{ style: 'delimiter', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="6" x2="10" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="14" x2="18" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="7" x2="9" y1="10" y2="14" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="9" x2="7" y1="10" y2="14" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="15" x2="17" y1="10" y2="14" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="17" x2="15" y1="10" y2="14" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>' }, // prettier-ignore
		].map((e) => ({
			icon: e.svg,
			label: e.style === 'divider' ? 'Séparateur' : 'Délimiteur',
			onActivate: () => (this.data = e),
			closeOnActivate: !0,
			isActive: this.data.style === e.style,
			render: () => document.createElement('div'),
		}));
	}
	save() {
		return this.data;
	}
	get data() {
		return (this._data.style = this._data.style || 'divider'), this._data;
	}
	set data(e) {
		const oldStyle = this._data.style;
		this._data = { style: e?.style === 'delimiter' ? 'delimiter' : 'divider' };
		if (oldStyle !== this._data.style) {
			const t = this.drawView();
			this._element.parentNode?.replaceChild(t, this._element);
			this._element = t;
		}
	}
}

const create = async ({ holder, data, placeholder, disabled, i18n, onChange }) => {
	console.log('Ibtissame', 1);
	const instance = new editor({
		holder,
		i18n,
		inlineToolbar: true,
		data: { blocks: [], ...data },
		placeholder: placeholder || '',
		readOnly: disabled || false,
		minHeight: 70,
		tools: {
			heading: {
				class: heading,
				shortcut: 'ALT+H',
				config: { levels: [1, 2, 3, 4], defaultLevel: 2 },
			},
			list: { class: list, shortcut: 'ALT+L' },
			checklist: { class: checklist, shortcut: 'ALT+C' },
			table: {
				class: table,
				shortcut: 'ALT+T',
				config: { rows: 2, cols: 3, withHeadings: true },
			},
			delimiter: { class: delimiter, shortcut: 'ALT+D' },
		},
		onChange: async () => {
			try {
				if (disabled) return;
				onChange(await instance.save());
			} catch {}
		},
	});
	console.log('Ibtissame', 2);
	await instance.isReady;
	console.log('Ibtissame', 3);
	return instance;
};

const EditorJS = { create };

export default EditorJS;
