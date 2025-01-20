import dayjs from "dayjs";

export const searchConfig = {
  inline: true,
  formDesc: {
    date: {
      type: 'daterange',
      label: $i18n.t("checkTaskOrders.date"),
      // default:[dayjs().format('YYYY-MM-01'),dayjs().format('YYYY-MM-DD')],
      attrs: {
        valueFormat: "yyyy-MM-dd",
        searchArrKey: ["startTime", "endTime"],
        clearable:false,
        editable:false,
        pickerOptions:{
          disabledDate(time) {
            let t = new Date().getDate();
            // 如果想包含本月本月 - 8.64e7 * t 就不需要了，
            // 如果想之前的不能选择把 > 换成 <
            return time.getTime() > Date.now();
          },
        }
      },
    },
  },
}
