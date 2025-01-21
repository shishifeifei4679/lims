import Vue from "vue";
import EleForm from "@/components/ele-form/index";
const attrs = { clearable: true };
const keys = [
  "number",
  "select",
  "input",
  "autocomplete",
  "textarea",
  "date",
  "dates",
  "week",
  "month",
  "monthrange",
  "year",
  "daterange",
  "time",
  "timerange",
  "datetime",
  "datetimerange",
  "tree-select"
];
let keyVal = {};
keys.forEach(val => (keyVal[val] = attrs));
Vue.use(EleForm, keyVal);
