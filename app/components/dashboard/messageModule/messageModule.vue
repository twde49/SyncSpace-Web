<template>
    <div id="messageMenuClosed"
        class="h-max w-max bgColorLight topComponentSize flex justify-center items-center fixed left-[30px] top-[31px] transition-all"
        v-if="closed" ref="closedButton">
        <Icon name="ph:chat-text-fill" size="3.5em" class="messageIcon cursor-pointer" @click="openClose" />
    </div>
    <div v-else class="drawer-container" ref="drawerContainer" @click.self="openClose">
        <div class="drawer shadow z-20 bgColorLight flex justify-start items-start" ref="drawer">
            <div class="relative h-full flex flex-col w-1/5 drawer-content">
                <div
                    class="h-max w-max bgColorLight topComponentSize flex justify-center items-center cursor-pointer fixed-icon">
                    <Icon name="ph:chat-text-fill" size="3.5em" class="messageIcon expanded-icon cursor-pointer"
                        @click="openClose" />
                </div>
                <span class="text-lg textColorBlack font-bold w-full flex justify-center items-center">
                    Chats
                </span>
                <div class="flex flex-col items-center flex-1 overflow-y-auto w-full px-[10px] mt-3">
                    <div class="w-full" v-for="conversation in conversations" :key="conversation.id">
                        <little-conversation @contextmenu.prevent="showConversationMenu(conversation)"
                            class="mt-8 w-full" :conversation="conversation"
                            :is-active="activeConversation === conversation" @click="
                                activeConversation =
                                activeConversation === conversation ? null : conversation
                                " />

                        <div class="relative flex">
                            <div v-if="activeMenu === String(conversation.id)"
                                class="absolute right-0 w-48 bg-white rounded-md shadow-lg z-50"
                                style="top: 0; right: 30px">
                                <div class="py-1">
                                    <button
                                        class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        @click="openDeleteModal(conversation)">
                                        <Icon name="ph:trash" class="mr-2" size="16" />
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button @click="openNewConvModal" ref="newConvButton"
                    class="sticky bottom-[10px] mx-auto my-[10px] w-[90%] flex justify-center items-center h-[40px] rounded bg-[var(--color-black)] new-conv-button">
                    <Icon name="ph:plus-bold" size="24px" class="textColorWhite" />
                </button>
            </div>
            <div v-if="activeConversation"
                class="flex-1 h-[98%] w-[50vw] bg-[var(--color-black)] textColorWhite rounded m-2 flex flex-col">
                <ActiveConversation :conversation="activeConversation" @message-sent="getConversations"
                    @update-message="getConversations" />
            </div>
        </div>
    </div>

    <div v-if="showNewConvModal || isModalAnimating"
        class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z9999 modal-backdrop"
        :class="{ 'backdrop-visible': showNewConvModal }">
        <div ref="modalContent"
            class="w-[90%] max-w-[500px] rounded-lg overflow-hidden flex flex-col max-h-[80vh] bgColorLight modal-content"
            :class="{ 'modal-visible': showNewConvModal }">
            <div class="p-4 flex justify-between items-center border-b border-gray-200">
                <h3 class="m-0 text-xl textColorBlack">Créer une conversation</h3>
                <button class="bg-transparent border-0 cursor-pointer textColorBlack" @click="closeNewConvModal">
                    <Icon name="ph:x-square" size="1.5em" />
                </button>
            </div>
            <div class="relative my-4 px-5">
                <input type="text" id="convName" v-model="conversationName"
                    class="w-full pb-2 pt-7 px-0 bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 focus:outline-none transition-all peer"
                    placeholder=" " />
                <label for="convName"
                    class="absolute left-5 top-4 textColorBlack text-sm transition-all duration-300 peer-focus:text-xs peer-focus:top-0 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:top-0">
                    Nom de la conversation
                </label>
            </div>
            <div class="p-5 flex-1 overflow-y-auto max-h-[50vh]">
                <div class="mb-4">
                    <input type="text" v-model="searchQuery"
                        class="w-full p-3 border border-gray-300 rounded-md text-base"
                        placeholder="Rechercher des utilisateurs..." @input="searchUsers" />
                </div>
                <div class="max-h-[200px] overflow-y-auto border border-gray-200 rounded mb-4"
                    v-if="searchResults.length > 0">
                    <div v-for="user in searchResults" :key="user.id"
                        class="flex items-center p-2.5 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                        @click="selectUser(user)">
                        <div
                            class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex justify-center items-center mr-2.5">
                            <Icon name="ph:user" size="1.5em" />
                        </div>
                        <div class="flex flex-col">
                            <span class="font-bold">{{ user.firstName }}</span>
                            <span class="text-xs text-gray-500">{{ user.email }}</span>
                        </div>
                    </div>
                </div>
                <div class="py-4 text-center text-gray-500" v-else-if="searchQuery && !isSearching">
                    Pas d'utilisateurs trouvés
                </div>
                <div class="mt-5" v-if="selectedUsers.length > 0">
                    <h4 class="mt-0 mb-2.5 textColorBlack">Utilisateurs sélectionnés</h4>
                    <div class="flex flex-wrap gap-2">
                        <div v-for="user in selectedUsers" :key="user.id"
                            class="flex items-center textColorBlack bg-[var(--color-primary)] px-2.5 py-1.5 rounded-full text-sm">
                            <span>{{ user.email }}</span>
                            <button @click="removeUser(user)"
                                class="bg-transparent border-0 cursor-pointer ml-1.5 flex items-center justify-center">
                                <Icon name="ph:x-circle" size="1em" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-4 flex justify-end gap-2.5 border-t border-gray-200">
                <button @click="closeNewConvModal"
                    class="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer">
                    Annuler
                </button>
                <button @click="createConversation"
                    :class="selectedUsers.length === 0 ? 'bg-gray-300' : 'bgColorPrimary'"
                    class="px-4 py-2 border-0 textColorBlack rounded cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                    :disabled="selectedUsers.length === 0">
                    Créer une conversation
                </button>
            </div>
        </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-30">
        <div class="absolute inset-0 bg-black opacity-30 z-40"></div>
        <div class="bg-white w-96 rounded-lg shadow-lg z-50 relative overflow-hidden">
            <div class="bg-red-100 px-6 py-4 flex items-center">
                <Icon name="ph:warning" class="text-red-600 mr-2" size="24" />
                <h3 class="text-lg font-semibold text-red-600">
                    Confirmation de suppression
                </h3>
            </div>
            <div class="px-6 py-4">
                <p class="text-gray-700">
                    Êtes-vous sûr de vouloir supprimer cette conversation ?
                </p>
                <p class="text-gray-700 mt-2">Cette action est irréversible.</p>
            </div>
            <div class="bg-gray-100 px-6 py-3 flex justify-end">
                <button
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2 cursor-pointer"
                    @click="cancelDelete">
                    Annuler
                </button>
                <button
                    class="bg-red-500 hover:bg-red-600 textColorWhite font-semibold py-2 px-4 rounded-lg cursor-pointer"
                    @click="removeConversation">
                    Supprimer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, watch, nextTick } from "vue";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import useAuthFetch from "~/composables/useAuthFetch";
