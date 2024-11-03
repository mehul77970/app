<script setup lang="ts">
import { NotificationGroup, Notification } from 'notiwind'
import {
  PhXCircle,
  PhCheckCircle,
  PhExclamationMark,
} from '@phosphor-icons/vue'
</script>

<template>
  <div>
    <NotificationGroup>
      <div
        class="fixed inset-0 flex items-start justify-end p-6 px-4 py-6 pointer-events-none z-50"
      >
        <div class="w-full max-w-sm">
          <Notification
            v-slot="{ notifications, close, hovering }"
            enter="ease-out duration-300 transition"
            enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
            enter-to="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-500"
            leave-from="opacity-100"
            leave-to="opacity-0"
            move="transition duration-500"
            move-delay="delay-300"
          >
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="w-full max-w-sm mt-4 overflow-hidden bg-white text-green-500 rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5"
              @mouseover="hovering(notification.id, true)"
              @mouseleave="hovering(notification.id, false)"
            >
              <div class="p-4">
                <div class="flex items-start justify-center">
                  <div class="ml-3 w-0 flex-1 pt-0.5">
                    <p class="font-semibold text-gray-800">
                      {{ notification.title }}
                    </p>
                    <p class="text-sm font-semibold text-gray-500">
                      {{ notification.text }}
                    </p>
                  </div>
                  <div class="flex ml-4 shrink-0">
                    <button
                      class="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                      @click="close(notification.id)"
                    >
                      <span class="sr-only">Close</span>
                      <svg
                        class="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Notification>
        </div>
      </div>
    </NotificationGroup>

    <NotificationGroup
      group="bottom"
      position="bottom"
    >
      <div
        class="fixed inset-x-0 bottom-0 flex items-start justify-end p-6 px-4 py-6 pointer-events-none"
      >
        <div class="w-full max-w-sm">
          <Notification
            v-slot="{ notifications }"
            enter="ease-out duration-300 transition"
            enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
            enter-to="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-500"
            leave-from="opacity-100"
            leave-to="opacity-0"
            move="transition duration-500"
            move-delay="delay-300"
          >
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="flex w-full max-w-sm mx-auto mt-4 overflow-hidden bg-[#1e2023] rounded-lg shadow-md"
            >
              <template v-if="notification.type == 'error'">
                <div class="flex items-center justify-center w-12 bg-red-500">
                  <PhXCircle
                    type="fill"
                    :size="24"
                  />
                </div>

                <div class="px-4 py-2 -mx-3">
                  <div class="mx-3">
                    <span class="font-semibold text-red-500">{{
                      notification.title
                    }}</span>
                    <p class="text-sm text-white/85">
                      {{ notification.text }}
                    </p>
                  </div>
                </div>
              </template>

              <template v-if="notification.type == 'info'">
                <div class="flex items-center justify-center w-12 bg-blue-500">
                  <PhExclamationMark
                    type="bold"
                    :size="24"
                  />
                </div>

                <div class="px-4 py-2 -mx-3">
                  <div class="mx-3">
                    <span class="font-semibold text-blue-500/85">{{
                      notification.title
                    }}</span>
                    <p class="text-sm text-white">
                      {{ notification.text }}
                    </p>
                  </div>
                </div>
              </template>

              <template v-if="notification.type == 'success'">
                <div class="flex items-center justify-center w-12 bg-green-500">
                  <PhCheckCircle
                    type="fill"
                    :size="24"
                  />
                </div>

                <div class="px-4 py-2 -mx-3">
                  <div class="mx-3">
                    <span class="font-semibold text-green-500/85">{{
                      notification.title
                    }}</span>
                    <p class="text-sm text-white">
                      {{ notification.text }}
                    </p>
                  </div>
                </div>
              </template>
            </div>
          </Notification>
        </div>
      </div>
    </NotificationGroup>
  </div>
</template>
