<script setup lang="ts">
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode();
const { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Invoices",
      to: "/finance/invoices",
    },
    {
      text: "Show",
      active: true,
    },
  ],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Invoice Show");
const id = router.params.id;

useHead({
  title: title,
});
</script>

<template>
  <div class="">
    <page-header :title="title" :items="items" />
    <div class="invoice-view">
      <div class="invoice-header">
        <h1>Invoice</h1>
        <elements-icon v-bind:icon="'docHerologo'" />
      </div>
      <div class="invoice-body">
        <div class="row">
          <div class="col-lg-8 left-side">
            <h4>DocsHero GmbH | Lorenzstraße 29 | 76135 Karlsruhe</h4>
            <p>Altus AG</p>
            <p>Kleinoberfeld</p>
            <p>576135 - Karlsruhe</p>
            <p>Germany</p>
          </div>
          <div class="col-lg-4">
            <ul>
              <li>
                <h4>INVOICE NO</h4>
                <p>23-76043</p>
              </li>
              <li>
                <h4>DUE DATE</h4>
                <p>2023-07-16</p>
              </li>
              <li>
                <h4>Created By</h4>
                <p>Marcel Rupprecht</p>
              </li>
              <li>
                <h4>Customer Nr.</h4>
                <p>100001</p>
              </li>
              <li>
                <h4>System Nr.</h4>
                <p>N.A.</p>
              </li>
              <li>
                <h4>Project Nr.</h4>
                <p>N.A.</p>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h2 class="mb-1">Invoice 23-76097 - Daikin Chemical Europe GmbH</h2>
          <h4 class="mb-0">Service According to Performance Record 2023-10120</h4>
          <h4>Service Period 15-08-2023 to 31-08-2023</h4>
        </div>
        <div class="table-responsive mt-3">
          <table class="doc-table table">
            <thead>
              <tr>
                <th>{{ $t('POS') }}</th>
                <th>{{ $t('ARTICLE NUMBER') }}</th>
                <th>{{ $t('PRODUCT NAME') }}</th>
                <th>{{ $t('QUANTITY') }}</th>
                <th>{{ $t('PRODUCT PRICE') }}</th>
                <th>{{ $t('DISCOUNT(%)') }}</th>
                <th>{{ $t('NETTO TOTAL') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>DL-1020</td>
                <td>Customizing - Zusatzleistung</td>
                <td>10 Stunden</td>
                <td>€ 170.00</td>
                <td>0</td>
                <td>€ 17000.00</td>
              </tr>
              <tr>
                <td>2</td>
                <td>DL-1020</td>
                <td>Customizing - Zusatzleistung</td>
                <td>10 Stunden</td>
                <td>€ 160.00</td>
                <td>0</td>
                <td>€ 16000.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="divider"></div>
        <div class="d-flex align-items-center justify-content-end">
          <div class="netto-total">
            <ul>
              <li>
                <h4>Netto</h4>
                <p>€ 1700.00</p>
              </li>
              <li>
                <h4>DISCOUNT 5%</h4>
                <p>€ 1700.00</p>
              </li>
              <li class="total">
                <h4>Total</h4>
                <h4>€ 2023.00</h4>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="invoice-footer">
        <h4 style="text-transform: uppercase;">Payment terms:</h4>
        <p>Payment within 14 days of receipt of invoice without deductions.</p>
        <p>
          The goods remain our property until full payment.</p>
        <p>
          The date of service corresponds to the invoice date unless otherwise stated.</p>
        <p>
          The invoice was created automatically and is legally valid without a signature.</p>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.invoice-view {
  border-left: 24px solid #1E448E;
  padding: 35px;

  .invoice-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 35px;

    h1 {
      color: #1F2229;
      font-size: 26px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }

  .invoice-body {
    h2 {
      color: #000;
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 13px;
      text-transform: uppercase;
    }

    .left-side {
      p {
        color: #000;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 13px;
      }
    }

    ul {
      margin: 0;
      padding: 0;

      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;
      }
    }

    h4 {
      color: #000;
      font-size: 12px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
      letter-spacing: 0.002px;
      margin-bottom: 6px;
    }

    p {
      color: #38414A;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    .divider {
      width: 100%;
      height: 1px;
      background: #000;
    }

    .table-responsive {
      border-radius: 0;

      table {
        thead {
          tr {
            th {
              background: rgba(30, 68, 142, 0.15) !important;
              color: #1E448E !important;
              font-size: 12px;
              font-style: normal;
              font-weight: 900;
              line-height: normal;
              border: none;
              border-radius: 0;
            }
          }
        }

        tbody {
          tr {
            td {
              border-left: 0;
              border-right: 0;
            }
          }
        }
      }
    }

    .netto-total {
      ul {
        padding: 0;
        margin: 0;
        width: 350px;
        margin-top: 15px;

        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          border-bottom: 1px solid #E7E8EC;
          margin: 0;
        }

        li.total {
          border-radius: 2px;
          background: rgba(245, 150, 48, 0.15);

          h4 {
            font-size: 14px;
          }
        }
      }
    }
  }

  .invoice-footer {
    margin-top: 150px;

    h4 {
      color: #000;
      font-size: 12px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
      letter-spacing: 0.002px;
      margin-bottom: 6px;
    }

    p {
      color: #38414A;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 18px;
    }
  }
}
</style>