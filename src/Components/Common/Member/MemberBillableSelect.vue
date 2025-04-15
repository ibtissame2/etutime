<script>
import SelectDropdown from '@/packages/ui/src/Input/SelectDropdown.vue';
import Badge from '@/packages/ui/src/Badge.vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { ref } from 'vue';

export default {
	components: {
		SelectDropdown,
		Badge,
		ChevronDownIcon,
	},
	setup() {
		const model = ref('default-rate');

		const options = [
			{
				key: 'default-rate',
				name: 'Organization Default Rate',
			},
			{
				key: 'custom-rate',
				name: 'Custom Rate',
			},
		];

		function getKeyFromItem(item) {
			return item.key;
		}

		function getNameFromItem(item) {
			return item.name;
		}

		function getNameForKey(key) {
			const item = options.find((item) => getKeyFromItem(item) === key);
			if (item) {
				return getNameFromItem(item);
			}
			return '';
		}

		return {
			model,
			options,
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
		:items="options"
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
