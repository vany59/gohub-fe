<template>
  <div
    v-if="Notifications.length"
    :style="{
      position: `absolute`,
      right: `10px`,
      bottom: `10px`,
      height: `auto`,
      zIndex: `10000`,
      display: `flex`,
      flexDirection: `column`,
      justifyContent: `flex-end`
    }"
  >
    <div
      :style="{
        heigh: `80px`,
        overflow: 'auto'
      }"
    >
      <div v-for="notification in Notifications" :key="notification.key">
        <v-alert :type="notification.type" min-width="200px" border="left">
          {{ notification.message }}
        </v-alert>
      </div>
    </div>
  </div>
</template>
