<script setup lang="ts">

defineOptions({ name: 'SortButton' })

interface Props {
  field: {
    key: string
    label: string
  };
  currentSort: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'sort-change', field: string, direction: string): void
}>()


const sortDirection = computed(() => {
  if (props.currentSort === `${props.field.key}ASC`) return 'asc'
  if (props.currentSort === `${props.field.key}DESC`) return 'desc'
  return null
});

const sortIcon = computed(() => {
  if (sortDirection.value === 'asc') return 'ep:sort-up'
  if (sortDirection.value === 'desc') return 'ep:sort-down'
  return 'ep:sort'
});

const handleClick = () => {
  let direction
  if (sortDirection.value === null) {
    direction = 'desc'
  } else if (sortDirection.value === 'desc') {
    direction = 'asc'
  } else {
    direction = null
  }

  emit('sort-change', props.field.key, direction || '')
}
</script>

<template>
  <div
    class="flex text-center items-center bg-white border border-sky-500 text-sky-500 hover:bg-sky-50 transition-all duration-300 px-4 py-2 rounded"
    @click="handleClick"
  >
    <div>{{ field.label }}</div>
    <Icon :name="sortIcon" class="ml-1" />
  </div>
</template>

<style scoped>

</style>