import type { Conversation } from "~/types/Conversation";
import LittleConversation from "~/components/dashboard/messageModule/littleConversation.vue";
import ActiveConversation from "~/components/dashboard/messageModule/activeConversation.vue";
import type { User } from "~/types/User";
import { useUserStore } from "~/stores/userStore";
import { useWebSocket } from "#imports";

const { webSocketData } = useWebSocket();
gsap.registerPlugin(Draggable);
const { $toast } = useNuxtApp();
const closed = ref(true);
const drawerContainer = ref(null);
const drawer = ref(null);
const closedButton = ref(null);
const newConvButton = ref(null);
const modalContent = ref(null);
let draggableInstance: Draggable[] | null = null;
const conversations = ref<Conversation[] | null>(null);
const userStore = useUserStore();

const showNewConvModal = ref(false);
const isModalAnimating = ref(false);
const searchQuery = ref("");
const searchResults = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);
const conversationName = ref("");
const isSearching = ref(false);
const activeMenu = ref<string | null>(null);
const menuPositions = ref<{ [key: string]: number }>({});
const conversationToDelete = ref<Conversation | null>(null);
const showDeleteModal = ref(false);

const applyDraggable = () => {
    if (draggableInstance) {
        for (const instance of draggableInstance) {
            instance.kill();
        }
        draggableInstance = null;
    }

    draggableInstance = Draggable.create("#messageMenuClosed", {
        type: "rotation",
        inertia: true,
        throwResistance: 1000,
        snap: (value) => Math.round(value / 15) * 15,
        zIndexBoost: false,
    });
};

