<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import MemberTableHeading from '@/Components/Common/Member/MemberTableHeading.vue';
import MemberTableRow from '@/Components/Common/Member/MemberTableRow.vue';
import { useMembersStore } from '@/utils/useMembers';

const { members } = storeToRefs(useMembersStore());

onMounted(async () => {
	await useMembersStore().fetchMembers();
});
</script>

<template>
	<div class="flow-root max-w-[100vw] overflow-x-auto">
		<div class="inline-block min-w-full align-middle">
			<div class="grid min-w-full" style="grid-template-columns: 1fr 1fr 180px 180px 150px 130px">
				<MemberTableHeading />
				<template v-for="member in members" :key="member.id">
					<MemberTableRow :member="member" />
				</template>
			</div>
		</div>
	</div>
</template>
