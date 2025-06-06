<template>
	<div class="chatbot-container">
		<div class="chat-header">
			<h2>Assistant Gemini</h2>
			<div class="header-actions">
				<button @click="toggleTheme" class="theme-toggle" aria-label="Changer de thème">
					{{ darkMode ? '☀️' : '🌙' }}
				</button>
			</div>
		</div>

		<div class="chat-messages" ref="messagesContainer">
			<transition-group name="message-fade" tag="div">
				<div
					v-for="(message, index) in messages"
					:key="index"
					:class="['message', message.role, { 'message-loading': isLoading && index === messages.length - 1 }]"
				>
					<div class="message-avatar">
						<span v-if="message.role === 'user'">👤</span>
						<span v-else>🤖</span>
					</div>
					<div class="message-content">
						<div class="message-sender">
							{{ message.role === 'user' ? 'Vous' : 'Assistant' }}
						</div>
						<div class="message-text">
							{{ message.content }}
							<div v-if="isLoading && index === messages.length - 1" class="typing-indicator">
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>
						<div class="message-time">{{ formatTime() }}</div>
					</div>
				</div>
			</transition-group>
		</div>

		<div class="chat-input">
			<input
				v-model="userInput"
				@keyup.enter="sendMessage"
				placeholder="Tapez votre message..."
				:disabled="isLoading"
				aria-label="Message à envoyer"
			/>
			<button @click="sendMessage" :disabled="isLoading || !userInput.trim()" aria-label="Envoyer le message">
				<span v-if="!isLoading">Envoyer</span>
				<span v-else class="sending-indicator">...</span>
			</button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			messages: [
				{ role: 'model', content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", timestamp: new Date() },
			],
			userInput: '',
			isLoading: false,
			apiKey: 'AIzaSyDHtZvhomzcDyPDlWWizn1kyI0OBSAORWM', // Remplacez par votre clé API
			apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
			darkMode: false,
		};
	},
	mounted() {
		this.checkSystemTheme();
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.checkSystemTheme);
		this.scrollToBottom();
	},
	beforeDestroy() {
		window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.checkSystemTheme);
	},
	methods: {
		checkSystemTheme() {
			this.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		},
		toggleTheme() {
			this.darkMode = !this.darkMode;
		},
		formatTime() {
			return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		},
		async sendMessage() {
			if (!this.userInput.trim() || this.isLoading) return;

			const userMessage = {
				role: 'user',
				content: this.userInput,
				timestamp: new Date(),
			};
			this.messages.push(userMessage);
			this.userInput = '';
			this.isLoading = true;

			try {
				const maxRetries = 3;
				let retryCount = 0;
				let lastError = null;

				while (retryCount < maxRetries) {
					try {
						const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								contents: [
									{
										parts: [{ text: userMessage.content }],
									},
								],
							}),
						});

						if (!response.ok) {
							const errorData = await response.json();
							throw new Error(errorData.error?.message || `Erreur HTTP: ${response.status}`);
						}

						const data = await response.json();

						if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
							throw new Error('Réponse API mal formée');
						}

						const aiResponse = {
							role: 'model',
							content: data.candidates[0].content.parts[0].text,
							timestamp: new Date(),
						};
						this.messages.push(aiResponse);
						return; // Sortie en cas de succès
					} catch (error) {
						lastError = error;
						retryCount++;

						// Attente exponentielle avant de réessayer
						const delay = Math.pow(2, retryCount) * 1000;
						await new Promise((resolve) => setTimeout(resolve, delay));
					}
				}

				throw lastError; // Si toutes les tentatives échouent
			} catch (error) {
				console.error('Erreur API:', error);
				let errorMessage = 'Désolé, une erreur est survenue.';

				if (error.message.includes('overloaded')) {
					errorMessage = "L'assistant est temporairement surchargé. Veuillez réessayer dans quelques instants.";
				} else if (error.message.includes('503')) {
					errorMessage = 'Service temporairement indisponible. Veuillez réessayer plus tard.';
				}

				this.messages.push({
					role: 'model',
					content: errorMessage,
					timestamp: new Date(),
				});
			} finally {
				this.isLoading = false;
			}
		},
		scrollToBottom() {
			this.$nextTick(() => {
				const container = this.$refs.messagesContainer;
				if (container) {
					container.scrollTop = container.scrollHeight;
				}
			});
		},
	},
	watch: {
		messages: {
			handler() {
				this.scrollToBottom();
			},
			deep: true,
		},
		darkMode(newVal) {
			document.documentElement.setAttribute('data-theme', newVal ? 'dark' : 'light');
			localStorage.setItem('darkMode', newVal);
		},
	},
};
</script>

<style>
:root {
	--bg-color: #ffffff;
	--text-color: #333333;
	--primary-color: #209ff9;
	--primary-dark: #3367d6;
	--secondary-color: #f1f3f4;
	--message-user-bg: #e3f2fd;
	--message-model-bg: #f1f3f4;
	--input-bg: #ffffff;
	--input-border: #dfe1e5;
	--shadow-color: rgba(0, 0, 0, 0.1);
	--border-radius: 12px;
	--transition-speed: 0.3s;
}

