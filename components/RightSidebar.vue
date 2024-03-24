<template>
  <div class="rightbar">
    <div class="rightbar-close-overlay" @click="closeGlobalSetting"></div>
    <div class="rightbar-settings">
      <div class="rightbar-close-setting" @click="closeGlobalSetting">
        <img src="@/assets/images/right-setting.png" alt="" />
      </div>
      <div class="rightbar-setting-border"></div>
      <div class="rightbar-setting-header">
        <h3>Table Configuration</h3>
      </div>
      <div class="rightbar-setting-border"></div>
      <div class="rightbar-content">
        <!--================================================-->
        <!--================================================-->
        <div class="accordion general-tab">
          <div class="accordion-item">
            <h2 class="accordion-header" id="generalHead">
              <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#general"
                aria-expanded="true" aria-controls="general">
                <span>{{ $t('General') }}</span>
                <elements-icon v-bind:icon="'downArowIcon'" />
              </button>
            </h2>
            <div id="general" class="accordion-collapse collapse show" aria-labelledby="generalHead"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <ul>
                  <li>
                    <p>{{ $t("Entries per page") }}</p>
                    <select name="" id="">
                      <option value="">10</option>
                      <option value="">20</option>
                      <option value="">30</option>
                    </select>
                  </li>
                  <li>
                    <p>{{ $t("Export CSV") }}</p>
                    <button><elements-icon v-bind:icon="'downloadIcon'" /></button>
                  </li>
                  <li>
                    <p>{{ $t("Export Latest CSV") }}</p>
                    <button><elements-icon v-bind:icon="'downloadIcon'" /></button>
                  </li>
                </ul>
                <div class="mt-3 d-flex align-items-center justify-content-end">
                  <button class="primary-btn me-3">
                    <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
                    <span>{{ $t("Cancel") }}</span>
                  </button>
                  <submittal-button :isLoading="submitted" :iconName="'finishIcon'" :buttonName="$t('Apply')" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--================================================-->
        <!--================================================-->
        <div class="accordion column-tab">
          <div class="accordion-item">
            <h2 class="accordion-header" id="ColumnsHead">
              <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#columns"
                aria-expanded="true" aria-controls="columns">
                <span>{{ $t('Columns') }}</span>
                <elements-icon v-bind:icon="'downArowIcon'" />
              </button>
            </h2>
            <div id="columns" class="accordion-collapse collapse show" aria-labelledby="ColumnsHead"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">

                <div class="form-group">
                  <elements-multiselect :options="columnOptions" label="name" track-by="value" :textLabel="$t('')"
                    placeholder="Add Columns" />
                </div>
                <div class="mt-3 d-flex align-items-center justify-content-end">
                  <button class="primary-btn me-3">
                    <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
                    <span>{{ $t("Cancel") }}</span>
                  </button>
                  <submittal-button :isLoading="submitted" :iconName="'finishIcon'" :buttonName="$t('Apply')" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--================================================-->
        <!--================================================-->
        <div class="accordion filters-tab">
          <div class="accordion-item">
            <h2 class="accordion-header" id="filtersHead">
              <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#filters"
                aria-expanded="true" aria-controls="filters">
                <span>{{ $t('Filters') }}</span>
                <elements-icon v-bind:icon="'downArowIcon'" />
              </button>
            </h2>
            <div id="filters" class="accordion-collapse collapse show" aria-labelledby="filtersHead"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <div class="d-flex align-items-center mb-3">
                  <label for="">Filter by text</label>
                  <input type="text" class="form-control">
                </div>
                <div class="d-flex align-items-center mb-3">
                  <label for="">Status</label>
                  <elements-multiselect :options="columnOptions" label="name" track-by="value" :textLabel="$t('')"
                    placeholder="Status" />
                </div>
                <div class="d-flex align-items-center">
                  <label for="">+ Add Filter</label>
                  <input type="text" class="form-control">
                </div>
                <div class="mt-3 d-flex align-items-center justify-content-end">
                  <button class="primary-btn me-3">
                    <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
                    <span>{{ $t("Cancel") }}</span>
                  </button>
                  <submittal-button :isLoading="submitted" :iconName="'finishIcon'" :buttonName="$t('Apply')" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--================================================-->
        <!--================================================-->
        <div class="accordion short-tab">
          <div class="accordion-item">
            <h2 class="accordion-header" id="shortHead">
              <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#short"
                aria-expanded="true" aria-controls="short">
                <span>{{ $t('Short By') }}</span>
                <elements-icon v-bind:icon="'downArowIcon'" />
              </button>
            </h2>
            <div id="short" class="accordion-collapse collapse show" aria-labelledby="shortHead"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <h4>Chose the mode to sort your Work packages:</h4>
                <div class=" mb-3">
                  <div class="checkbox-group mt-3">
                    <input type="checkbox" class="checkbox-input" id="Manually">
                    <label for="Manually" class="checkbox-label">Manually</label>
                  </div>
                  <div class="checkbox-group mt-3">
                    <input type="checkbox" class="checkbox-input" id="Automatic">
                    <label for="Automatic" class="checkbox-label">Automatic</label>
                  </div>
                </div>
                <h4>You will lose your previous sorting when activating the automatic sorting mode.</h4>
                <div class="row align-items-center mt-3 mb-3">
                  <div class="col-4">
                    <elements-multiselect :options="columnOptions" label="name" track-by="value" :textLabel="$t('')"
                      placeholder="ID" />
                  </div>
                  <div class="col-4">
                    <div class="checkbox-group">
                      <input type="checkbox" class="checkbox-input" id="Ascending">
                      <label for="Ascending" class="checkbox-label">Ascending</label>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="checkbox-group">
                      <input type="checkbox" class="checkbox-input" id="Descending">
                      <label for="Descending" class="checkbox-label">Descending</label>
                    </div>
                  </div>
                </div>
                <div class="row align-items-center mb-3">
                  <div class="col-4">
                    <elements-multiselect :options="columnOptions" label="name" track-by="value" :textLabel="$t('')"
                      placeholder="-" />
                  </div>
                  <div class="col-4">
                    <div class="checkbox-group">
                      <input type="checkbox" class="checkbox-input" id="Ascending">
                      <label for="Ascending" class="checkbox-label">Ascending</label>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="checkbox-group">
                      <input type="checkbox" class="checkbox-input" id="Descending">
                      <label for="Descending" class="checkbox-label">Descending</label>
                    </div>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col-4">
                    <elements-multiselect :options="columnOptions" label="name" track-by="value" :textLabel="$t('')"
                      placeholder="-" />
                  </div>
                  <div class="col-4">
                    <div class="checkbox-group">
                      <input type="checkbox" class="checkbox-input" id="Ascending">
                      <label for="Ascending" class="checkbox-label">Ascending</label>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="checkbox-group">
                      <input type="checkbox" class="checkbox-input" id="Descending">
                      <label for="Descending" class="checkbox-label">Descending</label>
                    </div>
                  </div>
                </div>
                <div class="mt-3 d-flex align-items-center justify-content-end">
                  <button class="primary-btn me-3">
                    <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
                    <span>{{ $t("Cancel") }}</span>
                  </button>
                  <submittal-button :isLoading="submitted" :iconName="'finishIcon'" :buttonName="$t('Apply')" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--================================================-->
        <!--================================================-->
        <div class="accordion display-tab">
          <div class="accordion-item">
            <h2 class="accordion-header" id="displayHead1">
              <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#display1"
                aria-expanded="true" aria-controls="display1">
                <span>{{ $t('Display Setting') }}</span>
                <elements-icon v-bind:icon="'downArowIcon'" />
              </button>
            </h2>
            <div id="display1" class="accordion-collapse collapse show" aria-labelledby="displayHead1"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <h4>Display work packages as</h4>
                <div class=" mb-3">
                  <div class="checkbox-group mt-3">
                    <input type="checkbox" class="checkbox-input" id="flatList">
                    <label for="flatList" class="checkbox-label">Flat list — default</label>
                  </div>
                  <div class="checkbox-group mt-3">
                    <input type="checkbox" class="checkbox-input" id="Hierarchy">
                    <label for="Hierarchy" class="checkbox-label">Hierarchy — All filtered table results will be
                      augmented with their ancestors. Hierarchies can
                      be expanded and collapsed.</label>
                  </div>
                </div>
                <p>You will lose your previous sorting when activating the
                  automatic sorting mode.</p>
                <div class="row align-items-center mt-3 mb-3">
                  <div class="col-4">
                    <div class="checkbox-group">
                      <input type="checkbox" class="checkbox-input" id="Group">
                      <label for="Group" class="checkbox-label">Group by</label>
                    </div>
                  </div>
                  <div class="col-8">
                    <elements-multiselect :options="columnOptions" label="name" track-by="value" :textLabel="$t('')"
                      placeholder="Accountable" />
                  </div>
                </div>
                <div class="divider mb-3"></div>
                <div class="checkbox-group mt-3">
                  <input type="checkbox" class="checkbox-input" id="Display">
                  <label for="Display" class="checkbox-label">Display Sums — Display sums of all summable
                    attributes in a row below the table results.</label>
                </div>

                <div class="mt-3 d-flex align-items-center justify-content-end">
                  <button class="primary-btn me-3">
                    <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
                    <span>{{ $t("Cancel") }}</span>
                  </button>
                  <submittal-button :isLoading="submitted" :iconName="'finishIcon'" :buttonName="$t('Apply')" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--================================================-->
        <!--================================================-->
        <div class="accordion display-tab">
          <div class="accordion-item">
            <h2 class="accordion-header" id="displayHead2">
              <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#display2"
                aria-expanded="true" aria-controls="display2">
                <span>{{ $t('Display Setting') }}</span>
                <elements-icon v-bind:icon="'downArowIcon'" />
              </button>
            </h2>
            <div id="display2" class="accordion-collapse collapse show" aria-labelledby="displayHead2"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <h4>Highlight with color</h4>
                <div class="row align-items-center mt-4 mb-3">
                  <div class="col-6">
                    <div class="checkbox-group">
                      <input type="checkbox" class="checkbox-input" id="flatList">
                      <label for="flatList" class="checkbox-label">Highlighted attribute(s)</label>
                    </div>
                  </div>
                  <div class="col-6">
                    <elements-multiselect :options="columnOptions" label="name" track-by="value" :textLabel="$t('')"
                      placeholder="Accountable" />
                  </div>
                </div>
                <div class="row align-items-center mb-3">
                  <div class="col-6">
                    <div class="checkbox-group">
                      <input type="checkbox" class="checkbox-input" id="flatList">
                      <label for="flatList" class="checkbox-label">Entire row by</label>
                    </div>
                  </div>
                  <div class="col-6">
                    <elements-multiselect :options="columnOptions" label="name" track-by="value" :textLabel="$t('')"
                      placeholder="Status" />
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col-12">
                    <div class="checkbox-group">
                      <input type="checkbox" class="checkbox-input" id="flatList">
                      <label for="flatList" class="checkbox-label">No highlighting</label>
                    </div>
                  </div>
                </div>

                <div class="mt-3 d-flex align-items-center justify-content-end">
                  <button class="primary-btn me-3">
                    <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
                    <span>{{ $t("Cancel") }}</span>
                  </button>
                  <submittal-button :isLoading="submitted" :iconName="'finishIcon'" :buttonName="$t('Apply')" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--================================================-->
        <!--================================================-->
        <div class="accordion chart-tab">
          <div class="accordion-item">
            <h2 class="accordion-header" id="charthead">
              <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#chart"
                aria-expanded="true" aria-controls="chart">
                <span>{{ $t('Grantt Chart') }}</span>
                <elements-icon v-bind:icon="'downArowIcon'" />
              </button>
            </h2>
            <div id="chart" class="accordion-collapse collapse show" aria-labelledby="charthead"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <h4>Show Gantt chart</h4>
                <div class="row align-items-center mt-4 mb-3">
                  <div class="col-12">
                    <div class="checkbox-group">
                      <input type="checkbox" class="checkbox-input" id="flatList">
                      <label for="flatList" class="checkbox-label">Show an interactive gantt chart on the right side of
                        the table. You can change its width by dragging the
                        divider between table and gantt chart.</label>
                    </div>
                  </div>
                </div>
                <div class="divider mb-3"></div>
                <h4 class="mb-3">Zoom Level</h4>
                <p>Select the initial zoom level that should be shown when
                  autozoom is not available.</p>

                <div class="row mb-3 mt-3">
                  <div class="col-6">
                    <elements-multiselect :options="columnOptions" label="name" track-by="value" :textLabel="$t('')"
                      placeholder="Auto Zoom" />
                  </div>
                </div>
                <div class="divider mb-3"></div>
                <h4 class="mb-3">Label Configuration</h4>
                <p>Select the attributes you want to be shown in the
                  respective positions of the Gantt chart at all times. Note
                  that when hovering an element, its date labels will be
                  shown instead of these attributes.</p>
                <div class="row align-items-center mt-3 mb-3">
                  <div class="col-4">
                    <label for="">Left</label>
                  </div>
                  <div class="col-8">
                    <elements-multiselect :options="columnOptions" label="name" track-by="value" :textLabel="$t('')"
                      placeholder="None" />
                  </div>
                </div>
                <div class="row align-items-center mb-3">
                  <div class="col-4">
                    <label for="">Right</label>
                  </div>
                  <div class="col-8">
                    <elements-multiselect :options="columnOptions" label="name" track-by="value" :textLabel="$t('')"
                      placeholder="None" />
                  </div>
                </div>
                <div class="row align-items-center mb-3">
                  <div class="col-4">
                    <label for="">Far Right</label>
                  </div>
                  <div class="col-8">
                    <elements-multiselect :options="columnOptions" label="name" track-by="value" :textLabel="$t('')"
                      placeholder="Subject" />
                  </div>
                </div>

                <div class="mt-3 d-flex align-items-center justify-content-end">
                  <button class="primary-btn me-3">
                    <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
                    <span>{{ $t("Cancel") }}</span>
                  </button>
                  <submittal-button :isLoading="submitted" :iconName="'finishIcon'" :buttonName="$t('Apply')" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--================================================-->
        <!--================================================-->

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue"

const
  { t } = useI18n(),

  columnOptions = [
    { value: "customer_employee", name: "Customer Employee" },
    { value: "employee", name: "Employee" },
    { value: "partner", name: "Partner" },
  ],
  emit = defineEmits(['rightBarEvent']),

  closeGlobalSetting = () => {
    emit("rightBarEvent");
  }
</script>
