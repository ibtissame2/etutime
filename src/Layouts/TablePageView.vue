<script setup>
import { computed, ref, onMounted } from 'vue';
import { PlusIcon } from '@heroicons/vue/16/solid';
import { FolderPlusIcon } from '@heroicons/vue/24/solid';
import { TrashIcon, PencilSquareIcon } from '@heroicons/vue/20/solid';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageTitle from '@/Components/Common/PageTitle.vue';
import MainContainer from '@/Components/src/MainContainer.vue';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
import TableHeading from '@/Components/Common/TableHeading.vue';
import MoreOptionsDropdown from '@/Components/src/MoreOptionsDropdown.vue';

const emit = defineEmits(['fetch', 'rowClick']);

const props = defineProps({
	title: String,
	icon: [Object, Function],
	create: { type: String, required: false },
	data: Array,
	modal: [Object, Function],
	gridSize: String,
	columns: Array,
	dropdown: Array,
	dropdownMinWidth: { type: Number, required: false },
	noData: Object,
});

const modalRef = ref(null);

const sliceList = computed(() => props.columns.slice(1));

const gridColumnsSize = computed(() => {
	if (props.gridSize) return props.gridSize + ' 80px';
	const all = props.columns.map((c) => c?.size || '').join(' ');
	return (all.trim() || '1fr') + ' 80px';
});

function showForm(element) {
	modalRef.value?.setDataOf(element);
}

function onRowClick(element) {
	emit('rowClick', element, showForm);
}

function getId(column) {
	return column.id || column.label || column;
}

onMounted(async () => {
	emit('fetch');
});
</script>

<template>
	<AppLayout :title="title">
		<MainContainer class="py-3 sm:py-5 border-b border-default-background-separator flex justify-between items-center">
			<div class="flex items-center space-x-3 sm:space-x-6">
				<PageTitle :icon="icon" :title="title"></PageTitle>
				<slot name="table-filters"></slot>
			</div>

			<SecondaryButton v-if="create" :icon="PlusIcon" @click="showForm()">{{ create }}</SecondaryButton>
			<component ref="modalRef" :is="modal" />
		</MainContainer>

		<div class="flow-root">
			<div class="inline-block min-w-full align-middle">
				<div data-testid="tag_table" class="grid min-w-full" :style="{ 'grid-template-columns': gridColumnsSize }">
					<TableHeading>
						<div
							class="py-1.5 pl-4 pr-3 sm:pl-6 lg:pl-8 3xl:pl-12 whitespace-nowrap text-left font-semibold text-text-primary"
						>
							{{ columns[0].label || columns[0] }}
						</div>
						<div
							v-for="column in sliceList"
							:key="getId(column)"
							class="py-1.5 pl-3 pr-3 whitespace-nowrap text-left font-semibold text-text-primary"
						>
							{{ column.label || column }}
						</div>
						<div class="py-1.5 pl-3 pr-4 sm:pr-6 lg:pr-8 3xl:pr-12 relative">
							<span class="sr-only">Edit</span>
						</div>
					</TableHeading>

					<div v-if="data.length === 0" class="col-span-5 py-24 text-center">
						<FolderPlusIcon class="w-8 text-icon-default inline pb-2"></FolderPlusIcon>
						<h3 class="text-text-primary font-semibold">{{ noData.title }}</h3>
						<p class="pb-5 max-w-md mx-auto text-sm pt-1">{{ noData.description }}</p>
						<SecondaryButton :icon="PlusIcon" @click="showForm()">{{ noData.button }} </SecondaryButton>
					</div>

					<template v-for="element in data" :key="element.id">
						<div
							@click="onRowClick(element)"
							role="row"
							class="contents group [&>*]:transition [&>*]:border-row-separator [&>*]:bg-row-background [&>*]:border-b"
						>
							<div
								class="py-1.5 pl-4 pr-3 sm:pl-6 lg:pl-8 3xl:pl-12 whitespace-nowrap flex items-center text-text-primary min-w-0"
							>
								<slot :name="getId(columns[0])" :data="element" :show-form="showForm"></slot>
							</div>
							<div
								v-for="column in sliceList"
								:key="getId(column)"
								class="py-1.5 pl-3 pr-3 whitespace-nowrap flex items-center text-sm text-muted"
							>
								<slot :name="getId(column)" :data="element" :show-form="showForm"></slot>
							</div>

							<div
								class="py-1.5 pl-3 pr-4 sm:pr-6 lg:pr-8 3xl:pr-12 whitespace-nowrap flex items-center text-right relative"
							>
								<MoreOptionsDropdown @click.prevent="(e) => e.stopPropagation()">
									<div :class="dropdownMinWidth ? `min-w-[${dropdownMinWidth}px]` : ''">
										<button
											v-for="(opt, index) in dropdown"
											:key="'dropdown-' + index"
											:class="
												(opt.border ? 'border-b border-card-background-separator ' : '') +
												'flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out'
											"
											@click.prevent="opt.onclick?.(element, showForm)"
										>
											<component
												:is="opt.icon === 'edit' ? PencilSquareIcon : opt.icon === 'delete' ? TrashIcon : opt.icon"
												class="w-5 text-icon-active"
											/>
											<span>{{ typeof opt.label === 'function' ? opt.label(element) : opt.label }}</span>
										</button>
									</div>
								</MoreOptionsDropdown>
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
	</AppLayout>
</template>
