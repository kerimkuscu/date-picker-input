<template>
  <div :class="['date-picker-container', className]" :style="style">
    <!-- Date Input -->
    <div class="date-input-wrapper">
      <input
          type="text"
          v-model="selectedDate"
          @click="toggleCalendar"
          :disabled="disabled"
          :placeholder="placeholder"
          :readonly="true"
      />
    </div>

    <!-- Date Picker Dropdown -->
    <div v-if="isOpen" class="picker-dropdown">
      <!-- Shortcuts Panel -->
      <div class="shortcuts-panel">
        <div
            v-for="(shortcut, index) in mergedShortcuts"
            :key="index"
            class="shortcut-item"
            @click="selectShortcut(shortcut)"
        >
          {{ shortcut.text }}
        </div>
      </div>

      <!-- Calendar Panel -->
      <div class="calendar-panel">
        <div class="calendar-header">
          <button class="nav-button" @click="previousYear">«</button>
          <button class="nav-button" @click="previousMonth">‹</button>
          <span class="current-date">
            {{ currentYear }} {{ monthNames[currentMonth] }}
          </span>
          <button class="nav-button" @click="nextMonth">›</button>
          <button class="nav-button" @click="nextYear">»</button>
        </div>

        <!-- Weekdays and Days -->
        <div class="calendar-body">
          <div class="weekdays">
            <span v-for="day in weekDays" :key="day">{{ day }}</span>
          </div>
          <div class="days">
            <span v-for="day in calendarDays" :key="day.date" :class="['day', { 'selected': isSelectedDate(day.date), 'today': isToday(day.date) }]" @click="selectDate(day.date)">
              {{ day.dayNumber }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch } from 'vue';

// Props definition
const props = defineProps({
  modelValue: { type: String, default: null },
  dateFormat: { type: String, default: 'YYYY-MM-DD' },
  minDate: { type: String, default: null },
  maxDate: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: 'Select a date' },
  defaultValue: { type: String, default: null },
  className: { type: String, default: '' },
  style: { type: Object, default: () => ({}) },
  locale: { type: String, default: 'en-US' },
  readOnly: { type: Boolean, default: false },
  size: { type: String, default: 'medium', validator: (value: string) => ['small', 'medium', 'large'].includes(value) },
  disabledDates: { type: Array as unknown as () => string[], default: () => [] },
  timeZone: { type: String, default: 'UTC' },
  clearable: { type: Boolean, default: false },
  showWeekNumbers: { type: Boolean, default: false },
  yearRange: { type: Object as () => [number, number], default: () => [1900, 2100] },
  firstDayOfWeek: { type: Number, default: 0 },
  shortcuts: { type: Boolean, default: false },
  customShortcuts: { type: Array as unknown as () => { text: string; value: Date | (() => Date) }[], default: () => [] },
});

// Emit definition
const emit = defineEmits<{ (event: 'update:modelValue', value: string | null): void }>();

// State
const selectedDate = ref(props.defaultValue || props.modelValue);
const isOpen = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

// Constants for month and weekdays
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Shortcuts setup
const defaultShortcuts = [
  { text: 'Today', value: new Date() },
  { text: 'Yesterday', value: () => { const date = new Date(); date.setDate(date.getDate() - 1); return date; }},
  { text: 'A week ago', value: () => { const date = new Date(); date.setDate(date.getDate() - 7); return date; }},
];

const mergedShortcuts = computed(() => [...defaultShortcuts, ...props.customShortcuts]);

// Size class computed for styling
const sizeClass = computed(() => ({
  small: 'date-picker--small',
  medium: 'date-picker--medium',
  large: 'date-picker--large',
}[props.size]));

// Min and Max date formatted
const formattedMinDate = computed(() => (props.minDate ? formatDate(props.minDate) : null));
const formattedMaxDate = computed(() => (props.maxDate ? formatDate(props.maxDate) : null));

// Watch for changes in the model value
watch(() => props.modelValue, (newValue) => {
  selectedDate.value = newValue;
});

// Methods for date selection and calendar behavior
const formatDate = (date: string): string => date;

const toggleCalendar = () => {
  isOpen.value = !isOpen.value;
};

const selectDate = (date: Date) => {
  // Adjust the date to local time zone
  const localDate = new Date(date);
  localDate.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Corrects the difference between UTC and local time
  selectedDate.value = localDate.toISOString().split('T')[0]; // Save in YYYY-MM-DD format
  emit('update:modelValue', selectedDate.value);
  isOpen.value = false;
};

const selectShortcut = (shortcut: { text: string; value: Date | (() => Date) }) => {
  const date = typeof shortcut.value === 'function' ? shortcut.value() : shortcut.value;
  // Adjust the date to local time zone
  const localDate = new Date(date);
  localDate.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Corrects the difference between UTC and local time

  selectedDate.value = localDate.toISOString().split('T')[0]; // Save in YYYY-MM-DD format
  emit('update:modelValue', selectedDate.value);
};



// Navigation for year and month
const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const previousYear = () => {
  currentYear.value--;
};

const nextYear = () => {
  currentYear.value++;
};

// Calculate days in the current month
const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);

  const days = [];

  // Add days from previous month (if necessary)
  for (let i = firstDay.getDay(); i > 0; i--) {
    const date = new Date(currentYear.value, currentMonth.value, 1 - i);
    days.push({ date, dayNumber: date.getDate(), currentMonth: false });
  }

  // Add days from the current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentYear.value, currentMonth.value, i);
    days.push({ date, dayNumber: i, currentMonth: true });
  }

  // Fill remaining days (next month)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, i);
    days.push({ date, dayNumber: date.getDate(), currentMonth: false });
  }

  return days;
});

// Check if date is selected
const isSelectedDate = (date: Date) => {
  if (!selectedDate.value) return false;
  const selected = new Date(selectedDate.value);
  return date.toDateString() === selected.toDateString();
};

// Check if date is today
const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};
</script>

<style scoped>
/* Styles for the date picker component */
.date-picker-container {
  position: relative;
  width: 320px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

.date-input-wrapper {
  width: 100%;
}

.date-input-wrapper input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.picker-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  display: flex;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.shortcuts-panel {
  width: 120px;
  border-right: 1px solid #e8e8e8;
  padding: 8px 0;
}

.shortcut-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.shortcut-item:hover {
  background-color: #f5f5f5;
  color: #1890ff;
}

.calendar-panel {
  padding: 8px;
  width: 280px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.nav-button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px 8px;
  color: #666;
}

.nav-button:hover {
  color: #1890ff;
}

.current-date {
  font-weight: 500;
  color: #606266;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin: 8px 0;
}

.weekdays span {
  font-size: 12px;
  color: #606266;
  padding: 4px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
}

.day:hover {
  background-color: #f5f5f5;
}

.selected {
  background-color: #1890ff;
  color: white;
}

.today {
  color: #1890ff;
  font-weight: bold;
}

.selected.today {
  color: white;
}
</style>