[data-theme='dark'] {
	--bg-color: #202124;
	--text-color: #e8eaed;
	--primary-color: #8ab4f8;
	--primary-dark: #669df6;
	--secondary-color: #303134;
	--message-user-bg: #2d3e50;
	--message-model-bg: #303134;
	--input-bg: #303134;
	--input-border: #5f6368;
	--shadow-color: rgba(0, 0, 0, 0.3);
}

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

.chatbot-container {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	background-color: var(--bg-color);
	color: var(--text-color);
	border-radius: var(--border-radius);
	overflow: hidden;
	transition: background-color var(--transition-speed) ease;
}

.chat-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 20px;
	background-color: var(--primary-color);
	color: white;
	box-shadow: 0 2px 4px var(--shadow-color);
}

.chat-header h2 {
	font-size: 1.2rem;
	font-weight: 600;
}

.header-actions {
	display: flex;
	gap: 10px;
}

.theme-toggle {
	background: rgba(255, 255, 255, 0.2);
	border: none;
	color: white;
	font-size: 1.2rem;
	cursor: pointer;
	padding: 5px;
	border-radius: 50%;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background var(--transition-speed) ease;
}

.theme-toggle:hover {
	background: rgba(255, 255, 255, 0.3);
}

.chat-messages {
	flex: 1;
	padding: 16px;
	overflow-y: auto;
	scroll-behavior: smooth;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.message {
	display: flex;
	gap: 12px;
	animation: message-fade 0.3s ease;
	max-width: 85%;
}

.message-avatar {
	font-size: 1.5rem;
	margin-top: 4px;
	flex-shrink: 0;
}

.message-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.message-sender {
	font-weight: 600;
	font-size: 0.85rem;
	color: var(--primary-color);
}

.message-text {
	padding: 10px 14px;
	border-radius: var(--border-radius);
	line-height: 1.5;
	position: relative;
	word-wrap: break-word;
	white-space: pre-wrap;
}

.message-time {
	font-size: 0.75rem;
	color: var(--text-color);
	opacity: 0.7;
	margin-top: 2px;
}

.message.user {
	align-self: flex-end;
}

.message.user .message-content {
	align-items: flex-end;
}

.message.user .message-text {
	background-color: var(--message-user-bg);
	border-bottom-right-radius: 0;
}

.message.model {
	align-self: flex-start;
}

.message.model .message-text {
	background-color: var(--message-model-bg);
	border-bottom-left-radius: 0;
}

.chat-input {
	display: flex;
	padding: 12px;
	background-color: var(--secondary-color);
	border-top: 1px solid var(--input-border);
}

.chat-input input {
	flex: 1;
	padding: 12px 16px;
	border: 1px solid var(--input-border);
	border-radius: 24px;
	background-color: var(--input-bg);
	color: var(--text-color);
	outline: none;
	transition: all var(--transition-speed) ease;
	font-size: 1rem;
}

.chat-input input:focus {
	border-color: var(--primary-color);
	box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
}

.chat-input button {
	margin-left: 12px;
	padding: 0 20px;
	background-color: var(--primary-color);
	color: white;
	border: none;
	border-radius: 24px;
	cursor: pointer;
	transition: all var(--transition-speed) ease;
	font-weight: 500;
	height: 44px;
	min-width: 80px;
}

.chat-input button:hover:not(:disabled) {
	background-color: var(--primary-dark);
}

.chat-input button:disabled {
	background-color: #cccccc;
	cursor: not-allowed;
	opacity: 0.7;
}

.typing-indicator {
	display: inline-flex;
	gap: 4px;
	margin-top: 8px;
	margin-left: 8px;
}

.typing-indicator span {
	width: 8px;
	height: 8px;
	background-color: var(--text-color);
	border-radius: 50%;
	display: inline-block;
	opacity: 0.6;
	animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
	animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
	animation-delay: 0.4s;
}

.sending-indicator {
	display: inline-block;
	width: 20px;
	text-align: center;
	animation: pulse 1.5s infinite;
}

.message-loading .message-text {
	min-height: 20px;
}

@keyframes typing-bounce {
	0%,
	60%,
	100% {
		transform: translateY(0);
		opacity: 0.6;
	}
	30% {
		transform: translateY(-5px);
		opacity: 1;
	}
}

@keyframes message-fade {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}

@media (max-width: 600px) {
	.chatbot-container {
		height: 90vh;
		margin: 0;
		border-radius: 0;
	}

	.message {
		max-width: 90%;
	}

	.chat-input {
		padding: 10px;
	}

	.chat-input input {
		padding: 10px 14px;
	}

	.chat-input button {
		padding: 0 16px;
		min-width: 70px;
	}
}
</style>
