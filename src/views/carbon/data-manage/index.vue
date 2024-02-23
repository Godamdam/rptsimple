<template>
  <div class="container">
    <Breadcrumb :items="['menu.carbon', 'menu.carbon.dataManage']" />
    <a-card class="general-card" :title="$t('menu.carbon.dataManage')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="produtor"
                  :label="$t('searchTable.form.productor')"
                >
                  <a-select
                    v-model="formModel.productor"
                    :options="productorOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="line" :label="$t('searchTable.form.line')">
                  <a-select
                    v-model="formModel.line"
                    :options="lineOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="index"
                  :label="$t('searchTable.form.index')"
                >
                  <a-input
                    v-model="formModel.index"
                    :placeholder="$t('searchTable.form.index.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="rangeTime"
                  :label="$t('searchTable.form.rangeTime')"
                >
                  <a-range-picker
                    v-model="formModel.rangeTime"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('searchTable.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleClick">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('searchTable.operation.import') }}
                </a-button>
              </template>
            </a-upload>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('searchTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="
                          handleChange($event, item as TableColumnData, index)
                        "
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="index"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        :scroll="{ x: '120%' }"
        @page-change="onPageChange"
      >
        <template #status="{ record }">
          <span v-if="record.status === 'offline'" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`searchTable.form.status.${record.status}`) }}
        </template>
        <template #productor="{ record }">
          {{ $t(`server.global.productor.${record.productor}`) }}
        </template>
        <template #operations="{ record }">
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="handleUpdateClick(record)"
          >
            {{ $t('searchTable.columns.operations.view') }}
          </a-button>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="visible"
      title="碳排放填报"
      title-align="start"
      :width="1000"
      :closable="false"
      @cancel="handleCancel"
      @ok="createOneCarbon"
    >
      <a-form
        :model="createForm"
        :rules="rules"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
      >
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="produtor"
              :label="$t('searchTable.form.productor')"
            >
              <a-select
                v-model="createForm.productor"
                :options="productorOptions"
                :placeholder="$t('searchTable.form.selectDefault')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item field="line" :label="$t('searchTable.form.line')">
              <a-select
                v-model="createForm.line"
                :options="clineOptions"
                :placeholder="$t('searchTable.form.selectDefault')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="createdTime"
              :label="$t('searchTable.form.createdTime')"
            >
              <a-date-picker
                v-model="createForm.createdTime"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="emissions"
              :label="$t('searchTable.form.emissions')"
            >
              <a-input
                v-model="createForm.emissions"
                :placeholder="$t('searchTable.form.emissions.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="processEmissions"
              :label="$t('searchTable.form.processEmissions')"
            >
              <a-input
                v-model="createForm.processEmissions"
                :placeholder="
                  $t('searchTable.form.processEmissions.placeholder')
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="powerConsumption"
              :label="$t('searchTable.form.powerConsumption')"
            >
              <a-input
                v-model="createForm.powerConsumption"
                :placeholder="
                  $t('searchTable.form.powerConsumption.placeholder')
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="purchasedPower"
              :label="$t('searchTable.form.purchasedPower')"
            >
              <a-input
                v-model="createForm.purchasedPower"
                :placeholder="$t('searchTable.form.purchasedPower.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="powerGeneration"
              :label="$t('searchTable.form.powerGeneration')"
            >
              <a-input
                v-model="createForm.powerGeneration"
                :placeholder="
                  $t('searchTable.form.powerGeneration.placeholder')
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="PVPowerGeneration"
              :label="$t('searchTable.form.PVPowerGeneration')"
            >
              <a-input
                v-model="createForm.PVPowerGeneration"
                :placeholder="
                  $t('searchTable.form.PVPowerGeneration.placeholder')
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item field="output" :label="$t('searchTable.form.output')">
              <a-input
                v-model="createForm.output"
                :placeholder="$t('searchTable.form.output.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
      </a-form>
    </a-modal>
    <!-- 碳排放修改 -->
    <a-modal
      v-model:visible="uVisible"
      title="碳排放修改"
      title-align="start"
      :width="1000"
      :closable="false"
      @cancel="handleUpdateCancel"
      @ok="updateOneCarbon"
    >
      <a-form
        :model="updateForm"
        :rules="rules"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
      >
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="produtor"
              :label="$t('searchTable.form.productor')"
            >
              <a-select
                v-model="updateForm.productor"
                :options="productorOptions"
                :placeholder="$t('searchTable.form.selectDefault')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item field="line" :label="$t('searchTable.form.line')">
              <a-select
                v-model="updateForm.line"
                :options="clineOptions"
                :placeholder="$t('searchTable.form.selectDefault')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="createdTime"
              :label="$t('searchTable.form.createdTime')"
            >
              <a-date-picker
                v-model="updateForm.createdTime"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="emissions"
              :label="$t('searchTable.form.emissions')"
            >
              <a-input
                v-model="updateForm.emissions"
                :placeholder="$t('searchTable.form.emissions.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="processEmissions"
              :label="$t('searchTable.form.processEmissions')"
            >
              <a-input
                v-model="updateForm.processEmissions"
                :placeholder="
                  $t('searchTable.form.processEmissions.placeholder')
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="powerConsumption"
              :label="$t('searchTable.form.powerConsumption')"
            >
              <a-input
                v-model="updateForm.powerConsumption"
                :placeholder="
                  $t('searchTable.form.powerConsumption.placeholder')
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="purchasedPower"
              :label="$t('searchTable.form.purchasedPower')"
            >
              <a-input
                v-model="updateForm.purchasedPower"
                :placeholder="$t('searchTable.form.purchasedPower.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="powerGeneration"
              :label="$t('searchTable.form.powerGeneration')"
            >
              <a-input
                v-model="updateForm.powerGeneration"
                :placeholder="
                  $t('searchTable.form.powerGeneration.placeholder')
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item
              field="PVPowerGeneration"
              :label="$t('searchTable.form.PVPowerGeneration')"
            >
              <a-input
                v-model="updateForm.PVPowerGeneration"
                :placeholder="
                  $t('searchTable.form.PVPowerGeneration.placeholder')
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6" />
          <a-col :span="12">
            <a-form-item field="output" :label="$t('searchTable.form.output')">
              <a-input
                v-model="updateForm.output"
                :placeholder="$t('searchTable.form.output.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" />
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  // emissions   processEmissions powerConsumption purchasedPower  powerGeneration  PVPowerGeneration output line productor createdTime
  import { computed, ref, reactive, watch, nextTick, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryCarbonList,
    CarbonRecord,
    CarbonParams,
    createCarbon,
    updateCarbon,
    lineOptionsMap,
  } from '@/api/dataManage';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  // import Sortable from 'sortablejs';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  // emissions   processEmissions powerConsumption purchasedPower  powerGeneration  PVPowerGeneration output line productor createdTime
  const generateFormModel = () => {
    return {
      index: '',
      emissions: '',
      processEmissions: '',
      powerConsumption: '',
      purchasedPower: '',
      powerGeneration: '',
      PVPowerGeneration: '',
      output: '',
      line: '',
      productor: '',
      status: '',
      createdTime: undefined,
      rangeTime: [] as (Date | string | number)[],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<CarbonRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  //   燃料燃烧排放 过程排放          总耗电量          购入电量        发电量            光伏发电量             产量   产线 生产单位   时间
  //   emissions   processEmissions powerConsumption purchasedPower  powerGeneration  PVPowerGenerationTime output line productor createdTime
  //  列设置
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('searchTable.columns.emissions'),
      dataIndex: 'emissions',
    },
    {
      title: t('searchTable.columns.processEmissions'),
      dataIndex: 'processEmissions',
    },
    {
      title: t('searchTable.columns.powerConsumption'),
      dataIndex: 'powerConsumption',
    },
    {
      title: t('searchTable.columns.powerGeneration'),
      dataIndex: 'powerGeneration',
    },
    {
      title: t('searchTable.columns.PVPowerGeneration'),
      dataIndex: 'PVPowerGeneration',
    },
    {
      title: t('searchTable.columns.purchasedPower'),
      dataIndex: 'purchasedPower',
    },
    {
      title: t('searchTable.columns.output'),
      dataIndex: 'output',
    },
    {
      title: t('searchTable.columns.line'),
      dataIndex: 'line',
    },
    {
      title: t('searchTable.columns.productor'),
      slotName: 'productor',
      dataIndex: 'productor',
    },
    {
      title: t('searchTable.columns.createdTime'),
      dataIndex: 'createdTime',
    },
    {
      title: t('searchTable.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      fixed: 'right',
    },
  ]);
  const productorOptions = [
    {
      label: t('server.global.productor.wnc'),
      value: 'wnc',
    },
    {
      label: t('server.global.productor.ysgs'),
      value: 'ysgs',
    },
    {
      label: t('server.global.productor.rjgs'),
      value: 'rjgs',
    },
    {
      label: t('server.global.productor.ydgs'),
      value: 'ydgs',
    },
    {
      label: t('server.global.productor.lpgs'),
      value: 'lpgs',
    },
    {
      label: t('server.global.productor.dags'),
      value: 'dags',
    },
  ];

  const clineOptions = ref(
    computed<SelectOptionData[]>(() => {
      return createForm.productor
        ? lineOptionsMap[createForm.productor] || []
        : [];
    })
  );
  const lineOptions = ref(
    computed<SelectOptionData[]>(() => {
      return formModel.value.productor
        ? lineOptionsMap[formModel.value.productor] || []
        : [];
    })
  );
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.status.online'),
      value: 'online',
    },
    {
      label: t('searchTable.form.status.offline'),
      value: 'offline',
    },
  ]);

  watchEffect(() => {
    // 更新 lineOptions 的值
    formModel.value.line = '';
    lineOptions.value = formModel.value.productor
      ? lineOptionsMap[formModel.value.productor] || []
      : [];
  });

  const fetchData = async (
    params: CarbonParams = {
      current: 1,
      pageSize: 20,
    }
  ) => {
    setLoading(true);
    try {
      // console.log('params.startTime:', params.startTime);
      const { data } = await queryCarbonList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // handle err
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    // console.log("formModel:",formModel);
    fetchData({
      ...basePagination,
      ...formModel.value,
      startTime: formModel.value.rangeTime[0],
      endTime: formModel.value.rangeTime[1],
    } as unknown as CarbonParams);
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  // 新建
  //   emissions   processEmissions powerConsumption purchasedPower  powerGeneration  PVPowerGeneration Time output line productor createdTime

  const visible = ref<boolean>(false);
  const createForm = reactive<CarbonRecord>({
    productor: '',
    line: '',
    createdTime: undefined,
    emissions: '',
    processEmissions: '',
    powerConsumption: '',
    purchasedPower: '',
    powerGeneration: '',
    PVPowerGeneration: '',
    output: '',
    index: '',
    status: '',
  });

  const postData = async (params: CarbonRecord[]) => {
    setLoading(true);
    try {
      // console.log('params.startTime:', params.startTime);
      const { data } = await createCarbon(params);
      if (data.created) {
        renderData.value = params.concat(renderData.value);
        pagination.total = renderData.value.length;
      }
    } catch (err) {
      // handle err
    } finally {
      setLoading(false);
    }
  };

  const createOneCarbon = () => {
    const params = [createForm];
    postData(params);
  };

  // 修改
  const uVisible = ref<boolean>(false);
  const updateForm = reactive<CarbonRecord>({
    productor: '',
    line: '',
    createdTime: undefined,
    emissions: '',
    processEmissions: '',
    powerConsumption: '',
    purchasedPower: '',
    powerGeneration: '',
    PVPowerGeneration: '',
    output: '',
    index: '',
    status: '',
  });

  const updateData = async (params: CarbonRecord[]) => {
    setLoading(true);
    try {
      // console.log('params.startTime:', params.startTime);
      const { data } = await updateCarbon(params);
      if (data.updated) {
        params.forEach((param) => {
          Object.assign(
            renderData.value.find((item) => item.index === param.index) || {},
            param
          );
        });
      }
    } catch (err) {
      // handle err
    } finally {
      setLoading(false);
    }
  };

  const updateOneCarbon = () => {
    const params = [updateForm];
    updateData(params);
  };

  const handleUpdateClick = (record: CarbonRecord) => {
    Object.assign(updateForm, record);
    uVisible.value = true;
  };

  const handleUpdateCancel = () => {
    visible.value = false;
  };

  watchEffect(() => {
    // 更新 clineOptions 的值
    createForm.line = '';
    clineOptions.value = createForm.productor
      ? lineOptionsMap[createForm.productor] || []
      : [];
  });

  const rules = {
    productor: [
      {
        required: true,
        message: 'password is required',
      },
      {
        validator: (value, cb) => {
          if (
            !productorOptions.value.some((option) => option.value === value)
          ) {
            cb('请选择生产单位');
          } else {
            cb();
          }
        },
      },
    ],
    line: [
      {
        required: true,
        message: '请选择产线',
      },
      {
        validator: (value, cb) => {
          if (!clineOptions.value.some((option) => option.value === value)) {
            cb('选择正确的产线');
          } else {
            cb();
          }
        },
      },
    ],
    createdTime: [
      {
        required: true,
        message: '请输入正确的时间',
      },
    ],
    emissions: [
      {
        required: true,
        message: '请输入正确的燃烧排放',
      },
    ],
    processEmissions: [
      {
        required: true,
        message: '请输入正确的过程排放',
      },
    ],
    powerConsumption: [
      {
        required: true,
        message: '请输入正确的总耗电',
      },
    ],
    purchasedPower: [
      {
        required: true,
        message: '请输入正确的购入电量',
      },
    ],
    powerGeneration: [
      {
        required: true,
        message: '请输入正确的余热发电量',
      },
    ],
    PVPowerGeneration: [
      {
        required: true,
        message: '请输入正确的光伏发电',
      },
    ],
    output: [
      {
        required: true,
        message: '请输入正确的熟料产量',
      },
    ],
  };
  const handleClick = () => {
    visible.value = true;
  };
  // const handleBeforeOk = () => {
  //   // console.log(form);
  // };
  const handleCancel = () => {
    visible.value = false;
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined
  ) => {
    size.value = val as SizeProps;
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
      });
    }
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
