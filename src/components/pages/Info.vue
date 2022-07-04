<script lang="ts" setup>
import config from '@/config'

// Components
import PageLayout from '@/components/layouts/PageLayout.vue'
import BrewTitle from '@/components/atoms/BrewTitle.vue'
import BrewText from '@/components/atoms/BrewText.vue'
import BackButton from '@/components/atoms/BackButton.vue'
</script>

<template>
  <PageLayout>
    <BackButton />

    <section class="my-6">
      <BrewTitle extend-classes="mb-3">Disclaimer</BrewTitle>
      <BrewText extend-classes="mb-2">
        Magic: The Gathering is a Trademark of Wizards of the Coast, Inc. and
        Hasbro, Inc.
      </BrewText>
      <BrewText>{{ config.appName }} is unaffiliated.</BrewText>
    </section>

    <section class="mb-6">
      <BrewTitle extend-classes="mb-3">Cookies 🍪</BrewTitle>
      <BrewText extend-classes="mb-2">
        {{ config.appName }} uses essential cookies for managing your session
        and authentication.
      </BrewText>
      <BrewText
        >No additonal cookies are used for tracking, advertising, or marketing
        purposes.</BrewText
      >
    </section>

    <section>
      <BrewTitle extend-classes="mb-3">Privacy</BrewTitle>
      <BrewText extend-classes="mb-2">
        When you create an account on {{ config.appName }}, your details are
        stored privately and securely—following industry best practices.
      </BrewText>
      <BrewText extend-classes="mb-2">
        We will only contact you for issues regarding your
        {{ config.appName }} account, or if you have initiated the conversation.
      </BrewText>
      <BrewText extend-classes="mb-2">
        We will not contact you with marketing materials, and will not share
        your details with any third-parties.
      </BrewText>
      <BrewText extend-classes="pointer-events-auto"
        >You can request your details be permanently deleted at any time by
        emailing
        <a
          class="hover:underline hover:cursor-pointer text-pink-light"
          :href="`mailto:${config.contactEmail}`"
          >{{ config.contactEmail }}</a
        ></BrewText
      >
    </section>
  </PageLayout>
</template>
