<template>
  <el-table-column
    :key="randomKey"
    v-bind="$attrs"
    v-on="$listeners"
    :prop="column.prop"
    :label="column.label"
    :type="column.type"
    :index="column.index"
    :column-key="column.columnKey"
    :width="
      !column.type
        ? undefined
        : column.type == 'index'
        ? Number(column.width || 67) > 67
          ? column.width
          : 67
        : column.width || 50
    "
    :min-width="getWidth(column.minWidth || column.width, column.label)"
    :fixed="column.fixed"
    :render-header="column.renderHeader"
    :sortable="column.sortable || false"
    :sort-method="column.sortMethod"
    :sort-by="column.sortBy"
    :sort-orders="column.sortOrders"
    :resizable="column.resizable || true"
    :formatter="column.formatter"
    :show-overflow-tooltip="
      !isFinite(column.showOverflowTooltip)
        ? true
        : column.showOverflowTooltip
        ? true
        : false
    "
    :align="column.align || align || 'left'"
    :header-align="
      column.headerAlign || headerAlign || column.align || align || 'left'
    "
    :class-name="column.className"
    :label-class-name="column.labelClassName"
    :selectable="column.selectable"
    :reserve-selection="column.reserveSelection || false"
    :filters="column.filters"
    :filter-placement="column.filterPlacement"
    :filter-multiple="column.filterMultiple"
    :filter-method="column.filterMethod"
    :filtered-value="column.filteredValue"
    :show-column-search="
      !isFinite(column.showColumnSearch)
        ? true
        : column.showColumnSearch
        ? true
        : false
    "
    :show-column-search-config="
      !isFinite(column.showColumnSearchConfig)
        ? column.showColumnSearchConfig
        : {}
    "
  >
    <template slot="header" slot-scope="scope">
      <lb-render
        v-if="column.renderHeader"
        :scope="scope"
        :render="column.renderHeader"
      >
      </lb-render>
      <div
        v-else
        class="column-search-btn-row"
        :style="{
          display: column.showColumnSearch ? 'flex' : 'inline-block',
          'align-items': 'center',
          'justify-content':
            (column.headerAlign ||
              headerAlign ||
              column.align ||
              align ||
              'left') == 'center'
              ? 'center'
              : (column.headerAlign ||
                  headerAlign ||
                  column.align ||
                  align ||
                  'left') == 'left'
              ? 'flex-start'
              : 'center',
        }"
      >
        <span
          :style="{
            'max-width': `calc(100% - ${column.showColumnSearch ? '13px' : 0})`,
            color: column.color || '#666666',
          }"
        >
          {{ scope.column.label }}
          <el-tooltip
            v-if="!!column.headerTips"
            class="item"
            effect="dark"
            :content="column.headerTips"
            placement="top-start"
            style="cursor: pointer;"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </span>
        <el-popover
          popper-class="column-search-popover"
          placement="right"
          width="442"
          trigger="click"
          v-if="column.showColumnSearch"
          @hide="keywordSearchInputShow = false"
        >
          <div class="column-search-block">
            <el-tabs v-model="activeName" type="card" size="mini">
              <el-tab-pane
                :label="$i18n.t('common.screeningCondition')"
                name="second"
              >
                <span slot="label">
                  <i class="el-icon-search"></i>
                  {{ $i18n.t("common.screeningCondition") }}
                  <!-- 筛选条件 -->
                </span>

                <div>
                  <p class="column-search-label">{{ column.label }}</p>

                  <div>
                    <div>
                      <!-- 关键字搜索 -->
                      <el-input
                        v-if="
                          (!columnSearchConfig.type ||
                            columnSearchConfig.type == 'input') &&
                          keywordSearchInputShow
                        "
                        v-model="searchForm.value"
                        :placeholder="$i18n.t('common.keywordSearch')"
                        size="mini"
                        style="width: 100%"
                        class="keyword-search-input"
                        @input="(e) => valueChange(e, 'input')"
                        @keyup.enter.native="handleEnter"
                      ></el-input>

                      <!-- <el-time-picker
                        v-else-if="columnSearchConfig.type == 'timePicker'"
                        :is-range="columnSearchConfig.dateType == 'isRange'"
                        v-model="searchForm.value"
                        :value-format="
                          columnSearchConfig.valueFormat || 'HH:mm:ss'
                        "
                        :picker-options="columnSearchConfig.pickerOptions || {}"
                        :default-value="columnSearchConfig.defaultValue || []"
                        placeholder="请选择时间"
                        size="mini"
                        style="width: 100%"
                      >
                      </el-time-picker> -->

                      <!-- 日期范围 -->
                      <el-date-picker
                        v-else-if="
                          columnSearchConfig.type == 'datePicker' ||
                          columnSearchConfig.type == 'dateTimePicker'
                        "
                        :type="columnSearchConfig.dateType || 'datetimerange'"
                        v-model="searchForm.value"
                        range-separator="-"
                        :start-placeholder="$i18n.t('common.startDate')"
                        :end-placeholder="$i18n.t('common.endDate')"
                        :placeholder="$i18n.t('common.pleaseSelectDate')"
                        :value-format="
                          columnSearchConfig.valueFormat ||
                          'yyyy-MM-dd HH:mm:ss'
                        "
                        size="mini"
                        style="width: 100%"
                        @change="(e) => valueChange(e, 'date')"
                        :default-time="
                          columnSearchConfig.dateType || 'datetimerange'
                            ? ['00:00:00', '23:59:59']
                            : undefined
                        "
                        @keyup.enter.native="handleEnter"
                        :picker-options="columnSearchConfig.pickerOptions || {}"
                      >
                      </el-date-picker>

                      <!-- 复选框 -->
                      <div v-else-if="columnSearchConfig.type == 'checkbox'">
                        <div class="flex">
                          <div class="selected-btn flex align-items-center">
                            <el-checkbox
                              v-model="checkboxFocusVal1"
                              @change="handleCheckAllChange(true)"
                              @keyup.enter.native="handleEnter"
                            >
                              <img
                                class="img-default"
                                src="@/assets/images/icon_invert.png"
                                alt=""
                              />
                              <img
                                class="img-hover"
                                src="@/assets/images/icon_invert_h.png"
                                alt=""
                              />
                              <!-- 全选 -->
                              <span>{{ $i18n.t("common.checkAll") }}</span>
                            </el-checkbox>
                          </div>
                          <div class="selected-btn flex align-items-center">
                            <el-checkbox
                              v-model="checkboxFocusVal2"
                              @change="handleCheckAllChange(false)"
                              @keyup.enter.native="handleEnter"
                            >
                              <img
                                class="img-default"
                                src="@/assets/images/icon_clear.png"
                                alt=""
                              />
                              <img
                                class="img-hover"
                                src="@/assets/images/icon_clear_h.png"
                                alt=""
                              />
                              <!-- 清空 -->
                              <span>{{ $i18n.t("common.empty") }}</span>
                            </el-checkbox>
                          </div>
                          <div class="selected-btn flex align-items-center">
                            <el-checkbox
                              v-model="checkboxFocusVal3"
                              @change="handleCheckInvertChange"
                              @keyup.enter.native="handleEnter"
                            >
                              <img
                                class="img-default"
                                src="@/assets/images/icon_checkall.png"
                                alt=""
                              />
                              <img
                                class="img-hover"
                                src="@/assets/images/icon_checkall_h.png"
                                alt=""
                              />
                              <!-- 反选 -->
                              <span>{{
                                $i18n.t("common.invertSelection")
                              }}</span>
                            </el-checkbox>
                          </div>
                        </div>

                        <div class="margin-top10">
                          <el-checkbox-group
                            v-model="searchForm.value"
                            @change="(e) => valueChange(e, 'checkbox')"
                            @keyup.enter.native="handleEnter"
                          >
                            <el-checkbox
                              v-for="item in selectList"
                              :label="
                                column.optionProp
                                  ? item[column.optionProp.value]
                                  : item.value
                              "
                              :key="`${searchForm.columnKey}${
                                column.optionProp
                                  ? item[column.optionProp.value]
                                  : item.value
                              }`"
                            >
                              {{
                                column.optionProp
                                  ? item[column.optionProp.label]
                                  : item.label
                              }}
                            </el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>

                      <!-- 单选 -->
                      <div v-else-if="columnSearchConfig.type == 'radio'">
                        <div class="margin-top10">
                          <el-radio-group
                            v-model="searchForm.value"
                            @input="(e) => valueChange(e, 'radio')"
                            @keyup.enter.native="handleEnter"
                          >
                            <el-radio
                              v-for="item in selectList"
                              :label="
                                column.optionProp
                                  ? item[column.optionProp.value]
                                  : item.value
                              "
                              :key="`${searchForm.columnKey}${
                                column.optionProp
                                  ? item[column.optionProp.value]
                                  : item.value
                              }`"
                            >
                              {{
                                column.optionProp
                                  ? item[column.optionProp.label]
                                  : item.label
                              }}
                            </el-radio>
                          </el-radio-group>
                        </div>
                      </div>

                      <!-- 树搜索 -->
                      <div v-else-if="columnSearchConfig.type == 'tree'">
                        <div class="margin-top10">
                          <!-- :default-checked-keys="
                              columnSearchConfig.showCheckbox
                                ? searchForm.value
                                : []
                            " -->
                          <el-tree
                            :data="selectList"
                            accordion
                            :props="column.optionProp || undefined"
                            :default-expanded-keys="
                              columnSearchConfig.defaultExpandedKeys || []
                            "
                            :node-key="columnSearchConfig.nodeKey || 'id'"
                            :current-node-key="
                              !columnSearchConfig.showCheckbox &&
                              searchForm.value &&
                              searchForm.value.length > 0
                                ? searchForm.value[0]
                                : undefined
                            "
                            :highlight-current="false"
                            :show-checkbox="
                              columnSearchConfig.showCheckbox || false
                            "
                            :default-expand-all="
                              columnSearchConfig.defaultExpandAll || false
                            "
                            :check-strictly="true"
                            @check-change="handleTreeNodeClick"
                            ref="treeSearch"
                            @keyup.enter.native="handleEnter"
                          >
                            <span
                              class="custom-tree-node flex align-items-center"
                              slot-scope="{ node, data }"
                            >
                              <el-radio
                                v-model="searchForm.value[0]"
                                :label="
                                  column.optionProp
                                    ? data[column.optionProp.value]
                                    : data.value
                                "
                                :key="`${searchForm.columnKey}${
                                  column.optionProp
                                    ? data[column.optionProp.value]
                                    : data.value
                                }`"
                                v-if="!columnSearchConfig.showCheckbox"
                                :disabled="
                                  !!columnSearchConfig.finalNodeSelect &&
                                  data.children &&
                                  data.children.length > 0
                                "
                                @input="(e) => valueChange([data], 'tree')"
                              >
                                &nbsp;
                              </el-radio>
                              <span>
                                <!-- {{
                                  column.optionProp
                                    ? node[column.optionProp.label]
                                    : node.label
                                }} -->
                                <!-- {{ node.label }} -->
                                {{
                                  column.optionProp
                                    ? data[column.optionProp.label]
                                    : data.label
                                }}
                              </span>
                            </span>
                          </el-tree>
                        </div>
                      </div>
                      <!-- 数字范围搜索 -->
                      <div v-else-if="columnSearchConfig.type == 'number'">
                        <div class="margin-top10 flex">
                          <!-- 数字范围搜索 -->
                          <el-input-number
                            v-model="searchForm.value[0]"
                            @input="(e) => valueChange(e, 'number')"
                            :placeholder="$i18n.t('common.minValue')"
                            style="width: 192px !important"
                          ></el-input-number>
                          <el-input-number
                            v-model="searchForm.value[1]"
                            @input="(e) => valueChange(e, 'number')"
                            :placeholder="$i18n.t('common.maxValue')"
                            style="width: 192px !important; margin-left: 10px"
                          ></el-input-number>
                        </div>
                      </div>
                    </div>

                    <div
                      class="margin-top10"
                      v-if="columnSearchConfig.sort !== false"
                    >
                      <el-radio
                        v-model="searchForm.sort"
                        label="asc"
                        border
                        size="mini"
                        style="margin-right: 0"
                        @keyup.enter.native="handleEnter"
                      >
                        {{ $i18n.t("common.ascendingArrangement") }}
                        <!-- 升序排列 -->
                      </el-radio>
                      <el-radio
                        v-model="searchForm.sort"
                        label="desc"
                        border
                        size="mini"
                        @keyup.enter.native="handleEnter"
                      >
                        {{ $i18n.t("common.descendingArrangement") }}
                        <!-- 降序排列 -->
                      </el-radio>
                    </div>

                    <div
                      class="margin-top10 flex align-items-center operate-btn"
                    >
                      <el-button @click="search" type="primary" size="mini">
                        <!-- 搜索 -->
                        {{ $i18n.t("common.search") }}
                      </el-button>
                      <el-button @click="reset('second')" size="mini">
                        {{ $i18n.t("common.reset") }}
                        <!-- 重置 -->
                      </el-button>
                      <div
                        v-if="searchForm.valueText != ''"
                        class="flex align-items-center"
                        style="margin-left: 10px"
                      >
                        <span class="text-value">
                          {{ searchForm.valueText }}
                        </span>
                        <i @click="fastReset" class="el-icon-delete"></i>
                      </div>
                      <div
                        v-if="searchForm.sort != ''"
                        class="flex align-items-center"
                        style="margin-left: 10px"
                      >
                        <span>{{
                          searchForm.sort == "desc"
                            ? $i18n.t("common.descendingArrangement")
                            : $i18n.t("common.ascendingArrangement")
                        }}</span>
                        <i
                          @click="
                            () => {
                              searchForm.sort = '';
                              search();
                            }
                          "
                          class="el-icon-delete"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>

          <img
            v-if="
              column.showColumnSearch &&
              searchFormConfirmed.sort == '' &&
              ((Array.isArray(searchFormConfirmed.value) &&
                searchFormConfirmed.value.length > 0) ||
                (!Array.isArray(searchFormConfirmed.value) &&
                  searchFormConfirmed.value !== ''))
            "
            slot="reference"
            class="img-search column-search-btn"
            src="@/assets/images/icon_filter_h.png"
            alt=""
            @click="keywordSearcFocus"
            ref="columnSearchBtnRef"
            :data-id="columnSearchBtnUuidv4"
          />
          <img
            v-else-if="
              column.showColumnSearch &&
              searchFormConfirmed.sort === '' &&
              (searchFormConfirmed.value === '' ||
                (Array.isArray(searchFormConfirmed.value) &&
                  searchFormConfirmed.value.length == 0))
            "
            slot="reference"
            class="img-search column-search-btn"
            src="@/assets/images/icon_filter.png"
            alt=""
            @click="keywordSearcFocus"
            ref="columnSearchBtnRef"
            :data-id="columnSearchBtnUuidv4"
          />

          <img
            v-if="column.showColumnSearch && searchFormConfirmed.sort == 'asc'"
            slot="reference"
            class="img-search column-search-btn"
            src="@/assets/images/icon_arr_asc.png"
            alt=""
            @click="keywordSearcFocus"
            ref="columnSearchBtnRef"
            :data-id="columnSearchBtnUuidv4"
          />
          <img
            v-if="column.showColumnSearch && searchFormConfirmed.sort == 'desc'"
            slot="reference"
            class="img-search column-search-btn"
            src="@/assets/images/icon_arr_desc.png"
            alt=""
            @click="keywordSearcFocus"
            ref="columnSearchBtnRef"
            :data-id="columnSearchBtnUuidv4"
          />
        </el-popover>
      </div>
    </template>

    <template slot-scope="scope">
      <lb-render :scope="scope" :render="column.render"> </lb-render>
    </template>

    <template v-if="column.children">
      <lb-column
        v-for="(col, index) in column.children"
        :key="index"
        :column="col"
      >
      </lb-column>
    </template>
  </el-table-column>
</template>

<script>
import LbRender from "./lb-render";
import forced from "./forced.js";
import { v4 as uuidv4 } from "uuid";

/**
 * column.color: 改变表头文字颜色
 *  column.headerTips: 显示表头文本提醒
 * :show-column-search="
      !isFinite(column.showColumnSearch)
        ? true
        : column.showColumnSearch
        ? true
        : false
    "
    :show-column-search-config="
      !isFinite(column.showColumnSearchConfig)
        ? column.showColumnSearchConfig
        : {}
    "
 * @description 列搜索功能传入的参数注释
 * @param {showColumnSearch} 非必填 Boolean显示列快捷搜索true，不传或者false都是不显示
 * @param {showColumnSearchConfig}: { // 非必填 对象{} 不设置，就是默认模糊搜索
    type: 'dateTimePicker', //非必填 字段值为'input'关键字模糊搜索、 'datePicker'、'dateTimePicker'日期范围搜索、'checkbox'复选框组（对应原下拉菜单）、 'radio'单选（对应原下拉菜单）、 'tree'对应树结构搜索、'number'数字范围min、max最小值最大值
    dateType: 'datetimerange', //非必填 type = 'datePicker'、'dateTimePicker'的前提下启用，对应element-ui
    valueFormat: 'yyyy-MM-dd HH:mm:ss', //非必填 type = 'datePicker'、'dateTimePicker'的前提下启用，日期的输出格式，对应element-ui
    value: '' || [], //非必填 value值，设置了value值的一进入页面会自动根据设置好的value值进行查询，重置会清空value值字段 日期范围、多选、树值都为数组[]
    defaultValue: '', //非必填  默认值，设置了默认值但是没有value值的一进入页面会自动把默认值赋值给value值之后用value值进行查询，重置时会清空value值，然后将defaultValue默认值赋值给value值，默认值和value值同时存在的用value值。
    option: [], // 是render插入的情况下且type = checkbox或radio 必填，其余情况非必填 render插入的html标签，类似于状态+<el-tag>渲染的这种，需要额外传入option[{value: '', label: ""}]，默认格式，会根据原本optionProp参数对象设置的value、label转换key读取option
    nodeKey: "typeCode", // tree树结构 默认节点的key，默认节点的key = id，非必填
    showCheckbox: true, // 树结构 多选true， false单选，默认单选 非必填
    defaultExpandAll: true, // 树结构 是否展开所有节点，默认不展开 非必填
    defaultExpandedKeys: [], // 树结构 默认展开的指定节点，默认不展开 非必填
    finalNodeSelect: false, // 树结构 true为只能选择末级节点，单选模式下生效。 默认为false可以单选任意一级 非必填
    specifySearchKey: 'Abcd', // 指定的搜索字段key，这里设置之后，搜索时的key值将以此为准，不再以column中的prop查询，此处不设置的话默认正常使用column的prop值。 非必填
    specifySortKey: 'Abcd2', // 指定的排序字段key，这里设置之后，排序时的key值将以此为准，不再以column中的prop查询，此处不设置的话默认正常使用column的prop值。 非必填
    associatedQueryColumnProp: [ //需要变动的列搜索数据的prop。  当前值变动时，需要有其它列搜索，根据此列的值变动重新获取列搜索数据。 非必填
      {
        refreshKey: 'regionName', // refreshKey当前列值变动后要刷新的列的key
        searchKey: "regionName", // 刷新列的数据源接口重新请求后要变动的参数值的key，将当前列的搜索条件返回值赋给刷新列的参数key例如 {regionName: xxx(当前列的值)}
        dsfds: '13', // 其它的参数，可以自定义key、value
        asdjjhads: '其他的参数' // 其它的参数，可以自定义key、value
      },
    ],
    sort: false, // 是否需要排序，默认需要排序true，   false隐藏排序  非必填
  },
 * @param {showColumnSearchConfig.xxx} xxx其他暂时未用到太多，可以通过此种方式自己引入，绑定
 */

export default {
  name: "LbColumn",
  props: {
    column: Object,
    headerAlign: String,
    align: String,
    initForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    LbRender,
  },
  data() {
    return {
      randomKey: Math.random(),
      activeName: "second",
      selectList: [], // select的 接口数据源
      searchForm: {
        defaultValue: "", // 默认值，不会被重置清空
        sort: "", // 排序 降序desc,  升序asc
        value: "", // 筛选条件的关键字 文本 'xxxxx'  日期选择[]  复选框数组[]  单选框"xxxx"
        columnKey: "", // 当前列的key，如果是日期类型，需要拼接Str，例如 createTimeStr
        type: "", // 传入的showColumnSearchConfig.type，这里主要是用于日期列的特殊处理，需要转换成两个字段，例如 startTime列 转换为startTimeMin、startTimeMax
        valueText: "", // value转换的文本，快捷清理时的文本展示，除此外无其它作用
        // specifySearchKey: '', // 指定的搜索字段key，这里设置之后，搜索时的key值将以此为准，不再以column中的prop查询，此处不设置的话默认正常使用column的prop值。 非必填
        specifySortKey: "", // 指定的排序字段key，这里设置之后，排序时的key值将以此为准，不再以column中的prop查询，此处不设置的话默认正常使用column的prop值。 非必填
        columnProp: "", // 列中定义的prop值
        associatedQueryColumnProp: [], // 需要变动的列搜索数据的prop。  当前值变动时，需要有其它列搜索，根据此列的值变动重新获取列搜索数据。
      },
      searchFormConfirmed: {
        // 这是点击搜索后的搜索数据，用于 图标的判断显示，和点击search()方法时的searchForm对象一致
        defaultValue: "", // 默认值，不会被重置清空
        sort: "", // 排序 降序desc,  升序asc
        value: "", // 筛选条件的关键字 文本 'xxxxx'  日期选择[]  复选框数组[]  单选框"xxxx"
        columnKey: "", // 当前列的key，如果是日期类型，需要拼接Str，例如 createTimeStr
        type: "", // 传入的showColumnSearchConfig.type，这里主要是用于日期列的特殊处理，需要转换成两个字段，例如 startTime列 转换为startTimeMin、startTimeMax
        // specifySearchKey: '', // 指定的搜索字段key，这里设置之后，搜索时的key值将以此为准，不再以column中的prop查询，此处不设置的话默认正常使用column的prop值。 非必填
        specifySortKey: "", // 指定的排序字段key，这里设置之后，排序时的key值将以此为准，不再以column中的prop查询，此处不设置的话默认正常使用column的prop值。 非必填
        columnProp: "", // 列中定义的prop值
        // associatedQueryColumnProp: [], // 需要变动的列搜索数据的prop。  当前值变动时，需要有其它列搜索，根据此列的值变动重新获取列搜索数据。
      },
      columnSearchConfig: {}, // 列搜索配置
      checkAll: false, // 多选checkbox全选
      keywordSearchInputShow: false, // 为了解决 input的焦点获取问题
      columnSearchBtnRef: null, // 搜索icon的ref对象，用于ele-table触发点击事件
      columnSearchBtnUuidv4: null, // 生成uuid
      showColumnSearch: false, // 是否有列搜索
      checkboxFocusVal1: "", // checkbox复选框上面的选项获取焦点，用于监听回车
      checkboxFocusVal2: "", // checkbox复选框上面的选项获取焦点，用于监听回车
      checkboxFocusVal3: "", // checkbox复选框上面的选项获取焦点，用于监听回车
    };
  },
  computed: {
    // 获取当语言,方便根据字符计算列宽
    lang() {
      // 一个汉字13px   一个字母平均9.x个px
      let language = this.$store.getters.language;
      return language == "cn" ? 13 : 9;
    },
  },
  created() {
    this.columnSearchBtnUuidv4 = uuidv4(); // 生成uuid
  },
  methods: {
    /**
     * @description tree树搜索点击赋值
     */
    handleTreeNodeClick(data) {
      const val = [];
      let checkList = this.$refs.treeSearch.getCheckedNodes();
      checkList.forEach((item) => {
        val.push(
          this.column.optionProp
            ? item[this.column.optionProp.value]
            : item.value
        );
      });
      this.searchForm.value = val;
      this.valueChange(checkList, "tree");
    },

    /**
     * @description 列搜索回车监听
     @keyup.enter.native="handleEnter"
     */
    handleEnter(event) {
      if (event.keyCode === 13) {
        // 回车键被按下
        this.search();
      }
    },

    /**
     * @description 快捷重置单项
     */
    fastReset(refresh = true) {
      this.searchForm.valueText = Array.isArray(this.searchForm.valueText)
        ? []
        : "";
      let resetVal = Array.isArray(this.searchForm.value) ? [] : "";
      resetVal = this.searchForm.defaultValue
        ? this.searchForm.defaultValue
        : resetVal;
      this.searchForm.value = resetVal;

      // 树清理选中项
      if (this.searchForm.type == "tree") {
        this.$refs.treeSearch.setCheckedKeys(resetVal);
      }

      this.valueChange(resetVal, this.searchForm.type);
      this.search(refresh)
    },

    /**
     * @description 将searchForm.value 转换为 valueText用于快捷清空的显示
     */
    valueChange(val, type) {
      // 当前值变动时，需要有其它列搜索，根据此列的值变动重新获取列搜索数据。执行此方法
      if (
        this.searchForm.associatedQueryColumnProp &&
        this.searchForm.associatedQueryColumnProp.length > 0
      ) {
        this.$emit("column-value-change", this.searchForm);
      }

      this.searchForm.valueText = "";
      if (type == "input") {
        this.searchForm.valueText = val;
      } else if (
        type == "date" ||
        type == "datePicker" ||
        type == "dateTimePicker"
      ) {
        this.searchForm.valueText =
          val != "" && Array.isArray(val) ? val.join() : "";
      } else if (type == "radio") {
        const obj = this.selectList.filter((item) => {
          return (
            (this.column.optionProp
              ? item[this.column.optionProp.value]
              : item.value) == val
          );
        });
        if (obj.length > 0) {
          this.searchForm.valueText = this.column.optionProp
            ? obj[0][this.column.optionProp.label]
            : obj[0].label;
        }
      } else if (type == "checkbox") {
        const valueText = [];
        let valList = val != "" && Array.isArray(val) ? val : [];
        this.selectList.forEach((item) => {
          if (
            valList.includes(
              this.column.optionProp
                ? item[this.column.optionProp.value]
                : item.value
            )
          ) {
            valueText.push(
              this.column.optionProp
                ? item[this.column.optionProp.label]
                : item.label
            );
          }
        });

        this.searchForm.valueText = valueText.join();
      } else if (type == "tree") {
        const valueText = [];
        let valList = val != "" && Array.isArray(val) ? val : [];
        valList.forEach((item) => {
          valueText.push(
            this.column.optionProp
              ? item[this.column.optionProp.label]
              : item.label
          );
        });

        this.searchForm.valueText = valueText.join();
      } else if (type == "number") {
        // 数字范围，需要初始化掉数组中的undefined默认值
        const newArray = [];
        if (
          this.searchForm.value != "" &&
          Array.isArray(this.searchForm.value)
        ) {
          this.searchForm.value.forEach((item) => {
            if (item != undefined) {
              newArray.push(item);
            }
          });
        }

        this.searchForm.value = newArray.length == 0 ? newArray : this.searchForm.value;
        this.searchForm.valueText = newArray.length > 0 ? newArray.join() : "";
      }
    },

    /**
     * @description 关键字模糊搜索，输入框自动获取焦点
     */
    keywordSearcFocus() {
      // 关键字输入框 自动获取焦点
      if (this.searchForm.type == "input") {
        this.keywordSearchInputShow = true;
        setTimeout(() => {
          this.$nextTick(() => {
            if (
              document.getElementsByClassName("keyword-search-input").length > 0
            ) {
              document
                .getElementsByClassName("keyword-search-input")
                [
                  document.getElementsByClassName("keyword-search-input")
                    .length - 1
                ].getElementsByClassName("el-input__inner")[0]
                .focus();
            }
          });
        }, 300);
      }
    },

    /**
     * @description 全选、清空
     */
    handleCheckAllChange(boolean) {
      const list = [];
      if (boolean) {
        this.selectList.forEach((item) => {
          list.push(
            this.column.optionProp
              ? item[this.column.optionProp.value]
              : item.value
          );
        });
      }
      this.searchForm.value = list;

      this.valueChange(list, "checkbox");
    },

    /**
     * @description 反选
     */
    handleCheckInvertChange() {
      this.searchForm.value = Array.isArray(this.searchForm.value)
        ? this.searchForm.value
        : [];
      const list = [];
      this.selectList.forEach((item) => {
        const val = this.column.optionProp
          ? item[this.column.optionProp.value]
          : item.value;
        if (!this.searchForm.value.includes(val)) {
          list.push(val);
        }
      });
      this.searchForm.value = list;

      this.valueChange(list, "checkbox");
    },

    /**
     * @description 重置
     */
    reset(key) {
      if (key == "second") {
        this.searchForm.valueText = Array.isArray(this.searchForm.valueText)
          ? []
          : "";
        this.searchForm.sort = "";
        // this.searchForm.field = ''
        let resetVal = Array.isArray(this.searchForm.value) ? [] : "";
        resetVal = this.searchForm.defaultValue
          ? this.searchForm.defaultValue
          : resetVal;
        this.searchForm.value = resetVal;

        // 树清理选中项
        if (this.searchForm.type == "tree") {
          this.$refs.treeSearch.setCheckedKeys(resetVal);
        }
      }

      this.valueChange(this.searchForm.value, this.searchForm.type);
      this.search();
    },

    /**
     * @description 每列header上的自定义搜索 点击搜索
     */
    search(refresh = true) {
      const dateList = ["timePicker", "datePicker", "dateTimePicker", "number"];
      const searchForm = this.searchForm; //  JSON.parse(JSON.stringify(this.searchForm));
      if (searchForm.type == 'number') {
        // 数字范围，需要初始化掉数组中的undefined默认值
        const newArray = [];
        if (searchForm.value != "" && Array.isArray(searchForm.value)) {
          searchForm.value.forEach((item) => {
            if (item != undefined) {
              newArray.push(item);
            }
          });
        }
        searchForm.value = newArray.length == 0 ? newArray : searchForm.value;
      }

      let params = {
        [searchForm.columnKey]: Array.isArray(searchForm.value)
          ? searchForm.value.join()
          : searchForm.value,
        sort: searchForm.sort,
        field: searchForm.specifySortKey || searchForm.columnProp, // 这里的columnProp就是列原本的columnKey，这里是防止columnKey搜索条件被指定新字段，
      };
      if (
        dateList.includes(searchForm.type) &&
        Array.isArray(searchForm.value) &&
        searchForm.value.length >= 0
      ) {
        const min = searchForm.columnKey + "Min";
        const max = searchForm.columnKey + "Max";
        params = {
          [min]: searchForm.value[0] !== undefined ? searchForm.value[0] : '',
          [max]: searchForm.value[1] !== undefined ? searchForm.value[1] : '',
          sort: searchForm.sort,
          field: searchForm.specifySortKey || searchForm.columnProp, // 这里的columnProp就是列原本的columnKey，这里是防止columnKey搜索条件被指定新字段，
        };
      }

      this.columnSearchBtnRef = this.$refs.columnSearchBtnRef; // 存储搜索icon的ref对象，用于ele-table触发点击事件
      this.searchFormConfirmed = JSON.parse(JSON.stringify(this.searchForm));
      this.$emit('column-search', params, refresh)

      if (refresh) {
        // 模拟点击，隐藏弹窗
        document.getElementById('appPage').click()
      }
    },

    // 设置列宽度,为了适应国际化在一行上展示
    getWidth(width = 0, label) {
      if (width && label) {
        let count = this.lang * label.length + 30;
        return count > width && width * 2.6 > count ? count : width; //加上2个文字长度
      } else {
        return undefined;
      }
    },

    /**
     * @description 刷新column的option
     */
    async refreshColumnOption(data) {
      // columnSearchConfig中的option配置下拉菜单，用于列搜索
      if (this.columnSearchConfig && this.columnSearchConfig.option) {
        const params = {};
        data.associatedQueryColumnProp.forEach((item) => {
          if (item.refreshKey == this.column.prop) {
            this.fastReset(false) // 联动后要清理已选中的值，但是不触发刷新
            for (let key in item) {
              if (key == "refreshKey") {
              } else if (key == "searchKey") {
                params[item[key]] = data.value;
              } else {
                params[key] = item[key];
              }
            }
          }
        });
        let selectList = await this.columnSearchConfig.option(params);
        this.selectList = selectList; // this.columnSearchConfig.option;
      } else if (this.columnSearchConfig && this.column && this.column.option) {
        const params = {};
        data.associatedQueryColumnProp.forEach((item) => {
          if (item.refreshKey == this.column.prop) {
            this.fastReset(false) // 联动后要清理已选中的值，但是不触发刷新
            for (let key in item) {
              if (key == "refreshKey") {
              } else if (key == "searchKey") {
                params[item[key]] = data.value;
              } else {
                params[key] = item[key];
              }
            }
          }
        });
        let selectList = await this.column.option(params);
        this.selectList = selectList; // this.columnSearchConfig.option;
      }
    },

    async setColumn() {
      // 如果开启了列搜索，但是没有设置列搜索配置，默认追加showColumnSearchConfig = {}
      let columnSearchConfig = {}
      this.showColumnSearch = !!this.column.showColumnSearch
      if (this.column.showColumnSearch) {
        columnSearchConfig = this.column.showColumnSearchConfig ? this.column.showColumnSearchConfig : {}
        this.column.sortable = false // 如果开了列搜索，就删掉原本的sortable搜索
      }

      // 设置当前列的接口对应字段key值，用于接口搜索，
      this.searchForm.columnKey = columnSearchConfig.specifySearchKey || this.column.prop
      this.searchForm.columnProp = this.column.prop
      this.searchForm.specifySortKey = columnSearchConfig.specifySortKey || this.column.prop
      // this.searchForm.specifySearchKey = columnSearchConfig.specifySearchKey || "";
      this.searchForm.type = columnSearchConfig.type || 'input'
      let searchFormVal = !columnSearchConfig.type || columnSearchConfig.type == 'input' || columnSearchConfig.type == 'radio' ? '' : []
      // 设置默认值
      searchFormVal = JSON.parse(JSON.stringify(columnSearchConfig)).defaultValue ? JSON.parse(JSON.stringify(columnSearchConfig)).defaultValue : searchFormVal
      // 设置value值
      searchFormVal = columnSearchConfig.value ? columnSearchConfig.value : searchFormVal
      // 设置initForm传入的值
      if (this.initForm && this.showColumnSearch) {
        for (let key in this.initForm) {
          if (key == this.column.prop) {
            searchFormVal = this.initForm[key] || searchFormVal
          }
        }
      }

      this.searchForm.associatedQueryColumnProp = columnSearchConfig.associatedQueryColumnProp || []
      this.searchForm.value = searchFormVal
      this.searchForm.defaultValue = this.initForm[this.column.prop] ? this.initForm[this.column.prop] : JSON.parse(JSON.stringify(columnSearchConfig)).defaultValue ? JSON.parse(JSON.stringify(columnSearchConfig)).defaultValue : undefined
      this.columnSearchConfig = columnSearchConfig

      if (this.column.type) {
        this.column.renderHeader = forced[this.column.type].renderHeader
        this.column.render = this.column.render || forced[this.column.type].renderCell
      }
      if (this.column.formatter) {
        this.column.render = (h, scope) => {
          return <span>{scope.column.formatter(scope.row, scope.column, scope.row, scope.$index)}</span>
        }
      }
      if (!this.column.render) {
        // 判断是否有字典接口
        if (this.column.option) {
          let selectList = await this.column.option()
          this.selectList = selectList

          if (this.column.optionProp) {
            selectList = selectList.map((val) => {
              return {
                label: val[this.column.optionProp.label || 'label'],
                value: val[this.column.optionProp.value || 'value'],
                color: val[this.column.optionProp.color || 'color'] || ''
              }
            })
          }
          this.$nextTick(() => {
            this.randomKey = Math.random()
          })
          this.column.render = (h, scope) => {
            const text = selectList.find((val) => val.value == scope.row[scope.column.property]) || {}

            if (this.column.component) {
              const { component } = this.column

              if (component === 'el-select') {
                return this.getSelect(h, scope, selectList)
              }
            } else {
              const classObj = {
                'status-simulate-tags': !!text.color // 必须要配置了颜色值的才可以
              }
              const styleObj = {
                background: text.color || ''
              }

              return (
                <span class={classObj} style={styleObj}>
                  {text ? text.label || this.column?.default || '' : ''}
                </span>
              )
            }
          }
        } else {
          this.column.render = (h, scope) => {
            const { attrs = {}, style = {}, component, change } = this.column
            const selectAttrs = typeof attrs === 'function' ? attrs(scope) : attrs
            // === "el-input"
            if (component) {
              return <component onChange={(val) => this.handleChange(val, scope, change)} {...{ attrs: selectAttrs, style }} v-model={scope.row[scope.column.property]} />
            } else {
              return <span>{scope.row[scope.column.property]}</span>
            }
          }

          // columnSearchConfig中的option配置下拉菜单，用于列搜索
          if (this.columnSearchConfig && this.columnSearchConfig.option) {
            let selectList = await this.columnSearchConfig.option()
            this.selectList = selectList // this.columnSearchConfig.option;
          }
        }
      } else {
        // 获取option赋值给selectlist
        if (this.columnSearchConfig && this.columnSearchConfig.option) {
          let selectList = await this.columnSearchConfig.option()
          this.selectList = selectList // this.columnSearchConfig.option;
        }
      }

      // this.$nextTick(() => {
      // 这里赋值，是因为存在默认值的情况下应该高亮搜索
      this.searchFormConfirmed = JSON.parse(JSON.stringify(this.searchForm))
      this.columnSearchBtnRef = this.$refs.columnSearchBtnRef
      // 树赋值
      if (this.searchForm.type == 'tree') {
        this.$refs.treeSearch.setCheckedKeys(searchFormVal)
        this.$nextTick(() => {
          let checkList = this.$refs.treeSearch.getCheckedNodes()
          this.valueChange(checkList, 'tree')
        })
      } else {
        this.valueChange(searchFormVal, this.searchForm.type.indexOf('date') != -1 ? 'date' : this.searchForm.type) // 设置默认显示搜索文本
      }
      // });
    },
    getSelect(h, scope, list) {
      const { attrs = {}, style = {}, change } = this.column;
      const selectAttrs = typeof attrs === "function" ? attrs(scope) : attrs;

      return (
        <el-select
          {...{ attrs: selectAttrs, style }}
          onChange={(val) => this.handleChange(val, scope, change)}
          v-model={scope.row[scope.column.property]}
          placeholder={`${$i18n.t("common.select")} ${scope.column.label}`}
        >
          {list.map((item) => {
            return (
              <el-option
                key={item.value}
                label={item.label}
                value={item.value}
              ></el-option>
            );
          })}
        </el-select>
      );
    },
    handleChange(val, scope, change) {
      if (change) change(val, scope);
    },
  },
  watch: {
    column: {
      handler() {
        this.setColumn();
      },
      immediate: true,
    },
    initForm: {
      handler(val) {
        this.setColumn()
      },
      deep: true
    }
  },
};
</script>

<style lang="scss" scoped>
/* 新ui规范中的状态标签定义*/
.status-simulate-tags {
  display: inline-block;
  // min-width: 40px;
  height: 24px;
  padding: 0 8px;
  background: #3C7FCD;
  border-radius: 2px 2px 2px 2px;
  font-weight: 400;
  font-size: 12px;
  color: #FFFFFF;
  line-height: 24px;
}

.column-search-popover {
  padding-top: 0;
}

.column-search-block {
  font-size: 12px;

  h4 {
    margin-bottom: 10px;
  }

  .flex {
    display: flex;

    i {
      margin-right: 2px;
      font-size: 14px;
    }
  }

  .align-items-center {
    align-items: center;
  }

  .align-items-flex-start {
    align-items: flex-start;
  }

  .flex-shrink0 {
    flex-shrink: 0;
  }

  .flex-grow1 {
    flex-grow: 1;
  }

  .margin-top10 {
    margin-top: 10px;
  }

  .column-search-label {
    // max-width: 120px;
    // margin-right: 6px;
    line-height: 28px;
  }

  .selected-btn {
    height: 28px;
    margin-right: 12px;

    .el-checkbox {
      display: flex;
      align-items: center;
      width: auto;

      /deep/.el-checkbox__inner {
        display: none;
      }

      /deep/.el-checkbox__label {
        display: flex;
        align-items: center;
        padding-left: 0;
      }
    }

    img {
      display: block;
      width: 16px;
      margin-right: 5px;
    }

    .img-hover {
      display: none;
    }

    &:hover {
      color: #3c7fcd;
      cursor: pointer;

      .img-hover {
        display: block;
      }

      .img-default {
        display: none;
      }
    }
  }

  .column-search-li {
    margin-bottom: 6px;

    .el-switch,
    .el-select,
    .el-input {
      margin-right: 6px;
    }

    // .huo,
    // .yu {
    //   position: absolute;
    //   z-index: 1;
    //   color: #ffffff;
    // }

    // .huo {
    //   right: 10px;
    //   line-height: 20px;
    // }

    // .yu {
    //   left: 4px;
    //   line-height: 20px;
    // }

    /deep/.el-switch {
      // .el-switch__core {
      // width: 65px !important;
      // }

      .el-switch__label--left {
        position: absolute;
        left: 20px;
        color: #fff;
        z-index: -1111;
        user-select: none;
        cursor: pointer;
      }

      .el-switch__label--right {
        position: absolute;
        right: 20px;
        color: #fff;
        z-index: -1111;
        user-select: none;
        cursor: pointer;
      }

      .el-switch__label--right.is-active {
        z-index: 1111;
        color: #fff !important;
      }

      .el-switch__label--left.is-active {
        z-index: 1111;
        color: #fff !important;
      }
    }
  }

  .position-relative {
    position: relative;
  }

  /deep/.el-tabs {
    .el-tabs__item {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      padding: 0 10px;
    }

    .el-tabs__header {
      margin-bottom: 0;
    }

    .el-tabs__content {
      border: 1px solid #e4e7ed;
      border-top: 0;
      padding: 15px 10px 15px 10px;
    }
  }

  .el-checkbox-group,
  .el-radio-group,
  .el-tree {
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 2px;

    .el-checkbox,
    .el-radio {
      width: 100%;
      margin: 0 0 5px 0;
    }
  }

  .el-radio {
    width: 192px;
  }

  .operate-btn {
    .el-icon-delete {
      color: red;
      margin-left: 3px;
      cursor: pointer;
    }

    .text-value {
      display: block;
      max-width: 80px; /* 或者 max-width，根据你的需求 */
      white-space: nowrap; /* 防止文本换行 */
      overflow: hidden; /* 隐藏溢出的内容 */
      text-overflow: ellipsis; /* 显示省略号来代表被截断的文本 */
    }
  }

  .custom-tree-node {
    .el-radio {
      margin-bottom: 0;

      /deep/.el-radio__label {
        padding: 0;
      }
    }
  }
}

.column-search-btn {
  width: 13px;
  display: block;
  margin: 0;
  padding-left: 2px;
  // margin: 0;
  cursor: pointer;
}

.column-search-btn-row {
  // display: flex;
  // align-items: center;

  span:first-of-type {
    display: inline-block;
    // max-width: calc(100% - 13px);
  }

  /deep/.el-popover__reference-wrapper {
    vertical-align: middle;
    // margin-left: 2px;
  }
}
</style>