const activeConversation = ref<Conversation | null>(null);

const closeDrawer = () => {
    if (drawer.value && drawerContainer.value) {
        gsap.to(drawer.value, {
            duration: 0.5,
            x: '-100%',
            ease: 'power2.inOut',
        });

        gsap.to(drawerContainer.value, {
            duration: 0.5,
            opacity: 0,
            ease: 'power2.inOut',
            onComplete: () => {
                closed.value = true;
            },
        });
    }
};

const openClose = () => {
    if (closed.value) {
        closed.value = false;
    } else {
        closeDrawer();
    }
};

const openNewConvModal = async () => {
    if (!newConvButton.value) return;

    const buttonRect = (newConvButton.value as HTMLElement).getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    isModalAnimating.value = true;

    await nextTick();

    if (modalContent.value) {
        gsap.set(modalContent.value, {
            x: buttonCenterX - window.innerWidth / 2,
            y: buttonCenterY - window.innerHeight / 2,
            scale: 0.1,
            opacity: 0,
        });

        showNewConvModal.value = true;

        gsap.to(modalContent.value, {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(1.7)",
        });
    }

    searchQuery.value = "";
    searchResults.value = [];
    selectedUsers.value = [];
};

const closeNewConvModal = async () => {
    if (!modalContent.value || !newConvButton.value) {
        showNewConvModal.value = false;
        isModalAnimating.value = false;
        return;
    }

    const buttonRect = (newConvButton.value as HTMLElement).getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    await gsap.to(modalContent.value, {
        x: buttonCenterX - window.innerWidth / 2,
        y: buttonCenterY - window.innerHeight / 2,
        scale: 0.1,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
    });

    showNewConvModal.value = false;
    isModalAnimating.value = false;
};

