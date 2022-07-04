<script lang="ts" setup>
import config from '@/config'
import PageLayout from '@/components/layouts/PageLayout.vue'
import BrewTitle from '@/components/atoms/BrewTitle.vue'
import BrewText from '@/components/atoms/BrewText.vue'
</script>

<template>
  <PageLayout>
    <section class="mb-6">
      <BrewTitle extend-classes="mb-3">Feedback</BrewTitle>
      <BrewText extend-classes="mb-2"
        >Your feedback is essential to making {{ config.appName }} as good as it
        can be.</BrewText
      >
      <BrewText extend-classes="pointer-events-auto"
        >Get in touch and send me a message:
        <a
          class="hover:underline hover:cursor-pointer text-pink-light"
          :href="`mailto:${config.contactEmail}`"
          >{{ config.contactEmail }}</a
        ></BrewText
      >
    </section>

    <section class="mb-6">
      <BrewTitle extend-classes="text-xl">Bugs 👾</BrewTitle>
      <BrewText extend-classes="mb-2 pointer-events-auto"
        >Found a bug?</BrewText
      >
      <BrewText>
        It would be great if you could send a description including the steps
        you took to find it (if you know them). Screenshots and additional
        technical details are welcome!</BrewText
      >
    </section>

    <section class="mb-12">
      <BrewTitle extend-classes="text-xl">Feature requests</BrewTitle>
      <BrewText extend-classes="mb-2 pointer-events-auto"
        >I'd also love to hear what the features you'd like to see.</BrewText
      >
    </section>

    <section class="mb-6">
      <BrewTitle extend-classes="mb-3">Support</BrewTitle>

      <BrewText extend-classes="pointer-events-auto mb-2"
        >If you're enjoying {{ config.appName }}, support me on
        <a
          class="hover:underline hover:cursor-pointer text-pink-light"
          :href="config.donationsUrl"
          target="_blank"
          rel="noopener nofollow"
          >Ko-Fi</a
        >
        ☕️</BrewText
      >
      <BrewText extend-classes="mb-2"
        >I plan to keep {{ config.appName }} free to use, and any donations will
        help cover hosting expenses.</BrewText
      >
    </section>
  </PageLayout>
</template>
