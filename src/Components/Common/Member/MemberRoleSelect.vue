<script>
import SelectDropdown from '@/packages/ui/src/Input/SelectDropdown.vue';
import Badge from '@/packages/ui/src/Badge.vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { usePage } from '@inertiajs/vue3';
import { ref } from 'vue';

export default {
	components: {
		SelectDropdown,
		Badge,
		ChevronDownIcon,
	},
	setup() {
		const model = ref('employee');
		const page = usePage();

		function getKeyFromItem(item) {
			return item.key;
		}

		function getNameFromItem(item) {
			return item.name;
		}

		function getNameForKey(key) {
			const item = page.props.availableRoles.find((item) => getKeyFromItem(item) === key);
			if (item) {
				return getNameFromItem(item);
			}
			return '';
		}

		return {
			model,
			page,
			getKeyFromItem,
			getNameFromItem,
			getNameForKey,
		};
	},
};
</script>

<template>
	<SelectDropdown
		v-model="model"
		:get-key-from-item="getKeyFromItem"
		:get-name-for-item="getNameFromItem"
		:items="page.props.availableRoles"
	>
		<template #trigger>
			<Badge size="xlarge" class="bg-input-background cursor-pointer">
				<span>
					{{ getNameForKey(model) }}
				</span>
				<ChevronDownIcon class="text-muted w-5"></ChevronDownIcon>
			</Badge>
		</template>
	</SelectDropdown>
</template>

<style scoped></style>
