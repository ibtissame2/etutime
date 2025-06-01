<script setup>
import { useRouter } from 'vue-router';
import { route } from '@/utils/inertia';
import Dropdown from '@/Components/src/Input/Dropdown.vue';

const router = useRouter();

const logout = () => {
	sessionStorage.removeItem('user');
	sessionStorage.removeItem('token');
	localStorage.removeItem('user');
	localStorage.removeItem('token');
	router.push('/');
};
</script>

<template>
	<div class="ms-3 relative">
		<Dropdown :align="'top'" width="48">
			<template #trigger>
				<button
					data-testid="current_user_button"
					class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition"
				>
					<img
						class="h-8 w-8 rounded-full object-cover"
						src="https://cdn-icons-png.flaticon.com/512/3710/3710582.png"
						alt=" "
					/>
				</button>
			</template>

			<template #content>
				<div class="block px-4 py-2 text-xs text-gray-400">Manage Account</div>

				<router-link
					:to="route('profile')"
					class="block px-4 py-2 text-sm leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				>
					Profile
				</router-link>

				<div class="border-t border-card-border"></div>

				<button
					@click="logout"
					class="block w-full px-4 py-2 text-start text-sm leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				>
					Se Déconnecter
				</button>
			</template>
		</Dropdown>
	</div>
</template>
