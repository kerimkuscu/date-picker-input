# My Date Picker Library

## 🚀 Overview

`vue-date-picker` is a customizable and feature-rich date picker component for Vue.js. It allows users to select dates with a clean UI, supports various date formats, and comes with a variety of props to control behavior such as disabling dates, custom shortcuts, and more. This component provides a seamless user experience for date selection in any Vue.js application.

## 📦 Installation

To get started with `vue-date-picker`, follow these steps:

### 1. Install the Package

You can install the library via npm or yarn:

#### Using npm

```bash
npm install my-date-picker-library
or
yarn add my-date-picker-library
```
## 📘 Usage
Once installed, you can import and use the ```DatePickerComponent``` component in your Vue.js application. Here's a step-by-step guide on how to integrate it:

### 1. Import and Register the Component
In your main entry file (e.g., ```main.js``` or ```main.ts```), import the ```DatePickerComponent``` component and register it globally or locally in your components.
#### Global Registration
```bash
import { createApp } from 'vue';
import App from './App.vue';
import DatePickerComponent from 'my-date-picker-library';

// Create your Vue app
const app = createApp(App);

// Register the component globally
app.component('DatePickerComponent', DatePickerComponent);

// Mount the app
app.mount('#app');
```

#### Local Registration
In the component where you want to use the masked input:
```bash
<template>
  <div>
    <DatePickerComponent
      v-model="selectedDate"
      :placeholder="'Select a date'"
      :disabled="false"
      :clearable="true"
      :shortcuts="true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DatePickerComponent from 'my-date-picker-library';

export default defineComponent({
  components: {
    DatePickerComponent
  },
  setup() {
    const selectedDate = ref('');
    return {
      selectedDate
    };
  }
});
</script>
```

### 2. Component Props
The ```DatePickerComponent``` component accepts the following props:

- modelValue (String): The selected date value (in YYYY-MM-DD format). Used for two-way binding with ```v-model```.
- dateFormat (String): Format to display the selected date. Default is ```'YYYY-MM-DD'```.
- minDate (String, Optional): The earliest selectable date. Must be in ```'YYYY-MM-DD'``` format.
- maxDate (String, Optional): The latest selectable date. Must be in ```'YYYY-MM-DD'``` format.
- disabled (Boolean, Optional): If true, disables the date picker. Default is ```false```.
- placeholder (String, Optional): Placeholder text for the input. Default is ```'Select a date'```.
- className (String, Optional): Additional CSS class names to apply to the component.
- style (Object, Optional): Inline styles to apply to the component.
- locale (String, Optional): The locale for date formatting. Default is ```'en-US'```.
- readOnly (Boolean, Optional): If true, makes the input read-only. Default is ```false```.
- size (String, Optional): Determines the size of the input. Accepts ```'small'```, ```'medium'```, or ```'large'```.
- disabledDates (Array, Optional): Array of dates to disable. Must be in ```'YYYY-MM-DD'``` format.
- clearable (Boolean, Optional): If true, allows clearing the selected date. Default is ```false```.
- showWeekNumbers (Boolean, Optional): If true, shows week numbers in the calendar. Default is ```false```.
- yearRange (Array, Optional): Array defining the year range for the calendar. Default is ```[1900, 2100]```.
- firstDayOfWeek (Number, Optional): Defines which day is considered the first day of the week (0 for Sunday, 1 for Monday, etc.). Default is ```0```.
- shortcuts (Boolean, Optional): If true, displays date shortcuts (like Today, Yesterday). Default is ```false```.
- customShortcuts (Array, Optional): An array of custom shortcut objects, each containing ```text``` (string) and ```value``` (Date or function returning Date).

## 📝 Contributing
We welcome contributions! If you have any ideas, suggestions, or bug fixes, please feel free to open an issue or submit a pull request.

## 🔗 License
This project is licensed under the ISC License.

##  ☕ Support Me

If you like my work and want to support me, you can buy me a coffee! 😊

[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/kerimkuscu)

