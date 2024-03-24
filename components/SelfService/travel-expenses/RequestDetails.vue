<script setup lang="ts">
import {dateFormatter, capitalize} from "~/utils/helperFunctions";

const props = defineProps({
  travelExpense: {
    type: [Array, Object],
    default: {},
  },
});

</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header">
        <h3 class="card-title">User Details</h3>
      </div>
      <div class="card-body">
        <div class="row pt-3">
          <div class="col-lg-6 col-md-6 pt-3">
            <p><b>Personal Number:</b> 00002</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-3">
            <p><b>Name:</b> Marcel Rupprecht</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Email:</b> m.rupprecht@docshero.de</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Travel No.:</b> N/A</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Company:</b> N/A</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Team:</b> Produkt Entwicklung, Cloud & Infrastruktur</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Department:</b> Business Unit - Business Integration, Business Unit - Cloud & Infrastuktur</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Location:</b> Lorenzstraße 29, Karlsruhe, Baden-Württemberg, Deutschland</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card product-type mt-4">
      <div class="card-header">
        <h3 class="card-title">Travel Expense Details</h3>
      </div>
      <div class="card-body">
        <div class="row pt-3">
          <div class="col-lg-6 col-md-6 pt-3">
            <p><b>Departure City:</b> {{ travelExpense?.departureCity ?? 'N/A' }}</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-3">
            <p><b>Departure Country:</b> {{ travelExpense?.departureCountryName ?? 'N/A' }}</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Arrival City:</b> {{ travelExpense?.arrivalCity ?? 'N/A' }}</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Arrival Country:</b> {{ travelExpense?.arrivalCountryName ?? 'N/A' }}</p>
          </div>
          <div class="col-12 pt-4">
            <p><b>Request Type:</b> {{ travelExpense?.requestTypeName ?? 'N/A' }}</p>
          </div>
          <div class="col-12 pt-4">
            <p><b>Description:</b> {{ travelExpense?.description ?? 'N/A' }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="product-type row my-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">From Date and Time information</h4>
          </div>
          <div class="card-body">
            <div class="col-12 pt-4">
              <p><b>Date:</b> {{ travelExpense?.fromDate ?? 'N/A' }}</p>
            </div>
            <div class="col-12 pt-4">
              <p><b>Departure Time:</b> {{ travelExpense?.fromDepartureTime ?? 'N/A' }}</p>
            </div>
            <div class="col-12 pt-4">
              <p><b>Arrival Time:</b> {{ travelExpense?.fromArrivalTime ?? 'N/A' }}</p>
            </div>
            <div class="col-12 pt-4">
              <p><b>Discrepancy:</b> {{ travelExpense?.fromDiscrepancy ?? 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">To Date and Time information</h4>
          </div>
          <div class="card-body">
            <div class="col-12 pt-4">
              <p><b>Date:</b> {{ travelExpense?.toDate ?? 'N/A' }}</p>
            </div>
            <div class="col-12 pt-4">
              <p><b>Departure Time:</b> {{ travelExpense?.toDepartureTime ?? 'N/A' }}</p>
            </div>
            <div class="col-12 pt-4">
              <p><b>Arrival Time:</b> {{ travelExpense?.toArrivalTime ?? 'N/A' }}</p>
            </div>
            <div class="col-12 pt-4">
              <p><b>Discrepancy:</b> {{ travelExpense?.toDiscrepancy ?? 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-3 mt-5">
      <h4 class="details-title">Bill Details</h4>
      <div class="mt-3 bg-white rounded shadow mb-3">
        <table class="table table-bordered">
          <thead>
          <tr class="text-center font-weight-bold">
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("Invoice Type") }}
            </th>
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("Location") }}
            </th>
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("From Date") }}
            </th>
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("To Date") }}
            </th>
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("Description") }}
            </th>
          </tr>
          </thead>
          <tbody>
          <template v-for="item in travelExpense?.bills" :key="item.id">
            <tr class="text-center">
              <td>
                <a href="javascript:void(0)" class="text-black">
                  {{ item.invoiceTypeId?.name ?? "" }}
                </a>
              </td>
              <td class>
                <a href="javascript:void(0)" class="text-black">
                  {{ item.location }}
                </a>
              </td>
              <td class="text-black">
                <a href="javascript:void(0)" class="text-black">
                  {{ dateFormatter(item.fromDate) }}
                </a>
              </td>
              <td class="text-black">
                <a href="javascript:void(0)" class="text-black">
                  {{ dateFormatter(item.toDate) }}
                </a>
              </td>
              <td class="text-black">
                <a href="javascript:void(0)" class="text-black">
                  {{ item.description }}
                </a>
              </td>
            </tr>
          </template>
          <tr v-if="!travelExpense?.bills">
            <td class="px-6 py-4 border-top text-black" colspan="4">
              {{ $t("No bill details found") }}.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="mb-3 mt-5">
      <h4 class="details-title">Private Transportation Details</h4>
      <div class="mt-3 bg-white rounded shadow mb-3">
        <table class="table table-bordered">
          <thead>
          <tr class="text-center font-weight-bold">
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("ID") }}
            </th>
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("License Number") }}
            </th>
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("Driven Kilometers") }}
            </th>
          </tr>
          </thead>
          <tbody>
          <template v-for="item in travelExpense?.transportDetail" :key="item.id">
            <tr class="text-center">
              <td>
                <a href="javascript:void(0)" class="text-black">
                  {{ item.id }}
                </a>
              </td>
              <td>
                <a href="javascript:void(0)" class="text-black">
                  {{ item.licenseNumber }}
                </a>
              </td>
              <td class>
                <a href="javascript:void(0)" class="text-black">
                  {{ item.drivenKilometer }}
                </a>
              </td>
            </tr>
          </template>
          <tr v-if="!travelExpense?.transportDetail">
            <td class="px-6 py-4 border-top text-black" colspan="4">
              {{ $t("No bill details found") }}.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="mb-3 mt-5">
      <h4 class="details-title">Day Specifications Details</h4>
      <div class="mt-3 bg-white rounded shadow mb-3">
        <table class="table table-bordered">
          <thead>
          <tr class="text-center font-weight-bold">
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("Date") }}
            </th>
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("Is Active") }}
            </th>
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("From Time") }}
            </th>
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("To Time") }}
            </th>
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("Breakfast") }}
            </th>
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("Lunch") }}
            </th>
            <th class="pb-4 pt-6 px-6 cursor-pointer">
              {{ $t("Dinner") }}
            </th>
          </tr>
          </thead>
          <tbody>
          <template v-for="item in travelExpense?.daySpecifications" :key="item.id">
            <tr class="text-center">
              <td>
                <a href="javascript:void(0)" class="text-black">
                  {{ dateFormatter(item.date) }}
                </a>
              </td>
              <td>
                <a href="javascript:void(0)" class="text-black">
                  {{ item.isActive == 1 }}
                </a>
              </td>
              <td>
                <a href="javascript:void(0)" class="text-black">
                  {{ item.fromTime ?? "-" }}
                </a>
              </td>
              <td>
                <a href="javascript:void(0)" class="text-black">
                  {{ item.toTime ?? "-" }}
                </a>
              </td>
              <td>
                <a href="javascript:void(0)" class="text-black">
                  {{ item.breakfast == 1 }}
                </a>
              </td>
              <td>
                <a href="javascript:void(0)" class="text-black">
                  {{ item.lunch == 1 }}
                </a>
              </td>
              <td class>
                <a href="javascript:void(0)" class="text-black">
                  {{ item.dinner == 1 }}
                </a>
              </td>
            </tr>
          </template>
          <tr v-if="!travelExpense?.daySpecifications">
            <td class="px-6 py-4 border-top text-black" colspan="4">
              {{ $t("No bill details found") }}.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>

.min-height-100 {
  min-height: 100px;
}

.details-title {
  color: #38414A;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  margin: 0;
}

</style>
