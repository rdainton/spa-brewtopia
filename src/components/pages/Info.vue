<script lang="ts" setup>
// Components
import PageLayout from '@/components/layouts/PageLayout.vue'
import BrewTitle from '@/components/atoms/BrewTitle.vue'
import BrewText from '@/components/atoms/BrewText.vue'
</script>

<template>
  <PageLayout>
    <div>
      <BrewTitle extend-classes="mb-3">Disclaimer</BrewTitle>
      <BrewText>
        Magic: The Gathering is a Trademark of Wizards of the Coast, Inc. and
        Hasbro, Inc.
      </BrewText>
      <BrewText>Brewtopia.io is unaffiliated.</BrewText>
    </div>
  </PageLayout>
</template>