const searchUsers = async () => {
    if (!searchQuery.value.trim()) {
        searchResults.value = [];
        return;
    }

    isSearching.value = true;

    try {
        const response = await useAuthFetch(`conversation/user/search?${Date.now()}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: searchQuery.value,
            }),
        });

        if (response.data.value) {
            searchResults.value = response.data.value as User[];
        }

        const currentUser = userStore.email;

        searchResults.value = searchResults.value.filter(
            (user) => user.email !== currentUser,
        );
    } catch (error: unknown) {
        const err = error as Error;
        $toast.error(err.message || "Error searching for users");
    } finally {
        isSearching.value = false;
    }
};

const selectUser = (user: User) => {
    if (!selectedUsers.value.some((selected) => selected.id === user.id)) {
        selectedUsers.value.push(user);
    }
    searchQuery.value = "";
    searchResults.value = [];
};

const removeUser = (user: User) => {
    selectedUsers.value = selectedUsers.value.filter(
        (selected) => selected.id !== user.id,
    );
};

const createConversation = async () => {
    if (selectedUsers.value.length === 0) {
        return;
    }

    try {
        const userIds = selectedUsers.value.map((user) => user.id);
        const response = await useAuthFetch(`conversation/new?${Date.now()}`, {
            method: "POST",
            body: {
                userIds,
                name: conversationName.value,
            },
        });

        if (response.status.value === 'error') {
            $toast.error("Cette conversation existe déjà")
        }

        if (
            response.data.value &&
            typeof response.data.value === "object" &&
            "content" in response.data.value
        ) {
            await getConversations();
            const newConversation = (response.data.value as { content: Conversation })
                .content;
            activeConversation.value = newConversation;
            conversationName.value = "";
            await closeNewConvModal();
        }
    } catch (error: unknown) {
        const err = error as Error;
        $toast.error(err.message || "Error creating conversation");
    }
};

const getConversations = async () => {
    try {
        const response = await useAuthFetch(`conversations?${Date.now()}`);

        conversations.value = response.data.value as Conversation[];
    } catch (error: unknown) {
        const err = error as Error;
        $toast.error(err.message || "Error fetching conversations");
    }
};

const removeConversation = async () => {
    try {
        if (conversationToDelete.value) {
            await useAuthFetch(
                `conversation/remove/${conversationToDelete.value.id}?${Date.now()}`,
                {
                    method: "DELETE",
                },
            );

            await getConversations();
            showDeleteModal.value = false;
            conversationToDelete.value = null;
        }
    } catch (error: unknown) {
        const err = error as Error;
        $toast.error(err.message || "Error deleting conversation");
    }
};

const showConversationMenu = (conversation: Conversation) => {
    toggleMenu(String(conversation.id));
};

const toggleMenu = (conversationId: string) => {
    if (activeMenu.value === conversationId) {
        activeMenu.value = null;
    } else {
        activeMenu.value = conversationId;
        nextTick(() => {
            const element = document.querySelector(
                `[data-conversation-id="${conversationId}"]`,
            );
            if (element) {
                const rect = element.getBoundingClientRect();
                menuPositions.value[conversationId] = rect.right;
            }
        });
    }
};

const openDeleteModal = (conversation: Conversation) => {
    conversationToDelete.value = conversation;
    showDeleteModal.value = true;
    activeMenu.value = null;
};

const cancelDelete = () => {
    showDeleteModal.value = false;
    conversationToDelete.value = null;
};

watch(closed, (isClosed) => {
    if (isClosed) {
        applyDraggable();
    }
});

onMounted(async () => {
    await nextTick(async () => {
        await getConversations();
    });
    applyDraggable();
    userStore.loadUserFromCookies();
});

watch(webSocketData.value, async (newData) => {
    if (newData.type === "refreshConversations") {
        await getConversations();
    }
});

onUpdated(() => {
    if (closed.value) {
        applyDraggable();
    }
});
</script>

<style scoped>
.bgColorLight {
    background-color: var(--color-white);
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.topComponentSize {
    width: 100px;
    height: 100px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    z-index: 999;
    animation: fadeIn 0.5s ease;
}

.drawer {
    width: 70vw;
    height: 100vh;
    background-color: var(--color-white);
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    display: flex;
    animation: slideInLeft 0.5s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
}

.messageIcon {
    color: var(--color-black);
}

.conversationSlider::-webkit-scrollbar {
    width: 6px;
}

.conversationSlider::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
}

.drawer-content {
    width: 150px;
}

@media (min-width: 768px) {
    .drawer-content {
        width: 224px;
    }
}

.modal-backdrop {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.modal-backdrop.backdrop-visible {
    opacity: 1;
}

.modal-content {
    transform: scale(0.1);
    opacity: 0;
}

.modal-content.modal-visible {
    transform: scale(1);
    opacity: 1;
}

.new-conv-button {
    transition: transform 0.2s ease;
}

.new-conv-button:hover {
    transform: scale(1.05);
}

.new-conv-button:active {
    transform: scale(0.95);
}

.z9999 {
    z-index: 9999;
}
</style>
